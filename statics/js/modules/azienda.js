var AziendaModule = function(){
	var createPageHtml = function(model){  
		var html = '<tr id="company_' + model.key + '">'; 
		html += '<td><input readonly="readonly" type="text" class="edit_company_name" name="edit_company_name_' + model.key + '" id="edit_company_name_' + model.key + '" value="' + model.name + '" /></td>';
		html += '<td><input readonly="readonly" type="text" class="edit_company_address" name="edit_company_address_' + model.key + '" id="edit_company_address_' + model.key + '" value="' + model.address + '" /></td>';
		html += '<td><input readonly="readonly" type="text" class="edit_company_piva" name="edit_company_piva_' + model.key + '" id="edit_company_piva_' + model.key + '" value="' + model.piva + '" /></td>';
		html += '<td><input readonly="readonly" type="number" min="0" step="0.5" class="edit_company_eurh" name="edit_company_eurh_' + model.eur_h + '" id="edit_company_eurh_' + model.eur_h + '" value="' + model.eur_h + '" /></td>';
		html += '<td><a href="#" class="button little edit_company" azkey="' + model.key + '">edit</a> '+
					'<a href="#" class="button little save_company" style="display:none;" azkey="' + model.key + '">Salva</a>'+
					'<a href="#" class="button little delete_company" azkey="' + model.key + '">delete</a></td>';
		html += '</tr>'; 
		
		return html;
	};
	
	var createNewCompanyForm = function(){
		var html = '<tr class="form_title">'; 
		html += '<td><label>Ragione Sociale</label></td>';
		html += '<td><label>Indirizzo</label></td>';
		html += '<td><label>Partita IVA</label></td>';
		html += '<td><label>Compenso orario (€)</label></td>';
		html += '<td></td>';
		html += '</tr>';
		
		html += '<tr>'; 
		html += '<td><input type="text" class="edit_company_name" name="new_company_name" /></td>';
		html += '<td><input type="text" class="edit_company_address" name="new_company_address" /></td>';
		html += '<td><input type="text" class="edit_company_piva" name="new_company_piva" /></td>';
		html += '<td><input type="number" min="0" step="0.5" class="edit_company_eurh" name="new_company_eurh" /></td>';
		html += '<td><a class="button little save_company" href="#save" azkey="">Salva</a></td>';
		html += '</tr>';
		
		return html;
	};
	
	return {
		init: function(){
			$('div#mainContainer').undelegate(".save_company", "click").delegate(".save_company", "click", function(e){
				e.preventDefault();
				
				var azkey = $(this).attr("azkey") || "";
				//alert("key: " + azkey + "\nvalue: " + $('#company_' + azkey + ' .edit_company_name').val() + "\nid: " + '#company_' + azkey + ' .edit_company_name');
				var company = Aziende.create(azkey || null, $('#company_' + azkey + ' .edit_company_name').val(), $('#company_' + azkey + ' .edit_company_address').val(), $('#company_' + azkey + ' .edit_company_piva').val(), $('#company_' + azkey + ' .edit_company_eurh').val());
				Aziende.addNewCompany(company);
				
				return false;
			});
			$('div#mainContainer').undelegate(".edit_company", "click").delegate(".edit_company", "click", function(e){
				e.preventDefault();
				
				var azkey = $(this).attr("azkey");
				$('#company_' + azkey + ' input').attr("disabled", false);
				$('#company_' + azkey + ' input').removeClass("disabled");
				$('#company_' + azkey + ' .edit_company').hide();
				//$('#company_' + azkey + ' .delete_company').hide();
				$('#company_' + azkey + ' .save_company').show();
				
				return false;
			});
			
			$('div#mainContainer').undelegate(".delete_company", "click").delegate(".delete_company", "click", function(e){
				e.preventDefault();
				
				var azkey = $(this).attr("azkey");
				Aziende.deleteCompany(azkey);
				
				return false;
			});
		},
		getAziendePage: function(userData){
			$.ajax({
				url:"/aziende",
				type: "GET",
				//data: aziendeData,
				success:function(result){
					//$("div#mainContainer").html(JSON.stringify(result));
					result = JSON.parse(result);
					checkResponse(result);
					
					Aziende.lista = new Array();
					var allhtml = '<div class="title">Dati azienda</div>';
					allhtml += '<table id="aziende_table">';
					allhtml += createNewCompanyForm();
					if(!result.data.length)
						allhtml += "<tr><td colspan=\"5\">Nessuna azienda da visualizzare</td></tr>";
					else{
						for(var i=0; i<result.data.length; i++) {
							var model = Aziende.create(result.data[i].key, result.data[i].name, result.data[i].address, result.data[i].piva, result.data[i].eur_h);
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
			});
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
		create: function(key, name, address, piva, eur_h){
			var model = new Object();
			model.key = key;
			model.name = name;
			model.address = address;
			model.piva = piva;
			model.eur_h = eur_h || 0;
			
			return model;
		},
		lista: new Array()
	};
}();

var Aziende = AziendaModule;