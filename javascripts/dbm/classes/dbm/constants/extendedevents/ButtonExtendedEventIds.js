/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.extendedevents.ButtonExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.extendedevents.ButtonExtendedEventIds");
	//"use strict";
	
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	
	staticFunctions.CLICK = "click";
	staticFunctions.MOUSE_OVER = "mouseOver";
	staticFunctions.MOUSE_OUT = "mouseOut";
	
	staticFunctions.PRESS = "press";
	staticFunctions.RELEASE = "release";
	staticFunctions.RELEASE_OUTSIDE = "releaseOutside";
	
});