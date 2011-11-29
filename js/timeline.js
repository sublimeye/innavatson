IV.timeline = {
	el: {
		"name": ".timeline-device-name",
		"timelineCalendarContainer": ".timeline-calendar-container",
		"timelineCalendarGrid": ".timeline-calendar-grid",
		"timelineCalendar": ".timeline-date a",
		"timelineCalendarSetDate": ".calendar-set-current-date",
		"timelineSlider": ".timeline-main-slider",
		"calendarProceed": ".calendar-proceed-button",
		"calendarClose": ".calendar-close-button",
		"dateStartD": '.timeline-date-begin--date',
		"dateStartT": '.timeline-date-begin--time',
		"dateFinishD": ".timeline-date-finish--date",
		"dateFinishT": ".timeline-date-finish--time",
		"notify": ".timeline-notify",
		"notifyMessage": ".timeline-caution",
		"notifyStartLink": ".timeline-notify-start",
		"notifyFinishLink": ".timeline-notify-finish",
		"notifyStart": ".timeline-notify-start .timeline-notify-date",
		"notifyFinish": ".timeline-notify-finish .timeline-notify-date",
		"notifyDash": ".timeline-notify-dash",
		"timeHandler": ".timeline-handler",
		"timePeriods": ".time-periods",
		"timeLabels": ".time-label",
		"closeTimeline": ".close-timeline"
	},

	/**
	 * Special modification classes for slider
	 */
	sliderModifierClasses: {
		"small": "timeline-small-slider",
		"big": "timeline-big-slider"
	},
	/**
	 * Time period classes. Should be the same as server return in region "type" attribute
	 */
	timePeriodClasses: {
		"1": 'time-period-enabled',
		"2": 'time-period-parking'
	},
	/**
	 * Local storage of timeline data; Update function takes this data after ajax update
	 */
	data: {
		"id": null,
		"name": null,
		"date_start": null,
		"date_finish": null,
		"notify": {
			"message": null,
			"date_start": null,
			"date_finish": null
		},
		"periods": []
	},
	/**
	 * Temporary storage for calendar
	 */
	calendar: {
		"date_start": null,
		"date_finish": null,
		"hours": null,
		"minutes": null
	},

	calendarSliders: {
		"hours": null,
		"minutes": null
	},

	init: function() {
		var id = 10,
				temp_start = 1322133967417,
				temp_finish = 1322306807073;

		this.setListeners();
		this.initCalendarSliders();
		this.initTimelineSlider();
		this.getTimelineData(id, temp_start, temp_finish);
	},

	/**
	 * Add listeners to timeline controls (calendar update, notification correction)
	 */
	setListeners: function() {
		var _t = this,
				calendar = false,
				notifyRegions = $(this.el.notifyStartLink + ', ' + this.el.notifyFinishLink);

		/**
		 * Notify regions update
		 */
		notifyRegions.bind('click.notify_regions', function(e) {
			_t.notifyCorrection(e.target);
			e.preventDefault();
		});

		/**
		 * Preview calendar
		 * CALENDAR popup actions
		 */
		$(this.el.timelineCalendar).bind('click.calendar', function(e) {
			var mode = e.currentTarget.getAttribute('rel'),
					modes = ["date_start", "date_finish"];

			/* if the same calendar is not showing */
			if (calendar != mode) {
				calendar = e.currentTarget.rel;
				$(_t.el.timelineCalendarContainer).css("visibility", "visible");

				/* set container position (left,right) toggle classes on container */
				if (mode == modes[0]) {
					$(_t.el.timelineCalendarContainer).addClass(modes[0]);
					$(_t.el.timelineCalendarContainer).removeClass(modes[1]);
				} else {
					$(_t.el.timelineCalendarContainer).addClass(modes[1]);
					$(_t.el.timelineCalendarContainer).removeClass(modes[0]);
				}
				_t.calendarClearDate();
				_t.calendarPreview(e.currentTarget);
			}

			e.stopPropagation();
			return false
		});

		/* update timeline with new date & time from calendar */
		$(this.el.calendarProceed).bind('click.calendar_apply_date', function() {
			$(_t.el.timelineCalendarContainer).css("visibility", "hidden");
			_t.calendarUpdateTimeline(calendar);
			calendar = false;
			return false
		});

		/* set current date in calendar */
		$(this.el.timelineCalendarSetDate).bind('click.set_current_date', function() {
			_t.calendarSetCurrentDate(calendar);
			return false
		});

		/* hide calendar button */
		$(this.el.calendarClose).bind('click.close_calendar', function() {
			_t.calendarClearDate();
			$(_t.el.timelineCalendarContainer).css("visibility", "hidden");
			calendar = false;
		});

		/* hide calendar popup on document click */
		$(document).bind('click.close_calendar', function() {
			if (calendar) {
				_t.calendarClearDate();
				$(_t.el.timelineCalendarContainer).css("visibility", "hidden");
				calendar = false;
			}
		});

		/**
		 * default click on popup. Prevent popup close
		 */
		$(this.el.timelineCalendarContainer).bind('click.calendar_click', function() {
			return false
		});
	},

	/**
	 * Updates timeline data/re-render
	 * If no parameters provided, local dates will be used;
	 * Send request and get timline data for specified time interval; updates local data object
	 * @param dateStart {number} Start date displaying on timeline in milliseconds
	 * @param dateFinish {number} Finish date displaying on timeline milliseconds
	 */
	getTimelineData: function(id, dateStart, dateFinish) {
		var _t = this,
				_id = id || this.data.id,
				_dateStart = dateStart || this.data.date_start,
				_dateFinish = dateFinish || this.data.date_finish;

		// send request
		$.ajax({
			type: 'POST',
			url: 'faked_server.php',
			dataType: 'json',
			data: {
				id: _id,
				date_start: _dateStart,
				date_finish: _dateFinish
			},
			success: function(data, status, jqXHR) {
				if (status === "success") {
					console.log('Request successful.', " id: ", _id, " start: ", _dateStart, " finish: ", _dateFinish);
					_t.updateLocalData(data);
					_t.updateTimeline();
				}
			},
			complete: function(jqXHR, status) {
				if (status !== "success") {
					console.log('Error in request');
				}
			}
		});
		// update inner object
	},

	updateLocalData: function(data) {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				this.data[key] = data[key];
			}
		}
	},

	updateTimeline: function() {
		// on success/complete
		this.updateNotifications();
		this.updateTimeLabels();
		this.updateRegions();
	},

	/**
	 * Update/redraw timeline notifications, device name, calendar dates etc.
	 */
	updateNotifications: function() {
		var el = this.el,
				da = this.data,
				notifyStart = da.notify.date_start ? this.dDate(da.notify.date_start) : false,
				notifyFinish = da.notify.date_finish ? this.dDate(da.notify.date_finish) : false,
				calendarStartD = this.dDate(da.date_start),
				calendarFinishD = this.dDate(da.date_finish),
				calendarStartT = this.dTime(da.date_start),
				calendarFinishT = this.dTime(da.date_finish);

		//update name
		$(el.name).text(da.name);

		//if exists - update notification
		if (da.notify.message) {
			$(el.notifyMessage).text( da.notify.message );

			if (notifyStart) { $(el.notifyStart).text( notifyStart ); }
			if (notifyFinish) { $(el.notifyFinish).text( notifyFinish ); }

			$(el.notifyStartLink).toggle(!!notifyStart);
			$(el.notifyFinishLink).toggle(!!notifyFinish);
			$(el.notifyDash).toggle(!!notifyStart && !!notifyFinish);

		} else {
			$(el.notify).hide();
		}

		//update calendar dates
		$(el.dateStartD).text(calendarStartD);
		$(el.dateStartT).text(calendarStartT);
		$(el.dateFinishD).text(calendarFinishD);
		$(el.dateFinishT).text(calendarFinishT);
	},

	/**
	 * Update timeline with data suggested in notify area
	 * @param el {object} Notification element clicked by user
	 */
	notifyCorrection: function(el) {
		var attr = $(el).attr('rel');

		/** replace working-data date with notify date */
		this.data[attr] = this.data.notify[attr];
		this.getTimelineData();
	},

	/**
	 * Returns date formatted into two digits ( 30.12 )
	 * @param val {number} Date in milliseconds
	 * @return {string} Date (Date . Month)
	 */
	dDate: function(val) {
		var d = new Date(val*1),
				date = this.formatDate( d.getDate() ),
				month = this.formatDate( d.getMonth() + 1);

		return date + '.' + month;
	},

	/**
	 * Returns time formatted into two digits (23:10)
	 * @param val {number} Date in milliseconds
	 * @return {string} Time (Hours : Minutes)
	 */
	dTime: function(val) {
		var d = new Date(val*1),
				hours = this.formatDate( d.getHours() ),
				minutes = this.formatDate( d.getMinutes() );

		return hours + ':' + minutes;
	},

	/**
	 * Format number into two-digits, if source number < 10 adds "0" in the begining
	 * @param val {number}
	 * @return {string} formatted two-digits string
	 */
	formatDate: function(val) {
		return val*1 < 10 ? "0" + val : "" + val;
	},

	/**
	 * Update/redraw timeline regions
	 */
	updateRegions: function() {
		var periods = this.data.periods,
				totalTime = this.data.date_finish - this.data.date_start,
				$collection = $(),
				width = 0,
				leftPos = 0,
				title = '';

		for (var i=0, len = periods.length; i < len; i++) {
			var li = document.createElement('li'),
					a = document.createElement('a');

			li.className = this.timePeriodClasses[ periods[i].type ];

			/* Generating data for tooltip title */
			title = "С " + this.dTime(periods[i].start) + " до " + this.dTime(periods[i].finish);

			/* determine width in percentage of region */
			width = periods[i].finish - periods[i].start;
			width = (width * 100 / totalTime).toFixed(2)*1;

			/* determine left position in percentage */
			leftPos = periods[i].start - this.data.date_start;
			leftPos = (leftPos * 100 / totalTime).toFixed(2)*1;

			li.style.width = width + "%";
			li.style.left = leftPos + "%";
			a.title = title;
			$(li).append($(a));
//			li.title = title;

			$collection = $collection.add($(li));
		}

		$(this.el.timePeriods).empty().append($collection);
	},

	/**
	 * Update time periods on timeline according to start->end date
	 */
	updateTimeLabels: function() {
		var $labels = $(this.el.timeLabels),
				totalHours = this.data.date_finish - this.data.date_start,
				datePeriod = this.data.date_start*1,
				date;

		totalHours = parseInt( (totalHours / 12), 10);

		//update time labels text (time)
		$.each($labels, function(i, label) {
			datePeriod += totalHours;
			date = new Date(datePeriod);
			date = this.dTime(date);
//			date = this.formatDate( date.getHours() ) + ':' + this.formatDate( date.getMinutes() );

			label.innerHTML = date;
		}.bind(this));
	},

	/**
	 * init time sliders for calendar popup
	 */
	initCalendarSliders: function() {
		var _t = this,
				hours, minutes,
				hoursValues = [0, 23],
				minutesValues = [0, 59];

		hours = this.calendarSliders.hours = $('.calendar-hours-slider');
		minutes = this.calendarSliders.minutes = $('.calendar-minutes-slider');

		var hoursO = $('.calendar-time-hours');
		var minutesO = $('.calendar-time-minutes');

		hours.slider({
			min: hoursValues[0],
			max: hoursValues[1],
			range: 'min',
			step: 1,
			value: 16,
			change: function(e, ui) {
				var val = ui.value;
				_t.calendar.hours = val;
				val = _t.formatDate(val);
				hoursO.text(val);

			},
			slide: function(e, ui) {
				var val = ui.value;

				if (val > hoursValues[1] ) { val = hoursValues[1]	}
				val = _t.formatDate(val);
				hoursO.text(val);
			}
		});

		minutes.slider({
			min: minutesValues[0],
			max: minutesValues[1],
			range: 'min',
			step: 10,
			value: 10,
			change: function(e, ui) {
				var val = ui.value;
				_t.calendar.minutes = val;
				val = _t.formatDate(val);
				minutesO.text(val);
			},
			slide: function(e, ui) {
				var val = ui.value;
				if (val > minutesValues[1] ) { val = minutesValues[1]	}
				val = _t.formatDate(val);
				minutesO.text(val);
			}
		});

		/**
		 * Add modification classes for slider container for correct presentation (small / big slider)
		 */
		hours.slider("widget").addClass(this.sliderModifierClasses.small);
		minutes.slider("widget").addClass(this.sliderModifierClasses.small);

	},

	/**
	 * updates values of Hours Minutes slider in popup
	 */
	updateCalendarSliders: function(date) {
		var hSlider = this.calendarSliders.hours,
				mSlider = this.calendarSliders.minutes;

		hSlider.slider("value", date.getHours());
		mSlider.slider("value", date.getMinutes());
	},

	/**
	 * Preview calendar
	 * @param calendar {string} calendar left/right trigger
	 */
	calendarPreview: function(calendar) {
		var _t = this,
				el = this.el,
				dp = $(el.timelineCalendarGrid),
				mode = $(calendar).attr('rel'),
				date = new Date(this.data[mode]*1);

		this.updateCalendarSliders(date);

		date = this.dDate(date) + '.' + date.getFullYear();

//		dp.empty();
		dp.empty().DatePicker({
			flat: true,
			format: 'd.m.Y',
			date: date,
			calendars: 1,
			start: 1,
			onChange: function(formatted, date, dp) {
				_t.calendar[mode] = date;
			}
		});

		/* store initial values of calendar date */
		_t.calendar[mode] = dp.DatePickerGetDate();
	},

	/**
	 * updates calendar with current date and time
	 */
	calendarSetCurrentDate: function(mode) {
		var el = this.el,
				dp = $(el.timelineCalendarGrid),
				date = new Date();

		//update calendar
		dp.DatePickerSetDate(date, true);

		this.updateCalendarSliders(date);

		this.calendar[mode] = dp.DatePickerGetDate();
	},

	/**
	 * clear local calendar data
	 */
	calendarClearDate: function() {
		var c = this.calendar;

		for (var key in c) {
			if ( c.hasOwnProperty(key) ) {c[key] = null}
		}
	},

	/**
	 * Apply changes / update timline with new date (from calendar)
	 */
	calendarUpdateTimeline: function(mode) {
		var c = this.calendar,
				d = this.data,
				time,
				xMin = 1000 * 60,
				xHour = xMin * 60;

		/*Converting slider's hours:minutes to milliseconds*/
		time = ( c.hours * xHour ) + ( c.minutes * xMin );
		/*Adding sliders time to calendar's date*/
		c[mode] = new Date( c[mode].getTime() + time );

		d[mode] = c[mode].getTime();
		this.getTimelineData();
	},

	/**
	 * Init timeline main slider
	 */
	initTimelineSlider: function() {
		var _t = this,
				ts = $(this.el.timelineSlider);

		ts.slider({
			min: 0,
			max: 1000,
			value: 500,
			change: function(e, ui) {
				_t.setTimelineSliderPosition(ui.value);
			},
			slide: function() {
				//TODO: Display tooltip with current time position
			}
		});

		/**
		 * Add modification classes for slider container for correct presentation (small / big slider)
		 */
		ts.slider("widget").addClass(this.sliderModifierClasses.big);
	},

	/**
	 * Proxy function. Triggered on main timeline slider change
	 */
	setTimelineSliderPosition: function(value) {
		var totalTime = this.data.date_finish - this.data.date_start;
		var positionPercentage = value * 100 / 1000;
		var ms = totalTime * value / 1000;
		var msShifted = ms + this.data.date_start*1;


		var result = {
			"Общее расстояние: ": totalTime,
			"Текущее положение слайдера: ": value,
			"Текущее положение слайдера в процентном соотношении: ": positionPercentage + "%",
			"Позиция в миллисекундах (учитывая отображаемое расстояние) это: ": ms,
			"Точный UNIX timestamp для этой позиции: ": msShifted
		};

	}
};