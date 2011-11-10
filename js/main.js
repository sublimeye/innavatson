/**
 * InnaVatson project
 */

var IV = {
	Obs: $({}),

	init: function() {
		/* calculate and set height to middle {page-mid} container */
		this.calcLayout();
		this.sectionSwitcher();
//		this.bottomSliders();

		this.sliders.init();
		/* modules */
		this.devices.init();

		/* attach events */
		this.events();
	},

	events: function() {
		window.onresize = this.calcLayout;
		window.onresize = this.sliders.init;
	},

	calcLayout: function() {
		var mid = $('.page-mid'),
				top = $('.page-top'),
				bot = $('.page-bot');

		mid.css('height', document.body.clientHeight - (top.get(0).clientHeight + bot.get(0).clientHeight) + 'px');
	},

	/**
	 * Top sections switcher
	 */
	sectionSwitcher: function() {
		var idx = 'map',
				_app = this;
		$(".nav-items a").click(function(){
			var $this = $(this);
			var newIdx = $this.attr('idx');
			if (newIdx == idx) return true;
			var $parent = $(this.parentNode.parentNode);
			$parent.find('.active').removeClass('active').removeClass('nav-active-item');
			$this.parent().addClass('active').addClass('nav-active-item');
			switch(idx) {
				case 'map': $('#map, .users-slider').addClass('g-hidden'); break;
				case 'devices': $('#devices').addClass('g-hidden'); break;
				case 'zones': $('#zones, .slider--zones').addClass('g-hidden'); break;
				case 'groups': $('#groups').addClass('g-hidden'); break;
			}
			switch(newIdx) {
				case 'map': $('#map, .users-slider').removeClass('g-hidden'); $('.page-mid'); break;
				case 'devices': $('#devices').removeClass('g-hidden'); $('.page-mid'); break;
				case 'zones': $('#zones, .slider--zones').removeClass('g-hidden'); $('.page-mid'); break;
				case 'groups': $('#groups').removeClass('g-hidden'); $('.page-mid'); break;
			}
			idx = newIdx;
			_app.calcLayout();
		});
	},

	sliders: {
		classSlider: '.slider',
		classSliderList: '.slider-list',
		classSliderInner: '.slider-inner',
		classItemNext: '.slider-next',
		classItemPrev: '.slider-prev',
		classSliderHandler: '.slider-scroll-handler',
		classPageBottom: '.page-bot',

		init: function() {
			_s = this;

			$(_s.classSlider).each(function(idx, elt) {
				var $elt = $(elt),
						$container = $elt.find(_s.classSliderInner),
						outerWidth = $(_s.classPageBottom).outerWidth(true),
						innerWidth = $(_s.classSliderList).outerWidth(true),
						scrollWidth = outerWidth - 24,
						kfc = (innerWidth - outerWidth) / (outerWidth - scrollWidth),
						$knob = $elt.find(_s.classSliderHandler),
						pos = 0;

				innerWidth = (innerWidth < outerWidth) ? outerWidth : innerWidth;


				/* TODO: temp static value/bug fixing*/
//				kfc	= 1.6;
				/* previous slider items */
				$elt.find(_s.classItemPrev).bind('click.prev_items', function() {
					pos -= innerWidth;
					if ( pos < 0 ) { pos = 0 }
					$knob.animate( {left:pos / kfc + 'px' } );
					$container.animate( {left:-pos + 'px'} );
				});

				/* next slider items */
				$elt.find(_s.classItemNext).bind('click.next_items', function() {
					var widthDelta = innerWidth - outerWidth;
					pos += innerWidth;
					if ( pos > widthDelta ) {
						pos = widthDelta;
					}
					$knob.animate( {left:pos / kfc + 'px' } );
					$container.animate( {left:-pos + 'px'} );
				});

				/* scroller dragable */
				var x,
						spos,
						dragging = false;

					$knob
						.css({
							width:scrollWidth + 'px' ,
							left:pos
						})
						.mousedown( function (event) {
							x = event.pageX;
							spos = pos;
							dragging = true;
						} );

					$(document)
						.mousemove(function (event) {
							if ( !dragging ) { return true }
							pos = spos + (event.pageX - x) * kfc;
							if ( pos < 0 ) pos = 0;
							if ( pos > innerWidth - outerWidth ) {
								pos = innerWidth - outerWidth;
							}
							$knob.css( 'left' , pos / kfc );
							$container.css( 'left' , -pos + 'px' );
						})
						.mouseup(function () {
							dragging = false;
						});

					$elt.mousewheel(function(e, delta) {
						var dir = delta > 0 ? -1 : +1;
						pos += 30 * dir;

						if ( pos < 0 ) pos = 0;
						if ( pos > innerWidth - outerWidth ) {
							pos = innerWidth - outerWidth;
						}
						$knob.css( 'left' , pos / kfc );
						$container.css( 'left' , -pos + 'px' );
					}, null, null);

			});

		}

	}
};

$(document).ready(function() {
	IV.init();
});

// vertical custom scrolls
/*
$( '.overflowable-content' ).live( 'resize' , function () {
	var h = this.offsetHeight;
	var H = this.parentNode.offsetHeight;
	var $parent = $( this.parentNode );
	var knob = $parent.find( '.overflowable-knob' );
	if ( h < H ) {
		knob.css( {
			height:"100%" ,
			top:0
		} );
	} else {
		knob.css( {
			height:100 * H / h + "%" ,
			top:this.style.top || 0
		} );
	}
} );
*/
