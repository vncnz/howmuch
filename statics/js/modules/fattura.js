/* DA IMPLEMENTARE */

var FatturaModule = function(){
	var createPageHtml = function(model){  
		var html = '<tr id="company_' + model.key + '">'; 
		html += '<td><input readonly="readonly" type="text" class="edit_company_name" name="edit_company_name_' + model.key + '" id="edit_company_name_' + model.key + '" value="' + model.name + '" /></td>';
		html += '<td><input readonly="readonly" type="text" class="edit_company_address" name="edit_company_address_' + model.key + '" id="edit_company_address_' + model.key + '" value="' + model.address + '" /></td>';
		html += '<td><input readonly="readonly" type="text" class="edit_company_piva" name="edit_company_piva_' + model.key + '" id="edit_company_piva_' + model.key + '" value="' + model.piva + '" /></td>';
		html += '<td><a href="#" class="button little edit_company" azkey="' + model.key + '">edit</a> '+
					'<a href="#" class="button little save_company" style="display:none;" azkey="' + model.key + '">Salva</a>'+
					'<a href="#" class="button little delete_company" azkey="' + model.key + '">delete</a></td>';
		html += '</tr>'; 
		
		return html;
	};
	
	var createNewCompanyForm = function(){
		var html = '<tr>'; 
		html += '<td><label>Ragione Sociale</label></td>';
		html += '<td><label>Indirizzo</label></td>';
		html += '<td><label>Partita IVA</label></td>';
		html += '<td></td>';
		
		html += '<tr id="company_">'; 
		html += '<td><input type="text" class="edit_company_name" name="new_company_name" /></td>';
		html += '<td><input type="text" class="edit_company_address" name="new_company_address" /></td>';
		html += '<td><input type="text" class="edit_company_piva" name="new_company_piva" /></td>';
		html += '<td><a class="button little save_company" href="#save" azkey="">Salva</a></td>';
		
		return html;
	};
	
	return {
		init: function(){
			$('div#mainContainer').undelegate("#downloadxls", "click").delegate("#downloadxls", "click", function(e){
				e.preventDefault();
				
				/*var azkey = $(this).attr("azkey") || "";
				//alert("key: " + azkey + "\nvalue: " + $('#company_' + azkey + ' .edit_company_name').val() + "\nid: " + '#company_' + azkey + ' .edit_company_name');
				var company = Aziende.create(azkey || null, $('#company_' + azkey + ' .edit_company_name').val(), $('#company_' + azkey + ' .edit_company_address').val(), $('#company_' + azkey + ' .edit_company_piva').val());
				Aziende.addNewCompany(company);*/
				var obj = new Object();
				obj.azienda = $('#fattura .aziendakey').val();
				obj.start = $('#fattura .start_time').val()
				obj.end = $('#fattura .end_time').val();
				window.location.href = '/download?'+$.param(obj);
				
				return false;
			});
		},
		getFatturaPage: function(userData){
			var html = '<table id="fattura">';
			html += '<tr>';
			html += '<td>Inizio (incluso)</td>';
			html += '<td><input class="datepicker start_time" name="start_time" type="text" size=25 value="" /></td>';
			html += '</tr>';
			html += '<tr>';
			html += '<td>Fine (escluso)</td>';
			html += '<td><input class="datepicker end_time" name="end_time" type="text" size=25 value="" /></td>';
			html += '</tr>';
			html += '<tr>';
			html += '<td>Azienda</td>';
			html += '<td><select class="aziendakey" >';
			for(var i=0; i<Aziende.lista.length; i++) {
				var m = Aziende.lista[i];
				html += '<option value="'+m.key+'">'+m.name+'</option>';
				//console.log(m.key +"=="+ model.azienda + " -> " + (m.key==model.azienda));
			}
			html += '</select></td>';
			html += '</tr>';
			html += '</table>';
			
			html += '<br/><br/>Clicca sul pulsante per scaricare un xls <span class="inevidence">di prova</span> --> <div class="button" id="downloadxls">Scarica</div>';
		
			$("div#mainContainer").html(html);
			initDatepickers();
			/*$.ajax({
				url:"/aziende",
				type: "GET",
				//data: aziendeData,
				success:function(result){
					//$("div#mainContainer").html(JSON.stringify(result));
					result = JSON.parse(result);
					checkResponse(result);
					
					Aziende.lista = new Array();
					var allhtml = '<table id="aziende_table">';
					allhtml += createNewCompanyForm();
					if(!result.data.length)
						allhtml += "<tr>Nessuna azienda da visualizzare</tr>";
					else{
						for(var i=0; i<result.data.length; i++) {
							var model = Aziende.create(result.data[i].key, result.data[i].name, result.data[i].address, result.data[i].piva);
							Aziende.lista.push(model);
							allhtml += createPageHtml(model);
						}
					}
					allhtml += '</table>';
					
					if(result.msg)
						alert(result.msg);
					
					$("div#mainContainer").html(allhtml);
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});*/
		},
		addNewCompany: function(model){
			$.ajax({
				url:"/aziende?method=write",
				type: "GET",
				data: model,
				success:function(result){
					result = JSON.parse(result);
					checkResponse(result);
					window.setTimeout(function(){
						Aziende.getAziendePage({});
						//alert("Record salvato con successo");
					}, 400);
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		deleteCompany: function(key){
			$.ajax({
				url:"/aziende?method=delete",
				type: "GET",
				data: {"key":key},
				success:function(result){
					result = JSON.parse(result);
					checkResponse(result);
					window.setTimeout(function(){
						Aziende.getAziendePage({});
					}, 300);
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		create: function(aziendakey, start, end){
			var model = new Object();
			model.aziendakey = aziendakey;
			model.start = start;
			model.end = end;
			
			return model;
		},
		lista: new Array()
	};
}();

var Fattura = FatturaModule;
/**/