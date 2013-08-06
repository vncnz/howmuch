;var SessionModule = function(){
	var createPageHtml = function(model){
		var html = '<tr id="session_'+model.key+'" class="pr_'+model.progetto+'">'; 
		html += '<td>';
		html += '<select disabled="disabled" class="progettokey disabled" >';
		for(var i=0; i<Progetto.lista.length; i++) {
			var m = Progetto.lista[i];
			html += '<option value="'+m.key+'"'+(m.key==model.progetto ? 'selected="selected"':'')+'>'+m.name+'</option>';
		}
		html += '</select>';
		html += '</td>';
		//html += '<td><input disabled="disabled" class="datetimepicker start_time disabled" name="start_time" type="text" size=25 value="'+model.start+'" /></td>';
		//html += '<td><input disabled="disabled" class="datetimepicker end_time disabled" name="end_time" type="text" size=25 value="'+model.end+'" /></td>';
		html += '<td>';
		var d = (new Date(model.start));
		var v = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
		html += '<input disabled="disabled" class="datepicker date_picker disabled" name="date_picker" sekey="'+model.key+'" value="'+v+'" type="text" size=20 />';
		html += '</td>';
		html += '<td>';
		html += '<div class="hourslider" start_time="'+model.start+'" end_time="'+model.end+'">&nbsp;</div>';
		html += '</td>';
		html += '<td>';
		html += '<a href="#edit" sekey="' + model.key + '" class="edit_session" title="Modifica i dati del progetto">';
		html += '<img src="imgs/pencil_icon16_black.png" />';
		html += '</a>';
		html += '<a href="#save" sekey="' + model.key + '" class="save_session" title="Salva le modifiche">';
		html += '<img src="imgs/checkmark_icon16_black.png" />';
		html += '</a>';
		html += '</td>';
		html += '<td><a href="#delete" sekey="' + model.key + '" class="delete_session" title="Cancella il progetto">';
		html += '<img src="imgs/delete_icon16_black.png" />';
		html += '</a></td>';
		
		html += "</tr>";
		
		return html; 
	};
	
	var createSearchForm = function(){
		var html = '<div class="filter_items">';
		html += '<div class="section_title"><h3>Filtri</h3></div>'
		html += '<div class="filter_buttons">';
		html += '<div class="filter_button">';
		html += '<a href="#" id="search_session" title="Filtra i risultati"><img src="imgs/refresh_icon24_black.png" /></a>';
		html += '</div>';
		html += '<div class="filter_button">';
		html += '<a href="#" id="refresh_session" title="Ricarica la tabella"><img src="imgs/zoom_icon24_black.png" /></a>';
		html += '</div>';
		html += '<select multiple="multiple" id="filter_progetto">';
		//html += '<option value="*">Vedi tutto</option>';
		for(var i=0; i<Progetto.lista.length; i++) {
			var m = Progetto.lista[i];
			html += '<option value="'+m.key+'">'+m.name+'</option>';
		}
		html += '</select>';
		html += '</div>';
		html += '</div>';
		
		return html;
	};
	
	var createNewSessionForm = function(){
		var html = '<div class="add_new_item" id="session_">';
		html += '<div class="section_title"><h3>Aggiungi una nuova sessione di lavoro</h3></div>';
		html += '<div class="form_field first_field">'; 
		html += '<label>Progetto</label><br />';
		html += '<select class="progettokey">';
		for(var i=0; i<Progetto.lista.length; i++) {
			var m = Progetto.lista[i];
			html += '<option value="'+m.key+'">'+m.name+'</option>';
		}
		html += '</select>';
		//html += '</div><div class="form_field">';
		//html += '<label>Inizio</label><br /><input class="datetimepicker start_time" name="start_time" type="text" size=25 />';
		//html += '</div><div class="form_field">';
		//html += '<label>Fine</label><br /><input class="datetimepicker end_time" name="end_time" type="text" size=25 />';
		html += '</div>';
		html += '<div class="form_field">';
		html += '<label>Data</label><br /><input class="datepicker date_picker" name="date_picker" type="text" size=20 />';
		html += '</div><div class="form_field">';
		html += '<label>Intervallo</label><br /><div class="hourslider">&nbsp;</div>';
		html += '</div>';
		html += '<div class="form_field">';
		html += '<div>&nbsp;</div>';
		html += '<a href="#save" class="form_button save_session" id="save_session" sekey="" title="Crea la nuova sessione">';
		html += '<img src="imgs/round_plus_icon24_black.png" />';
		html += '</a>';
		html += '</div>';
		html += '</div>';
		
		return html;
	};
	
	return {
		init: function(){
			Session.deleting = new Array();
			$('div#mainContainer').undelegate(".save_session", "click").delegate(".save_session", "click", function(e){
				e.preventDefault();
				
				var sekey = $(this).attr("sekey") || "";
				//var session = Session.create(sekey || null, $('#session_' + sekey + ' .progettokey').val(), $('#session_' + sekey + ' .start_time').val(), $('#session_' + sekey + ' .end_time').val());
				var values = $('#session_' + sekey + ' .hourslider').dateRangeSlider("values");
				if(!sekey && !$('#session_' + sekey + ' .date_picker').val()) {
					checkResponse({
						'resultType': 'error',
						'msg': 'Non hai specificato una data'
					});
					return false;
				}
				var session = Session.create(sekey || null, $('#session_' + sekey + ' .progettokey').val(), 
											 values.min, 
											 values.max);
				//alert(JSON.stringify(session));
				Session.addNewSession(session);
				
				return false;
			});
			
			$('div#mainContainer').undelegate(".edit_session", "click").delegate(".edit_session", "click", function(e){
				e.preventDefault();
				
				var sekey = $(this).attr("sekey");
				$('#session_' + sekey + ' input, #session_' + sekey + ' select').attr("disabled", false);
				$('#session_' + sekey + ' .edit_session').hide();
				$('#session_' + sekey + ' .save_session').show();
				
				$('#session_' + sekey + ' input, #session_' + sekey + ' select').removeClass("disabled");
				$('#session_' + sekey + ' .hourslider').dateRangeSlider("enable");
				
				return false;
			});
			
			$('div#mainContainer').undelegate(".delete_session", "click").delegate(".delete_session", "click", function(e){
				e.preventDefault();
				
				var sekey = $(this).attr("sekey");
				if($('#session_'+sekey).hasClass("deleting")){
					noty({
						type: "warning",
						layout: "topCenter",
						text: "<strong>Sessione di lavoro gi&agrave; selezionata!</strong>",
						timeout: 3000
					});
				}
				else{
					Session.markForDeleting(sekey);
				}
				
				return false;
			});
			/*$('div#mainContainer').undelegate("#filter_progetto", "change").delegate("#filter_progetto", "change", function(e){
				e.preventDefault();
				
				var val = $("#filter_progetto").val();
				if(val!="*") {
					$("div#mainContainer tbody tr").fadeOut();
					$("tr.pr_"+$("#filter_progetto").val()).fadeIn();
				} else {
					$("div#mainContainer tr").fadeIn();
				}
				
				return false;
			});*/
		},
		getSessionPage: function(sessionData){
			$.ajax({
				url: "/session",
				type: "GET",
				data: {},
				success: function(result){
					result = JSON.parse(result);
					
					if(result.status == 0){
						var allhtml = '<div class="title">Gestione sessioni di lavoro</div>';
						allhtml += createNewSessionForm();
						allhtml += '<hr />';
						allhtml += '<div class="item_list">';
						allhtml += '<div class="section_title"><h3>Elenco sessioni</h3></div>'
						if(!result.data.length)
							allhtml += '<div><h4>Non &egrave; presente nessuna sessione di lavoro!</h4></div>';
						else{
							allhtml += '<table><thead>';
							allhtml += '<th>Progetto</th>';
							//allhtml += '<th>Inizio UTC (per test)</th>';
							//allhtml += '<th>Fine UTC (per test)</th>';
							allhtml += '<th>Data</th>';
							allhtml += '<th>Intervallo</th>';
							allhtml += '<th colspan="2"></th>';
							allhtml += '</thead><tbody>';
							for(var i = 0; i < result.data.length; i++) {
								var model = result.data[i];
								allhtml += createPageHtml(model);
							}
							allhtml += '</tbody></table>';
						}
						allhtml += '</div>';
						allhtml += createSearchForm();
							
						$("div#mainContainer").html(allhtml);
						//initDatepickers();
						$('.datepicker').datepicker({
							dateFormat: "dd/mm/yy"
						});
						$('.datepicker').change(function(){
							Session.onChangeDate($(this).attr("sekey") || '');
						});
						initRanges();
						$('select#filter_progetto').select({
							maxItemDisplay: 2,
							onclick: function(selArray){
								if(!selArray || !selArray.length) {
									$("div#mainContainer tbody tr").fadeIn();
								} else {
									$("div#mainContainer tbody tr").fadeOut();
									for(var i=0; i<selArray.length; i++) {
										var k = selArray[i];
										$("tr.pr_"+k).fadeIn();
									}
								}
							}
						});
						
						hideLoader();
					}
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		onChangeDate: function(key){
			var valueDate = $('#session_' + key + ' .date_picker').datepicker( "getDate" );
			var values = $('#session_' + key + ' .hourslider').dateRangeSlider("values");
			var n = new Date(valueDate.getFullYear(), valueDate.getMonth(), valueDate.getDate(), 0, 0);
			var x = new Date(valueDate.getFullYear(), valueDate.getMonth(), valueDate.getDate(), 23, 59);
			values.min.setMonth(valueDate.getMonth());
			values.min.setDate(valueDate.getDate());
			values.min.setFullYear(valueDate.getFullYear());
			values.max.setMonth(valueDate.getMonth());
			values.max.setDate(valueDate.getDate());
			values.max.setFullYear(valueDate.getFullYear());
			$('#session_' + key + ' .hourslider').dateRangeSlider("bounds", n, x);
			$('#session_' + key + ' .hourslider').dateRangeSlider("values", values.min, values.max);
		},
		addNewSession: function(model){
			$.ajax({
				url:"/session?method=write",
				type: "GET",
				data: model,
				success:function(result){
					result = JSON.parse(result);
					
					checkResponse(result);
					
					if(result.status == 0){
						window.setTimeout(function(){
							Session.getSessionPage({});
							//alert("Record salvato con successo");
						}, 400);
					}
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		markForDeleting: function(key) {
			$("#session_"+key).addClass("deleting");
			Session.deleting.push(key);
			if(Session.deleting.length==1) {
				askConfirm("Puoi continuare a selezionare record, quando hai terminato clicca per confermare l&apos;eliminazione o annullare la selezione", Session.deleteSessions, Session.resetDeleting);
			}
		},
		deleteSessions: function(key){
			$.ajax({
				url:"/session?method=delete",
				type: "GET",
				data: {"keys":Session.deleting.join("%20")},
				success:function(result){
					Session.resetDeleting();
					result = JSON.parse(result);
					
					checkResponse(result);
					
					if(result.status == 0){
						for(var i=0; i<result.data.keys.length; i++) {
							$("#session_"+result.data.keys[i]).fadeOut(function(){
								$("#session_"+result.data.keys[i]).remove();
							});
						}
						/*window.setTimeout(function(){
							Session.getSessionPage({});
						}, 300);*/
					}
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		resetDeleting: function() {
			$("tr.deleting").removeClass("deleting");
			Session.deleting = new Array();
		},
		deleteSession: function(key){
			$.ajax({
				url:"/session?method=delete",
				type: "GET",
				data: {"key":key},
				success:function(result){
					result = JSON.parse(result);
					
					checkResponse(result);
					
					if(result.status == 0){
						window.setTimeout(function(){
							Session.getSessionPage({});
						}, 300);
					}
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		create: function(key, progetto, start, end){
			var model = new Object();
			model.key = key;
			model.progetto = progetto;
			model.start = start.toJSON();
			model.end = end.toJSON();
			return model;
		}
	};
}();

var Session = SessionModule;