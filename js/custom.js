/*	Responsive Boilerplate
		Designed & Built by Fernando Monteiro, http://www.newaeonweb.com.br
		Licensed under MIT license, http://opensource.org/licenses/mit-license.php
*/

//Hide the url bar on smartphones
/*
 * Normalized hide address bar for iOS & Android
 * (c) Scott Jehl, scottjehl.com
 * MIT License
 */



//Simple function to a responsive menu
(function () {
		$("#nav").before('<div id="menu" class="mobile-menu"><a href="#"><span class="screen-reader-text">Navigation</span></a></div>');

		$("#menu").on('click', function () {
				$("#nav").toggle();
				$("aside").toggle();
		});

		$(window).resize(function () {
				if (window.innerWidth > 768) {
						$("#nav").removeAttr("style");
						$("aside").removeAttr("style");
				}
		});
})(this);
//apply to any markup with nav like this:
/*

 <ul id="nav">
 <li><a href="#">Link</a></li>
 <li><a href="#">Link</a></li>
 <li><a href="#">Link</a></li>
 <li><a href="#">Link</a></li>
 <li><a href="#">Link</a></li>
 </ul>


 */
