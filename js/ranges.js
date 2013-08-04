var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
function initRanges() {
	startTimeRange = new Date(2010, 0, 1, 0, 0 );
	endTimeRange = new Date(2010, 0, 1, 23, 59 );
	defaultStartTimeRange = new Date(2010, 0, 1, 9, 0 );
	defaultEndTimeRange = new Date(2010, 0, 1, 18, 0 );

	jQuery(".hourslider").each(function(i) {
		
		var disabled = jQuery(this).attr("start_time") ? true : false;
		var str = disabled ? new Date(jQuery(this).attr("start_time")) : startTimeRange;
		var etr = disabled ? new Date(jQuery(this).attr("end_time")) : endTimeRange;
		var dstr = disabled ? new Date(jQuery(this).attr("start_time")) : defaultStartTimeRange;
		var detr = disabled ? new Date(jQuery(this).attr("end_time")) : defaultEndTimeRange;
		str.setHours(0);
		str.setMinutes(0);
		etr.setHours(23);
		etr.setMinutes(59);
		
		//console.log(str + " - " + etr);
		
		
		jQuery(this).dateRangeSlider({
			enabled: !disabled,
			valueLabels:"change",
			arrows: false,
			bounds: {min: str, max: etr},
			defaultValues: {
				min: dstr, 
				max: detr
			},
			formatter: function(value){
				var hour = value.getHours(),
					minute = value.getMinutes();
				return "" + (hour) + ":" + (minute < 10 ? "0" + minute : minute);
			},
			step:{
				minutes: 5,
			},
			scales: [{
				first: function(value){ return value; },
				end: function(value) {return value; },
				next: function(value){
					var next = new Date(value);
					return new Date(next.setHours(value.getHours() + 1));
				},
				label: function(value){
					return value.getHours();
				},
				format: function(tickContainer, tickStart, tickEnd){
					tickContainer.addClass("slider-rule-unit");
				}
			}]
		}).bind("valuesChanged", function(e, data){
			var minHour = data.values.min.getHours(),
				minMinutes = data.values.min.getMinutes(),
				maxHour = data.values.max.getHours(),
				maxMinutes = data.values.max.getMinutes()
				finalMin = "" + (minHour) + ":" + (minMinutes < 10 ? "0" + minMinutes : minMinutes),
				finalMax = "" + (maxHour) + ":" + (maxMinutes < 10 ? "0" + maxMinutes : maxMinutes);
			jQuery("#beginninghour").text(finalMin);
			jQuery("#endinghour").text(finalMax);   
		});
	});
}