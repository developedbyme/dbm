/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.status.CommandStatusTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.status.CommandStatusTypes");
	
	var CommandStatusTypes = dbm.importClass("dbm.constants.status.CommandStatusTypes");
	
	staticFunctions.CONTINUE = 1;
	staticFunctions.BREAK = 0;
	staticFunctions.ERROR = -1;
	
});