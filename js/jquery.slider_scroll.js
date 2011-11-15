(function($) {
	var methods = {
		init: function(options) {
			var defaults = $.extend({
				"classSlider": ".slider",
				"classSliderList": ".slider-list",
				"classSliderInner": ".slider-inner",
				"classItemNext": ".slider-next",
				"classItemPrev": ".slider-prev",
				"classSliderHandler": ".slider-scroll-handler",
				"classSliderOuter": ".slider-outer"
			}, options);

			return this.each(function() {
				var $elt = $(this),
						$container = $elt.find(defaults.classSliderInner);


			});
		},
		temp: function() {

		}
	};

	$.fn.IVSliders = function (method) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this , Array.prototype.slice.call( arguments , 1 ) );
		} else if ( typeof method === 'object' || !method ) {
			return methods.init.apply( this , arguments );
		} else {
			$.error( 'Method ' + method + ' does not exist on jQuery.sliding_scroll' );
		}
	};
})(jQuery);