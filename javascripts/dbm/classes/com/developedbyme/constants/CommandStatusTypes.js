/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.CommandStatusTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.CommandStatusTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	staticFunctions.CONTINUE = 1;
	staticFunctions.BREAK = 0;
	staticFunctions.ERROR = -1;
	
});