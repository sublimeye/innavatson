/**
 * InnaVatson project
 */

var IV = {
	init: function() {
		$('.j-scrollable').tinyscrollbar();

		/* calculate and set height to middle {page-mid} container */
		this.calcLayout();
		this.sectionSwitcher();

		$('.slider').sliderScroll();

		var el = $('.slider-item'),
				parent = el.eq(0).parent();

		el.eq(0).bind('click', function() {
			parent.append(el.eq(1).clone());
			$('.slider').sliderScroll();
		});

		el.eq(1).bind('click', function() {
			var i = parent.find('.slider-item');
			i.eq(i.length-1).remove();
			$('.slider').sliderScroll();
		});

		/* custom scrollable content */

		this.timeline.init();
		/* modules */
		this.devices.init();

		/* attach events */
		this.events();
	},

	events: function() {
		window.onresize = function() {
			this.calcLayout();
			this.updateScrollbars();
		}.bind(this);
	},

	calcLayout: function() {
		var mid = $('.page-mid'),
				top = $('.page-top'),
				bot = $('.page-bot');

		mid.css('height', document.body.clientHeight - (top.get(0).clientHeight + bot.get(0).clientHeight) + 'px');
	},

	updateScrollbars: function() {
		$('.j-scrollable').tinyscrollbar();
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
				case 'map': $('#map, #users-timeline').addClass('g-hidden'); break;
				case 'devices': $('#devices, .users-slider').addClass('g-hidden'); break;
				case 'zones': $('#zones, .slider--zones').addClass('g-hidden'); break;
				case 'groups': $('#groups').addClass('g-hidden'); break;
			}

			switch(newIdx) {
				case 'map': $('#map, #users-timeline').removeClass('g-hidden'); break;
				case 'devices': $('#devices, .users-slider').removeClass('g-hidden'); break;
				case 'zones': $('#zones, .slider--zones').removeClass('g-hidden'); break;
				case 'groups': $('#groups').removeClass('g-hidden'); break;
			}
			idx = newIdx;
			_app.calcLayout();
			_app.updateScrollbars();
		});
	}

};

$(document).ready(function() {
	IV.init();
});