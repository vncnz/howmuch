var SessionModule = function(){
	var createPageHtml = function(model){
		console.log(" --- creating object --- ");
		var html = '<tr id="session_'+model.key+'">'; 
		html += '<td>';
		html += '<select readonly="readonly" class="aziendakey" >';
		for(var i=0; i<Aziende.lista.length; i++) {
			var m = Aziende.lista[i];
			html += '<option value="'+m.key+'"'+(m.key==model.azienda ? 'selected="selected"':'')+'>'+m.name+'</option>';
			//console.log(m.key +"=="+ model.azienda + " -> " + (m.key==model.azienda));
		}
		html += '</select>';
		html += '</td>';
		html += '<td><input readonly="readonly" class="datetimepicker start_time" name="start_time" type="text" size=25 value="'+model.start+'" /></td>';
		html += '<td><input readonly="readonly" class="datetimepicker end_time" name="end_time" type="text" size=25 value="'+model.end+'" /></td>';
		html += '<td><a href="#" class="button little edit_session" sekey="' + model.key + '">edit</a> '+
					'<a href="#" class="button little save_session" style="display:none;" sekey="' + model.key + '">Salva</a>'+
					'<a href="#" class="button little delete_session" sekey="' + model.key + '">delete</a></td>';
		
		html += "</tr>";
		
		return html; 
	};
	
	var createNewSessionForm = function(){
		var html = '<tr>'; 
		html += '<td><label>Azienda</label></td>';
		html += '<td><label>Inizio</label></td>';
		html += '<td><label>Fine</label></td>';
		html += '<td></td>';
		
		html += '<tr id="session_">'; 
		html += '<td>';
		html += '<select class="aziendakey">';
		for(var i=0; i<Aziende.lista.length; i++) {
			var m = Aziende.lista[i];
			html += '<option value="'+m.key+'">'+m.name+'</option>';
		}
		html += '</select>';
		html += '</td>';
		html += '<td><input class="datetimepicker start_time" name="start_time" type="text" size=25 /></td>';
		html += '<td><input class="datetimepicker end_time" name="end_time" type="text" size=25 /></td>';
		html += '<td><a class="button little save_session" href="" sekey="">Salva</a></td>';
		
		html += "</tr>";
		
		return html;
	};
	
	return {
		init: function(){
			$('div#mainContainer').undelegate(".save_session", "click").delegate(".save_session", "click", function(e){
				e.preventDefault();
				
				var sekey = $(this).attr("sekey") || "";
				var session = Session.create(sekey || null, $('#session_' + sekey + ' .aziendakey').val(), $('#session_' + sekey + ' .start_time').val(), $('#session_' + sekey + ' .end_time').val());
				//alert(JSON.stringify(session));
				Session.addNewSession(session);
				
				return false;
			});
			
			$('div#mainContainer').undelegate(".edit_session", "click").delegate(".edit_session", "click", function(e){
				e.preventDefault();
				
				var sekey = $(this).attr("sekey");
				$('#session_' + sekey + ' input').attr("readonly", false);
				$('#session_' + sekey + ' .edit_session').hide();
				//$('#company_' + azkey + ' .delete_company').hide();
				$('#session_' + sekey + ' .save_session').show();
				
				return false;
			});
			
			$('div#mainContainer').undelegate(".delete_session", "click").delegate(".delete_session", "click", function(e){
				e.preventDefault();
				
				var sekey = $(this).attr("sekey");
				Session.deleteSession(sekey);
				
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
					
					var html = '<table>';
					html += createNewSessionForm();
					//if(!result.length)
					//	html += '<div>Nessuna sessione da visualizzare</div>';
					//else {
						for(var i = 0; i < result.data.length; i++) {
							var model = result.data[i];
							html += createPageHtml(model);
						}
					//}
					html += '</table>';
						
					$("div#mainContainer").html(html);
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
		deleteSession: function(key){
			$.ajax({
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
			});
		},
		create: function(key, azienda, start, end){
			var model = new Object();
			model.key = key;
			model.azienda = azienda;
			model.start = start;
			model.end = end;
			return model;
		}
	};
}();

var Session = SessionModule;