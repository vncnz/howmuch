;var ProgettoModule = function(){
	var createPageHtml = function(model){
		console.log(" --- creating object --- ");
		var html = '<tr id="project_'+model.key+'" class="az_'+model.azienda+'">'; 
		html += '<td>';
		html += '<select disabled="disabled" class="aziendakey disabled" >';
		for(var i=0; i<Aziende.lista.length; i++) {
			var m = Aziende.lista[i];
			html += '<option value="'+m.key+'"'+(m.key==model.azienda ? 'selected="selected"':'')+'>'+m.name+'</option>';
			//console.log(m.key +"=="+ model.azienda + " -> " + (m.key==model.azienda));
		}
		html += '</select>';
		html += '</td>';
		html += '<td><input disabled="disabled" class="name disabled" name="name" type="text" value="'+model.name+'" title="'+model.name+'" /></td>';
		html += '<td class="right_text">';
		html += '<span style="margin-left: 2%;">&euro; </span>';
		html += '<input type="number" min="0" step="0.5" class="small_input edit_company_eurh disabled" name="edit_company_eurh_' + model.eur + '" id="edit_company_eurh_' + model.eur_h + '" value="' + model.eur + '" disabled="disabled" />';
		html += '</td>';
		html += '<td><input disabled="disabled" class="closed disabled" name="closed" type="checkbox" '+(model.closed ? 'checked="checked"' : '')+'/></td>';
		html += '<td>';
		html += '<a href="#edit" prkey="' + model.key + '" class="edit_project" title="Modifica i dati del progetto">';
		html += '<img src="imgs/pencil_icon16_black.png" />';
		html += '</a>';
		html += '<a href="#save" prkey="' + model.key + '" class="save_project" title="Salva le modifiche">';
		html += '<img src="imgs/checkmark_icon16_black.png" />';
		html += '</a>';
		html += '</td>';
		html += '<td><a href="#delete" prkey="' + model.key + '" class="delete_project" title="Cancella il progetto">';
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
		html += '<a href="#" id="search_project" title="Filtra i risultati"><img src="imgs/refresh_icon24_black.png" /></a>';
		html += '</div>';
		html += '<div class="filter_button">';
		html += '<a href="#" id="refresh_project" title="Ricarica la tabella"><img src="imgs/zoom_icon24_black.png" /></a>';
		html += '</div>';
		html += '<select multiple="multiple" id="filter_azienda">';
		//html += '<option value="*">Vedi tutto</option>';
		for(var i=0; i<Aziende.lista.length; i++) {
			var m = Aziende.lista[i];
			html += '<option value="'+m.key+'">'+m.name+'</option>';
		}
		html += '</select>';
		html += '</div>';
		html += '</div>';
		
		return html;
	};
	
	var createNewProgettoForm = function(){
		var html = '<div class="add_new_item" id="project_">';
		html += '<div class="section_title"><h3>Aggiungi nuovo progetto</h3></div>';
		html += '<div class="form_field first_field">'; 
		html += '<label>Cliente</label><br />';
		html += '<select class="aziendakey">';
		for(var i=0; i<Aziende.lista.length; i++) {
			var m = Aziende.lista[i];
			html += '<option value="'+m.key+'">'+m.name+'</option>';
		}
		html += '</select>';
		html += '</div><div class="form_field">';
		html += '<label>Nome</label><br /><input class="name" name="name" type="text" />';
		html += '</div><div class="form_field"  title="Specifica un compenso solo se vieni pagato a progetto e non a ore">';
		html += '<label>Compenso (&euro;)</label><br /><input class="eur" name="eur" type="number" min="0" step="0.5" />';
		html += '</div><div class="form_field">';
		html += '<label>Chiuso</label><br /><input class="closed" name="closed" type="checkbox"/>';
		html += '</div>';
		html += '<div class="form_field">';
		html += '<div>&nbsp;</div>';
		html += '<a href="#save" class="form_button save_project" id="save_project" prkey="" title="Salva nuovo progetto">';
		html += '<img src="imgs/round_plus_icon24_black.png" />';
		html += '</a>';
		html += '</div>';
		html += '</div>';
		
		return html;
	};
	
	return {
		init: function(){
			Progetto.deleting = new Array();
			$('div#mainContainer').undelegate(".save_project", "click").delegate(".save_project", "click", function(e){
				e.preventDefault();
				
				var prkey = $(this).attr("prkey") || "";
				var project = Progetto.create(prkey || null, $('#project_' + prkey + ' .aziendakey').val(), $('#project_' + prkey + ' .name').val(), $('#project_' + prkey + ' .eur').val(), $('#project_' + prkey + ' .closed').is(":checked"));
				Progetto.addNewProgetto(project);
				
				return false;
			});
			
			$('div#mainContainer').undelegate(".edit_project", "click").delegate(".edit_project", "click", function(e){
				e.preventDefault();
				
				var prkey = $(this).attr("prkey");
				$('#project_' + prkey + ' input, #project_' + prkey + ' select').attr("disabled", false);
				$('#project_' + prkey + ' .edit_project').hide();
				//$('#company_' + azkey + ' .delete_company').hide();
				$('#project_' + prkey + ' .save_project').show();
				
				$('#project_' + prkey + ' input, #project_' + prkey + ' select').removeClass("disabled");
				
				return false;
			});
			
			$('div#mainContainer').undelegate(".delete_project", "click").delegate(".delete_project", "click", function(e){
				e.preventDefault();
				
				var prkey = $(this).attr("prkey");
				if($('#project_'+prkey).hasClass("deleting")){
					noty({
						type: "warning",
						layout: "topCenter",
						text: "<strong>Progetto gi&agrave; selezionato!</strong>",
						timeout: 3000
					});
				} else {
					Progetto.markForDeleting(prkey);
				}

				return false;
			});
			/*$('div#mainContainer').undelegate("#filter_azienda", "change").delegate("#filter_azienda", "change", function(e){
				e.preventDefault();
				
				var val = $("#filter_azienda").val();
				if(val!="*") {
					$("div#mainContainer tbody tr").fadeOut();
					$("tr.az_"+$("#filter_azienda").val()).fadeIn();
				} else {
					$("div#mainContainer tr").fadeIn();
				}
				
				return false;
			});*/
		},
		getProgettiPage: function(projectData){
			$.ajax({
				url: "/project",
				type: "GET",
				data: {},
				success: function(result){
					result = JSON.parse(result);
					Progetto.lista = new Array();
					
					var allhtml = '<div class="title">Gestione progetti</div>';
					allhtml += createNewProgettoForm();
					allhtml += '<hr />';
					allhtml += '<div class="item_list">';
					allhtml += '<div class="section_title"><h3>Elenco progetti</h3></div>'
					if(!result.data.length)
						allhtml += '<div><h4>Non &egrave; presente nessun progetto!</h4></div>';
					else{
						allhtml += '<table><thead>';
						allhtml += '<th>Cliente</th>';
						allhtml += '<th>Nome</th>';
						allhtml += '<th>Compenso (&euro;)</th>';
						allhtml += '<th>Chiuso</th>';
						allhtml += '<th colspan="2"></th>';
						allhtml += '</thead><tbody>';
						for(var i = 0; i < result.data.length; i++) {
							var model = result.data[i];
							Progetto.lista.push(model);
							allhtml += createPageHtml(model);
						}
						allhtml += '</tbody></table>';
					}
					allhtml += '</div>';
					allhtml += createSearchForm();
						
					$("div#mainContainer").html(allhtml);
					initDatepickers();
					$('select#filter_azienda').select({
						maxItemDisplay: 2,
						onclick: function(selArray){
							if(!selArray || !selArray.length) {
								$("div#mainContainer tbody tr").fadeIn();
							} else {
								//console.log(JSON.stringify(selArray));
								$("div#mainContainer tbody tr").fadeOut();
								for(var i=0; i<selArray.length; i++) {
									var k = selArray[i];
									$("tr.az_"+k).fadeIn();
								}
							}
						}
					});
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		addNewProgetto: function(model){
			$.ajax({
				url:"/project?method=write",
				type: "GET",
				data: model,
				success:function(result){
					result = JSON.parse(result);
					checkResponse(result);
					window.setTimeout(function(){
						Progetto.getProgettiPage({});
					}, 400);
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		markForDeleting: function(key) {
			$("#project_"+key).addClass("deleting");
			Progetto.deleting.push(key);
			if(Progetto.deleting.length==1) {
				askConfirm("Puoi continuare a selezionare record, quando hai terminato clicca per confermare l&apos;eliminazione o annullare la selezione", Progetto.deleteProgetti, Progetto.resetDeleting);
			}
		},
		deleteProgetti: function(key){
			$.ajax({
				url:"/project?method=delete",
				type: "GET",
				data: {"keys":Progetto.deleting.join("%20")},
				success:function(result){
					Progetto.resetDeleting();
					result = JSON.parse(result);
					checkResponse(result);
					for(var i=0; i<result.data.keys.length; i++) {
						$("#project_"+result.data.keys[i]).fadeOut(function(){
							$("#project_"+result.data.keys[i]).remove();
						});
					}
					/*window.setTimeout(function(){
						Session.getSessionPage({});
					}, 300);*/
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		resetDeleting: function() {
			$("tr.deleting").removeClass("deleting");
			Progetto.deleting = new Array();
		},
		deleteProgetto: function(key){
			$.ajax({
				url:"/project?method=delete",
				type: "GET",
				data: {"key":key},
				success:function(result){
					result = JSON.parse(result);
					checkResponse(result);
					window.setTimeout(function(){
						Progetto.getProgettiPage({});
					}, 300);
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		create: function(key, azienda, name, eur, closed){
			var model = new Object();
			model.key = key;
			model.azienda = azienda;
			model.name = name;
			model.closed = closed;
			model.eur = eur || 0;
			return model;
		}
	};
}();

var Progetto = ProgettoModule;