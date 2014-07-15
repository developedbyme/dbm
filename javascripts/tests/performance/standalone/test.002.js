/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tests to see how an interrval affects performance.
 */
(function() {
	console.log("startFunction")
	var updateFunction = function() {
		//console.log("update");
	};
	
	var intervalId = setInterval(updateFunction, 17);
})();