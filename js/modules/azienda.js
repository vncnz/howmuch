var AziendaModule = function(){
	var createPageHtml = function(model){ 
		var html = '<tr id="company_' + model.key + '">';
		html += '<td><input type="text" class="edit_company_name disabled" name="edit_company_name_' + model.key + '" id="edit_company_name_' + model.key + '" value="' + model.name + '" disabled="disabled" title="'+model.name+'" /></td>';
		html += '<td><input type="text" class="edit_company_address disabled" name="edit_company_address_' + model.key + '" id="edit_company_address_' + model.key + '" value="' + model.address + '" disabled="disabled" title="'+model.address+'"/></td>';
		html += '<td><input type="text" class="edit_company_piva disabled" name="edit_company_piva_' + model.key + '" id="edit_company_piva_' + model.key + '" value="' + model.piva + '" disabled="disabled" title="'+model.piva+'" /></td>';
		html += '<td class="right_text">';
		html += '<span style="margin-left: 2%;">&euro; </span>';
		html += '<input type="number" min="0" step="0.5" class="small_input edit_company_eurh disabled" name="edit_company_eurh_' + model.eur_h + '" id="edit_company_eurh_' + model.eur_h + '" value="' + model.eur_h + '" disabled="disabled" />';
		html += '</td>';
		html += '<td>';
		html += '<a href="#edit" azkey="' + model.key + '" class="edit_company" title="Modifica i dati del cliente">';
		html += '<img src="imgs/pencil_icon16_black.png" />';
		html += '</a>';
		html += '<a href="#save" azkey="' + model.key + '" class="save_company" title="Salva le modifiche">';
		html += '<img src="imgs/checkmark_icon16_black.png" />';
		html += '</a>';
		html += '</td>';
		html += '<td><a href="#delete" azkey="' + model.key + '" class="delete_company" title="Cancella il cliente">';
		html += '<img src="imgs/delete_icon16_black.png" />';
		html += '</a></td>';
		html += '</tr>';
		
		return html;
	};
	
	var createSearchForm = function(){
		var html = '<div class="filter_items">';
		html += '<div class="section_title"><h3>Filtri</h3></div>'
		html += '<div class="filter_buttons">';
		html += '<div class="filter_button">';
		html += '<a href="#" id="search_customer" title="Filtra i risultati"><img src="imgs/refresh_icon24_black.png" /></a>';
		html += '</div>';
		html += '<div class="filter_button">';
		html += '<a href="#" id="refresh_customer" title="Ricarica la tabella"><img src="imgs/zoom_icon24_black.png" /></a>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		
		return html;
	};
	
	var createNewCompanyForm = function(){
		var html = '<div class="add_new_item" id="company_">';
		html += '<div class="section_title"><h3>Aggiungi nuovo cliente</h3></div>';
		html += '<div class="form_field first_field">';
		html += '<label>Ragione Sociale</label><br />';
		html += '<input type="text" name="new_company_name" id="new_company_name" class="edit_company_name" />';
		html += '</div>';
		html += '<div class="form_field">';
		html += '<label>Indirizzo</label><br />';
		html += '<input type="text" name="new_company_address" id="new_company_address" class="edit_company_address" />';
		html += '</div>';
		html += '<div class="form_field">';
		html += '<label>Partita IVA</label><br />';
		html += '<input type="text" name="new_company_piva" id="new_company_piva" class="edit_company_piva" />';
		html += '</div>';
		html += '<div class="form_field" title="Specifica un compenso solo se vieni pagato a ore e non a progetto">';
		html += '<label>Compenso orario (&euro;/h)</label><br />';
		html += '<input type="number" min="0" step="0.5" name="new_company_price" id="new_company_price" class="edit_company_eurh" />';
		html += '</div>';
		html += '<div class="form_field">';
		html += '<div>&nbsp;</div>';
		html += '<a href="#save" class="form_button save_company" id="save_company" azkey="" title="Salva nuovo cliente">';
		html += '<img src="imgs/round_plus_icon24_black.png" />';
		html += '</a>';
		html += '</div>';
		html += '</div>';
		
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
					
					if(result.status == 0){						
						Aziende.lista = new Array();
						var allhtml = '<div class="title">Gestione clienti</div>';
						allhtml += createNewCompanyForm();
						allhtml += '<hr />';
						allhtml += '<div class="item_list">';
						allhtml += '<div class="section_title"><h3>Elenco clienti</h3></div>'
						if(!result.data.length)
							allhtml += '<div><h4>Non &egrave; presente nessun cliente!</h4></div>';
						else{
							allhtml += '<table><thead>';
							allhtml += '<th>Ragione Sociale</th>';
							allhtml += '<th>Indirizzo</th>';
							allhtml += '<th>Partita IVA</th>';
							allhtml += '<th>Compenso orario (&euro;/h)</th>';
							allhtml += '<th colspan="2"></th>';
							allhtml += '</thead><tbody>';
							for(var i=0; i<result.data.length; i++) {
								var model = Aziende.create(result.data[i].key, result.data[i].name, result.data[i].address, result.data[i].piva, result.data[i].eur_h);
								Aziende.lista.push(model);
								allhtml += createPageHtml(model);
							}
							allhtml += '</tbody></table>';
						}
						allhtml += '</div>';
						allhtml += createSearchForm();
						
						if(result.msg)
							alert(result.msg);
						
						$("div#mainContainer").html(allhtml);
						hideLoader();
					}
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
					
					if(result.status == 0){
						window.setTimeout(function(){
							Aziende.getAziendePage({});
							//alert("Record salvato con successo");
						}, 400);
					}
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
					
					if(result.status == 0){
						window.setTimeout(function(){
							Aziende.getAziendePage({});
						}, 300);
					}
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