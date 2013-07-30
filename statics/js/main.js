
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

function networkError() {
	checkResponse({
		'resultType': 'error',
		'msg': 'Server error'
	});
}

$(document).ready(function(){
	$('#login').hover(function(){
		$(this).children("img").attr("src", "imgs/google_icon&16_white.png");
	}, function(){
		$(this).children("img").attr("src", "imgs/google_icon&16_black.png");
	});
	
	Aziende.init();
	
	var window_height = $(window).height();
	var header_height = $("header").outerHeight();
	var footer_height = $("footer").outerHeight();
	$("div#mainContainer").outerHeight(window_height - header_height - footer_height -2);
    /*$(document).scroll(function(){
        console.log($("html").offset());   
    })*/
})