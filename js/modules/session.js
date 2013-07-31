var SessionModule = function(){
	var createPageHtml = function(model){
		console.log(" --- creating object --- ");
		var html = '<tr id="session_'+model.key+'" class="pr_'+model.progetto+'">'; 
		html += '<td>';
		html += '<select disabled="disabled" class="progettokey disabled" >';
		for(var i=0; i<Progetto.lista.length; i++) {
			var m = Progetto.lista[i];
			html += '<option value="'+m.key+'"'+(m.key==model.progetto ? 'selected="selected"':'')+'>'+m.name+'</option>';
		}
		html += '</select>';
		html += '</td>';
		html += '<td><input disabled="disabled" class="datetimepicker start_time disabled" name="start_time" type="text" size=25 value="'+model.start+'" /></td>';
		html += '<td><input disabled="disabled" class="datetimepicker end_time disabled" name="end_time" type="text" size=25 value="'+model.end+'" /></td>';
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
		html += '<select id="filter_progetto">';
		html += '<option value="*">Vedi tutto</option>';
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
		html += '</div><div class="form_field">';
		html += '<label>Inizio</label><br /><input class="datetimepicker start_time" name="start_time" type="text" size=25 />';
		html += '</div><div class="form_field">';
		html += '<label>Fine</label><br /><input class="datetimepicker end_time" name="end_time" type="text" size=25 />';
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
				var session = Session.create(sekey || null, $('#session_' + sekey + ' .progettokey').val(), $('#session_' + sekey + ' .start_time').val(), $('#session_' + sekey + ' .end_time').val());
				//alert(JSON.stringify(session));
				Session.addNewSession(session);
				
				return false;
			});
			
			$('div#mainContainer').undelegate(".edit_session", "click").delegate(".edit_session", "click", function(e){
				e.preventDefault();
				
				var sekey = $(this).attr("sekey");
				$('#session_' + sekey + ' input, #session_' + sekey + ' select').attr("disabled", false);
				$('#session_' + sekey + ' .edit_session').hide();
				//$('#company_' + azkey + ' .delete_company').hide();
				$('#session_' + sekey + ' .save_session').show();
				
				$('#session_' + sekey + ' input, #session_' + sekey + ' select').removeClass("disabled");
				
				return false;
			});
			
			$('div#mainContainer').undelegate(".delete_session", "click").delegate(".delete_session", "click", function(e){
				e.preventDefault();
				
				var sekey = $(this).attr("sekey");
				
				Session.markForDeleting(sekey);
				//Session.deleteSession(sekey);
				
				return false;
			});
			$('div#mainContainer').undelegate("#filter_progetto", "change").delegate("#filter_progetto", "change", function(e){
				e.preventDefault();
				
				var val = $("#filter_progetto").val();
				if(val!="*") {
					$("div#mainContainer tr").fadeOut();
					$("tr.pr_"+$("#filter_progetto").val()).fadeIn();
				} else {
					$("div#mainContainer tr").fadeIn();
				}
				//alert("tr.pr_"+$("#filter_progetto").val());
				
				return false;
			});
		},
		getSessionPage: function(sessionData){
			$.ajax({
				url: "/session",
				type: "GET",
				data: {},
				success: function(result){
					result = JSON.parse(result);
					
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
						allhtml += '<th>Inizio</th>';
						allhtml += '<th>Fine</th>';
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
					initDatepickers();
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		addNewSession: function(model){
			$.ajax({
				url:"/session?method=write",
				type: "GET",
				data: model,
				success:function(result){
					result = JSON.parse(result);
					checkResponse(result);
					window.setTimeout(function(){
						Session.getSessionPage({});
						//alert("Record salvato con successo");
					}, 400);
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
			alert("Da modificare!");
			Session.resetDeleting();
			/*$.ajax({
				url:"/session?method=delete",
				type: "GET",
				data: {"key":key},
				success:function(result){
					result = JSON.parse(result);
					checkResponse(result);
					window.setTimeout(function(){
						Session.getSessionPage({});
					}, 300);
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});*/
		},
		resetDeleting: function() {
			$("tr.deleting").removeClass("deleting");
			Session.deleting = new Array();
		},
		create: function(key, progetto, start, end){
			var model = new Object();
			model.key = key;
			model.progetto = progetto;
			model.start = start;
			model.end = end;
			return model;
		}
	};
}();

var Session = SessionModule;