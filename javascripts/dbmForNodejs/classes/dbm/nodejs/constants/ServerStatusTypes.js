/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.constants.ServerStatusTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.constants.ServerStatusTypes");
	//"use strict";
	
	var ServerStatusTypes = dbm.importClass("dbm.nodejs.constants.ServerStatusTypes");
	
	staticFunctions.STOPPED = 0;
	staticFunctions.STARTING = 2;
	staticFunctions.RUNNING = 1;
});