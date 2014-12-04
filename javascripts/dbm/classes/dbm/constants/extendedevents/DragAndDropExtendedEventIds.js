/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.extendedevents.DragAndDropExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.extendedevents.DragAndDropExtendedEventIds");
	//"use strict";
	
	var DragAndDropExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.DragAndDropExtendedEventIds");
	
	staticFunctions.DRAG_START = "dragStart";
	staticFunctions.DRAG_ENTER = "dragEnter";
	staticFunctions.DRAG_OVER = "dragOver";
	staticFunctions.DRAG_LEAVE = "dragLeave";
	staticFunctions.DRAG = "drag";
	staticFunctions.DROP = "drop";
	staticFunctions.DRAG_END = "dragEnd";
	
});