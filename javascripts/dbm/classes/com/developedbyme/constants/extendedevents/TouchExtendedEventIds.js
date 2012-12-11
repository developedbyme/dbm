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