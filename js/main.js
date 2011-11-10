/**
 * InnaVatson project
 */

var IV = {
	init: function() {
		/* calculate and set height to middle {page-mid} container */
		this.calcLayout();
		this.sectionSwitcher();
		this.bottomSliders();

		/* modules */
		this.devices.init();

		/* attach events */
		this.events();
	},

	events: function() {
		window.onresize = this.calcLayout;
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

	/**
	 * sliders with custom scroll + controls
	 */
	bottomSliders: function() {
		$( '.slider' ).each( function (idx , elt) {
			var $elt = $( elt );
			(function () {
				var outerWidth = $( '.page-bot' ).width() - 10 - 30; // 2 paddings + 2 margins
				var innerWidth = 0;
				$elt.find( ".slider-item" ).each( function (idx , si) {
					innerWidth += $( si ).outerWidth() + 10; // padding
				} );
				if ( innerWidth < outerWidth )
					innerWidth = outerWidth;

				var pos = 0;
				var $container = $elt.find( '.slider-inner' );
				$container.css( 'position' , 'relative' );
				// arrows
				$elt.find( '.slider-prev' ).click( function () {
					pos -= innerWidth;
					if ( pos < 0 ) pos = 0;
					$knob.animate( {left:pos / kfc + 'px' } );
					$container.animate( {left:-pos + 'px'} );
				} );
				$elt.find( '.slider-next' ).click( function () {
					pos += innerWidth;
					if ( pos > innerWidth - outerWidth ) {
						pos = innerWidth - outerWidth;
					}
					$knob.animate( {left:pos / kfc + 'px' } );
					$container.animate( {left:-pos + 'px'} );
				} );
				// scroller
				var x, spos, dragging = false;
				var scrollWidth = outerWidth * outerWidth / innerWidth;
				var $knob = $elt.find( ".slider-scroll-handler" );
				$knob.css( {
					width:scrollWidth + 'px' ,
					left:pos
				} ).mousedown( function (event) {
							x = event.pageX;
							spos = pos;
							dragging = true;
						} );
				var kfc = (innerWidth - outerWidth) / (outerWidth - scrollWidth);
				$( document ).mousemove(
						function (event) {
							if ( !dragging ) return true;
							pos = spos + (event.pageX - x) * kfc;
							if ( pos < 0 ) pos = 0;
							if ( pos > innerWidth - outerWidth ) {
								pos = innerWidth - outerWidth;
							}
							$knob.css( 'left' , pos / kfc );
							$container.css( 'left' , -pos + 'px' );
						} ).mouseup( function (event) {
							dragging = false;
						} );
				$elt.bind( 'mousewheel' , function (event , delta) {
					var dir = delta > 0 ? -1 : +1;
//					console.log(event);
					pos += 30 * dir;

					if ( pos < 0 ) pos = 0;
					if ( pos > innerWidth - outerWidth ) {
						pos = innerWidth - outerWidth;
					}
					$knob.css( 'left' , pos / kfc );
					$container.css( 'left' , -pos + 'px' );
				} );
			})();
		});
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
