/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.status.ReadyStateTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.status.ReadyStateTypes");
	
	var ReadyStateTypes = dbm.importClass("dbm.constants.status.ReadyStateTypes");
	
	staticFunctions.UNINIZIALIZED = 0;
	staticFunctions.SET_UP = 1;
	staticFunctions.SENT = 2;
	staticFunctions.PARTLY_DONE = 3;
	staticFunctions.DONE = 4;
	
});