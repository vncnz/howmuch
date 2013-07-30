function isTouchDevice() {
	return !!('ontouchstart' in window);
}

function initDatepickers(onlydate) {
	if(!isTouchDevice()){

		$('.datepicker').datepicker({});
		$('.datetimepicker').datetimepicker({}); // :not([readonly])

		//Disable the user from manually entering values on the text field
		$('.datetimepicker, .datepicker').bind('keydown',function(e){
			$(this).attr('readonly', 'readonly');
			//Extra fun for working with backspace
			//we don't want the browser to go back in history if backspace is pressed
			if(e.keyCode == 8){
				e.preventDefault();
			}
		});

		//Remove readonly on keyup, so the form doesn't look weird 
		$('.datetimepicker, .datepicker').bind('keyup',function(){
			$(this).removeAttr('readonly');
		});


	} else {
		//Touch powered calendar
		$('.datetimepicker').scroller({
			preset: 'datetime',
			theme: 'android',
			display: 'modal',
			mode: 'scroller'
		}); 
	}
};