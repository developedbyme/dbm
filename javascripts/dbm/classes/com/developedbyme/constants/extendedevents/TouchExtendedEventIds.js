/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.extendedevents.TouchExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.extendedevents.TouchExtendedEventIds");
	//"use strict";
	
	var TouchExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.TouchExtendedEventIds");
	
	staticFunctions.START = "touchStart";
	staticFunctions.END = "touchEnd";
	staticFunctions.END_OUTSIDE = "touchEndOutside";
	staticFunctions.MOVE = "touchMove";
	staticFunctions.ENTER = "touchEnter";
	staticFunctions.LEAVE = "touchLeave";
	staticFunctions.CANCEL = "touchCancel";
	
});