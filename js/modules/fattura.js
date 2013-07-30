var FatturaModule = function(){
	
	return {
		init: function(){
			
			$('div#mainContainer').undelegate("#fatturaprogetto", "click").delegate("#fatturaprogetto", "click", function(e){
				e.preventDefault();
				Fattura.getFatturaPageProgetto();
				return false;
			});
			$('div#mainContainer').undelegate("#fatturaperiodo", "click").delegate("#fatturaperiodo", "click", function(e){
				e.preventDefault();
				Fattura.getFatturaPagePeriodo();
				return false;
			});
			
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
				obj.date = $('#fattura .fatt_time').val();
				obj.msg = $('#fattura .ftext').val();
				obj.progetto = $('#fattura .progettokey').val();
				window.location.href = '/download?'+$.param(obj);
				
				return false;
			});
		},
		getFatturaPage: function(userData){
			var html = '<div class="title">Tipo di fatturazione</div>';
			
			html += '<div id="fatturaprogetto" class="button" style="width: 70%;" >Fattura per un progetto finito</div>';
			html += '<div id="fatturaperiodo" class="button" style="width: 70%;">Fattura per un periodo di tempo</div>';
		
			$("div#mainContainer").html(html);
		},
		getFatturaPagePeriodo: function(userData){
			var html = '<div class="title">Fattura per un periodo</div>';
			html += '<table id="fattura">';
			html += '<tr>';
			html += '<td>Inizio (incluso)</td>';
			html += '<td><input class="datepicker start_time" name="start_time" type="text" value="" /></td>';
			html += '</tr>';
			html += '<tr>';
			html += '<td>Fine (escluso)</td>';
			html += '<td><input class="datepicker end_time" name="end_time" type="text" value="" /></td>';
			html += '</tr>';
			html += '<tr>';
			html += '<td>Data di fatturazione</td>';
			html += '<td><input class="datepicker fatt_time" name="fatt_time" type="text" value="" /></td>';
			html += '</tr>';
			html += '<tr>';
			html += '<tr>';
			html += '<td>Testo</td>';
			html += '<td><textarea class="ftext" name="ftext" value="" /></td>';
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
		},
		getFatturaPageProgetto: function(userData){
			var html = '<div class="title">Fattura per un progetto</div>';
			html += '<table id="fattura">';
			html += '<tr>';
			html += '<td>Data di fatturazione</td>';
			html += '<td><input class="datepicker fatt_time" name="fatt_time" type="text" value="" /></td>';
			html += '</tr>';
			html += '<tr>';
			html += '<tr>';
			html += '<td>Testo</td>';
			html += '<td><textarea class="ftext" name="ftext" value="" /></td>';
			html += '</tr>';
			html += '<tr>';
			html += '<td>Progetto</td>';
			html += '<td><select class="progettokey" >';
			for(var i=0; i<Progetto.lista.length; i++) {
				var m = Progetto.lista[i];
				html += '<option value="'+m.key+'">'+m.name+'</option>';
				//console.log(m.key +"=="+ model.azienda + " -> " + (m.key==model.azienda));
			}
			html += '</select></td>';
			html += '</tr>';
			html += '</table>';
			
			html += '<br/><br/>Clicca sul pulsante per scaricare un xls <span class="inevidence">di prova</span> --> <div class="button" id="downloadxls">Scarica</div>';
		
			$("div#mainContainer").html(html);
			initDatepickers();
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
		create: function(aziendakey, start, end, date, progettokey){
			var model = new Object();
			model.progettokey = progettokey;
			model.aziendakey = aziendakey;
			model.start = start;
			model.end = end;
			model.msg = msg;
			model.date = fatttime;
			
			return model;
		},
		lista: new Array()
	};
}();

var Fattura = FatturaModule;
/**/