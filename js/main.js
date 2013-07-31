
function openPage(page) {
	
	var url = "";
	
	switch(page) {
		case "user":
			//url = "/user"
			User.init();
			User.getUserPage({});
			break;
		case "aziende":
			Aziende.init();
			Aziende.getAziendePage({});
			break;
		case "session":
			Session.init();
			Session.getSessionPage({});
			break;
		case "fattura":
			Fattura.init();
			Fattura.getFatturaPage();
			break;
		case "progetti":
			Progetto.init();
			Progetto.getProgettiPage();
			break;
		default:
			alert("Unknown");
			return;
			break;
	}
}

function checkResponse(response) {
	//alert(JSON.stringify(response));
	if(response.resultType=="")
		return true;
	var n = noty({
		text: response.msg || response.resultType,
		type: response.resultType,
		//dismissQueue: true,
		layout: 'topCenter',
		theme: 'defaultTheme',
		timeout: 5000,
		closeWith: ['hover'],
		modal: response.resultType=="error"
		/*callback: {
			onShow: function() {},
			afterShow: function() {},
			onClose: function() {},
			afterClose: function() {}
		},*/
	});
	return response.resultType=="success";
}

function askConfirm(msg, callbackSuccess, callbackError) {
	var n = noty({
		text: msg,
		type: 'confirm',
		dismissQueue: false,
		layout: 'bottom',
		theme: 'defaultTheme',
		buttons: [{
				addClass: 'btn btn-primary', 
				text: 'Ok', 
				onClick: function($noty) {
					// this = button element
					// $noty = $noty element
					$noty.close();
					//noty({text: 'You clicked "Ok" button', type: 'success'});
					callbackSuccess();
				}
			},{
				addClass: 'btn btn-danger', 
				text: 'Cancel', 
				onClick: function($noty) {
					$noty.close();
					//noty({text: 'You clicked "Cancel" button', type: 'error'});
					callbackError();
				}
			}
		]
	});
}

function networkError() {
	checkResponse({
		'resultType': 'error',
		'msg': 'Server error'
	});
}

$(window).resize(function () {
	var window_height = $(window).height();
	var header_height = $("header").outerHeight();
	var footer_height = $("footer").outerHeight();
	$("div#mainContainer").outerHeight(window_height - header_height - footer_height -2);
});

$(document).ready(function(){
	$('#login').hover(function(){
		$(this).children("img").attr("src", "imgs/google_icon16_white.png");
	}, function(){
		$(this).children("img").attr("src", "imgs/google_icon16_black.png");
	});
	$(window).resize();
	
	$.ajax({
		url:"/aziende",
		type: "GET",
		success:function(result){
			result = JSON.parse(result);
			checkResponse(result);
			Aziende.lista = new Array();
			for(var i=0; i<result.data.length; i++) {
				var model = Aziende.create(result.data[i].key, result.data[i].name, result.data[i].address, result.data[i].piva, result.data[i].eur_h);
				Aziende.lista.push(model);
			}
		},
		error: function(richiesta,stato,errori){
			networkError();
		}
	});
	$.ajax({
		url: "/project",
		type: "GET",
		data: {},
		success: function(result){
			result = JSON.parse(result);
			Progetto.lista = new Array();
			for(var i = 0; i < result.data.length; i++) {
				var model = result.data[i];
				Progetto.lista.push(model);
			}
		},
		error: function(richiesta,stato,errori){
			networkError();
		}
	});
})