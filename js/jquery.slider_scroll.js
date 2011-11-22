(function($) {
	var SScroll = function( element ) {
		this.$elt = $(element);

		this._d = {
			classSlider: '.slider',
			classSliderList: '.slider-list',
			classSliderInner: '.slider-inner',
			classItemNext: '.slider-next',
			classItemPrev: '.slider-prev',
			classSliderHandler: '.slider-scroll-handler',
			classSliderScroll: '.slider-scroll',
			classSliderOuter: '.slider-outer'
		};

		this._s = {
			$elt: this.$elt,
			$container: this.$elt.find(this._d.classSliderInner),
			innerWidth: null,
			outerWidth: null,
			scrollWidth: null,
			kfc: null,
			$knob: this.$elt.find(this._d.classSliderHandler),
			$controls: $(this._d.classItemPrev, this.$elt).add(this._d.classItemNext, this.$elt).add(this._d.classSliderScroll, this.$elt),
			pos: 0,
			spos: null,
			x: null,
			dragging: false
		};

		this.init = function() {
			var $elt = this.$elt,
					item = this._s;

			if ($elt.hasClass('g-hidden')) {
				$elt.removeClass('g-hidden');
				item.innerWidth = $elt.find(this._d.classSliderList).width();
				item.outerWidth = $elt.find(this._d.classSliderOuter).outerWidth();
				$elt.addClass('g-hidden');
			} else {
				item.innerWidth = $elt.find(this._d.classSliderList).width();
				item.outerWidth = $elt.find(this._d.classSliderOuter).outerWidth();
			}

			item.innerWidth = (item.innerWidth < item.outerWidth) ? item.outerWidth : item.innerWidth;
			item.scrollWidth = item.outerWidth * item.outerWidth / item.innerWidth - 20;

			if (item.innerWidth - item.outerWidth <= 0) {
				item.kfc = 1;
				item.$controls.hide();
				item.$container.css('left', 0);
			} else {
				item.$controls.show();
				item.kfc = (item.innerWidth - item.outerWidth) / (item.outerWidth - item.scrollWidth - 20);
				// TODO: find reason for 20 delta
			}

			item.$knob.css({
				width: item.scrollWidth + 'px',
				left: 0
			});

		};

		this.events = function() {
			var _self = this,
					item = this._s;

			/**
			 * Reinitialize scroll on window resize
			 */
			$(window).resize(function() {
				_self.init();
			});

			/**
			 * Scroll to previous page
			 */
			this.$elt.find(this._d.classItemPrev).unbind('click.prev_items').bind('click.prev_items', function() {
				item.pos -= item.outerWidth;
				if ( item.pos < 0 ) { item.pos = 0 }
				item.$knob.stop(true, true).animate( {left:item.pos / item.kfc + 'px' } );
				item.$container.stop(true, true).animate( {left:-item.pos + 'px'} );
			});

			/**
			 * Scroll to next page
			 */
			this.$elt.find(this._d.classItemNext).unbind('click.next_items').bind('click.next_items', function() {
				var widthDelta = item.innerWidth - item.outerWidth;
				item.pos += item.outerWidth;
				if ( item.pos > widthDelta ) {
					item.pos = widthDelta;
				}

				item.$knob.stop(true, true).animate( {left:item.pos / item.kfc + 'px' } );
				item.$container.stop(true, true).animate( {left:-item.pos + 'px'} );
			});

			/**
			 * Draggable scroll
			 */
			item.$knob.unbind('mousedown.drag_scroll').bind('mousedown.drag_scroll', function(event) {
				item.x = event.pageX;
				item.spos = item.pos;
				item.dragging = true;
			});

			this.$elt.unbind('mousewheel DOMMouseScroll').bind('mousewheel DOMMouseScroll', function(e) {
				var event = e.originalEvent,
						delta = event.wheelDelta ? event.wheelDelta : event.detail*-1;

				var dir = delta > 0 ? -1 : +1;
				item.pos += 30 * dir;
				if ( item.pos < 0 ) item.pos = 0;
				if ( item.pos > item.innerWidth - item.outerWidth ) {
					item.pos = item.innerWidth - item.outerWidth;
				}

				item.$knob.css( 'left' , item.pos / item.kfc );
				item.$container.css( 'left' , -item.pos + 'px' );
			});
		};
		this.init();
		this.events();
		this.commonEvents();
	};

	SScroll.prototype.commonEvents = function() {
		var item = this._s,
				_self = this;

			$(document)
				.bind('mousemove.drag_scroll', function(event) {
					var pos = item.pos;
						
					if ( !item.dragging ) { return true }
					pos = item.spos + (event.pageX - item.x) * item.kfc;
					if ( pos < 0 ) pos = 0;
					if ( pos > item.innerWidth - item.outerWidth ) {
						pos = item.innerWidth - item.outerWidth;
					}
					item.$knob.css( 'left' , pos / item.kfc );
					item.$container.css( 'left' , -pos + 'px' );
				})
				.bind('mouseup.drag_scroll', function() {
					item.dragging = false;
				});

	};

	$.fn.sliderScroll = function(method) {
		return this.each(function() {
			new SScroll( this );
		});
	};
})(jQuery);