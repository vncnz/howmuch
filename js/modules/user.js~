var UserModule = function(){ 
	var createPageHtml = function(model){
		var html = '<div class="title">Gestione dati utente</div>';
		html += "<div id='userdata'><div>I tuoi dati:</div><table>"; 
		html += "<tr><td>Nome:</td><td><input type='text' name='firstName' id='firstName' value='"+(model.firstName || "")+"' /></td></tr>";
		html += "<tr><td>Cognome:</td><td><input type='text' name='lastName' id='lastName' value='"+(model.lastName || "")+"' /></td></tr>";
		html += "<tr><td>Indirizzo:</td><td><input type='text' name='address' id='address' value='"+(model.address || "")+"' /></td></tr>";
		html += "<tr><td>P.I.:</td><td><input type='text' name='piva' id='piva' value='"+(model.piva || "")+"' /></td></tr>";
		html += "<tr><td>IBAN:</td><td><input type='text' name='iban' id='iban' value='"+(model.iban || "")+"' /></td></tr>";
		html += "</table>";
		html += "<button type='button' id='save_user' class='button little'>Salva</button>";
		
		return html;
	};
	
	return {
		init: function(){
			$('div#mainContainer').undelegate("#save_user", 'click').delegate("#save_user", "click", function(){
				var user = User.create($('#firstName').val(), $('#lastName').val(), $('#address').val(), $('#piva').val(), $('#iban').val());
				User.getUserPage(user);
				
				return false;
			});
		},
		getUserPage: function(userData){
			$.ajax({
				url:"/user",
				type: "GET",
				data: userData,
				success:function(result){
					result = JSON.parse(result);
					checkResponse(result);
					var model = result.data;
					var html = createPageHtml(model)
					
					$("div#mainContainer").html(html);
				},
				error: function(richiesta,stato,errori){
					networkError();
				}
			});
		},
		create: function(firstName, lastName, address, piva, iban){
			var model = new Object();
			if(firstName)
				model.firstName = firstName;
			if(lastName)
				model.lastName = lastName;
			if(address)
				model.address = address;
			if(piva)
				model.piva = piva;
			if(iban)
				model.iban = iban;
			
			return model;
		}
	};
}();

var User = UserModule;