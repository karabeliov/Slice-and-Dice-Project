jQuery.noConflict();

jQuery(document).ready(function(){
	var $menu_right = jQuery('#menu-bg');

	et_change_menu_width();

	jQuery(window).resize( function(){
		if ( ! et_idevice ) et_change_menu_width();
	});

	function et_change_menu_width(){
		$menu_right.width( ( jQuery(window).width() - 970 ) * 3 );
	}
});