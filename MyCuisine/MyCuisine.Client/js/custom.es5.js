'use strict';

jQuery.noConflict();

jQuery(document).ready(function () {
	var $menu_right = jQuery('#menu-bg');

	function et_change_menu_width() {
		$menu_right.width((jQuery(window).width() - 986) * 3);
	}

	et_change_menu_width();
});

