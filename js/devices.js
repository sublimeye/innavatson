/**
 * Devices module
 */

IV.devices = {
	init: function() {
		this.devicesSectionSwitcher();
	},

	devicesSectionSwitcher: function() {
		var idx = '3';
		$('#devices .sidebar-nav .grad-red').click(function(){
			var $this = $(this);
			var newIdx = $this.attr('idx');
			if (newIdx == idx) return true;
			$this.parent().find('.active').removeClass('active');
			$this.addClass('active');
			$('#d'+idx).addClass('g-hidden'); // hide old
			$('#d'+newIdx).removeClass('g-hidden'); // show new
			idx = newIdx;
		});
	}
};
