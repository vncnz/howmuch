/*
* jQuery UI Select @VERSION
*
* Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* http://docs.jquery.com/UI/Select
*
* Depends:
*    jquery.ui.core.js
*    jquery.ui.widget.js
*    jquery.ui.position.js
*/
(function($) {
	// role=application on body required for screenreaders to correctly interpret aria attributes
	if (!$(document.body).is('[role]')) {
		$(document.body).attr('role', 'application');
	}
	var increments = 0;
	$.widget("ui.select", {
		// default options
		options: {
			multiple: false,
			maxItemDisplay: 3,
			timeout: 500,
			autosize: true,
			onclick: function(){}
		},
		hideTimer: null,
		_create: function() {
			// Add to the increments
			increments++;
			
			// Create a local scope variable of this
			var self = this;

			// Hide the original select
			this.element.hide();

			// If select has multiple attribute, update options
			if (this.element.attr("multiple")) {
				this.options.multiple = true;
			}

			// Button icon and text
			this.buttonIcon = $("<span></span>").addClass("ui-button-icon-secondary ui-icon ui-icon-triangle-1-s");
			this.buttonText = $("<span></span>").addClass("ui-button-text").text("Show all");

			// Button
			// BUG: For some reason we have to add the button type directly in the html
			// Adding it with attr will not work, even though it's not added to the DOM
			this.button = $('<button type="button"></button>')
				.addClass("ui-select ui-button ui-state-default ui-widget ui-corner-all ui-button-text-icon-secondary")
				.attr("aria-disabled", "false")
				.attr("role", "button")
				.append(this.buttonText, this.buttonIcon)
				.bind({
					mouseover: function(event, ui) {
						self.clearTimer();
						self.button.addClass("ui-state-hover");
					},
					mouseout: function(event, ui) {
						self.button.removeClass("ui-state-hover");
						self.hide();
					},
					click: function(event, ui) {
						if (self.button.hasClass("ui-state-active")) {
							self._close(event);
						} else {
							self._show(event);
						}
					}
				});

			// Container for the menu (we can't use ul directly because of positioning/animation issues)
			this.menuContainer = $("<div></div>")
				.css("position", "absolute")
				.css("zIndex", 1000 + increments)
				.hide();
			
			// Menu
			this.menu = $("<ul></ul>")
				.addClass("ui-select-menu ui-menu ui-widget ui-widget-content ui-corner-all")
				.bind({
					mouseover: function(event, ui) {
						self.clearTimer();
					},
					mouseout: function(event, ui) {
						self.hide();
					}
				})
				.appendTo(this.menuContainer);
			
			// Dummy that we can use to create optgroups
			$menuGroupDummy = $("<ul></ul>")
				.addClass("ui-select-menu-group ui-menu ui-widget ui-widget-content ui-corner-all");

			// Dummy that we use to create the menu items
			$menuItemDummy = $('<li class="ui-menu-item" role="menu-item"></li>')
				.append(
					$("<a></a>")
						.attr("href", "#")
						.addClass("ui-corner-all")
						.bind({
						mouseover: function(event, ui) {
							$(this).addClass("ui-state-hover");
						},
						mouseout: function(event, ui) {
							$(this).removeClass("ui-state-hover");
						},
						click: function(event, ui) {
							var $opt = $(this);
							if (!self.options.multiple) {
								self.menu.find(".ui-state-active").not($opt).removeClass("ui-state-active");
							}
							$opt.toggleClass("ui-state-active");
							self._select(event);
							event.preventDefault();
							return false;
						}
					})
				);
			
			// Loop through the select options/groups and create equivalent menu items
			this.element.children().each(function() {
				switch (this.nodeName) { 
					case 'OPTGROUP':
						var $optgrp = $(this),
							$grp = $menuGroupDummy.clone(true);

						$optgrp.children().each(function(){
							var $opt = $(this);
							$menuItemDummy.clone(true)
								.find("a")
								.text($opt.text())
								.attr("rel", $opt.val())
								.end()
								.appendTo($grp);
						});

						$menuItemDummy.clone(true)
							.find("a")
							.text($optgrp.attr("label"))
							.append($grp)
							.append('<div class="ui-helper-reset" style="clear: both;"></div>')
							.end()
							.appendTo(self.menu);

					break;
						
					case 'OPTION':
						var $opt = $(this);
						$menuItemDummy.clone(true)
							.find("a")
							.text($opt.text())
							.attr("rel", $opt.val())
							.end()
							.appendTo(self.menu);
					break;
				}
			});

			// Add everything to the DOM
			this.element.after(this.button, this.menuContainer);
		},
		clearTimer: function() {
			if (this.hideTimer) {
				clearTimeout(this.hideTimer);
				this.hideTimer = null;
			}
		},
		hide: function() {
			var self = this;
			this.hideTimer = setTimeout(function() {
				self._close(event);
			}, this.options.timeout);
		},
		_select: function(event) {
			var self = this,
				selected = this.menu.find(".ui-state-active");
			
			if (selected.length) {
				var selArr = [],
					selText = '';
				selected.each(function(i, elm) {
					selArr.push($(this).attr("rel"));
					selText += $(this).text() + ", ";
				});
				selText = selText.substring(0, selText.length - 2);
				this.element.val(selArr);
				if (selected.length > 1) {
					if (selected.length > this.options.maxItemDisplay) {
						this.buttonText.text(selected.length + " items selected");
					} else {
						this.buttonText.text(selText);
					}
				} else {
					this.buttonText.text(selected.text());
				}
			} else {
				this.buttonText.text("Show all");
			}
			// Let's close the menu if we're not allowed to select multiple items
			if (!this.options.multiple) {
				this._close(event);
			}
			this.options.onclick(selArr);
		},
		_show: function(event) {
			var os = this.button.offset();
			this.button.addClass("ui-state-active");
			this.buttonIcon.removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-n");
			
			// Let's calculate width and set position
			// We have to quickly show it to position it properly
			// BUG: Why do we have to remove 4 pixels?
			var buttonWidth = this.button.innerWidth()-4;
			this.menuContainer.show().width(this.menu.width());
			
			// If autosizing is enabled or menu is thinner then button, set to same width as button
			if (this.options.autozise || (this.menuContainer.width() < buttonWidth)) {
				this.menuContainer.width(buttonWidth);
			}
			
			// Now for the positioning
			this.menuContainer
				.position({
					my: "left top",
					at: "left bottom",
					of: this.button
				})
				.hide()
				.css("zIndex", increments + 1)
				.show("fade", 100);
		},
		_close: function(event, instant) {
			this.buttonIcon.removeClass("ui-icon-triangle-1-n").addClass("ui-icon-triangle-1-s");
			this.button.removeClass("ui-state-active");
			// TODO: Close all other menus if there are any open
			// $(".ui-select").not(this.element).select("close", true);
			this.menuContainer.css("zIndex", increments - 1);
			if (instant) {
				this.menuContainer.hide();
			} else {
				this.menuContainer.hide("fade", 100);
			}
		},
		_setOption: function(key, value) {
			// TODO: Handle new options
		},
		destroy: function() {
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});

})(jQuery);