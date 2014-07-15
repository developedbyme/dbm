/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tests to see how the requestAnimationFrame affects performance.
 */
(function() {
	console.log("startFunction")
	var updateFunction = function() {
		//console.log("update");
		window.webkitRequestAnimationFrame(updateFunction);
	};
	
	updateFunction();
})();