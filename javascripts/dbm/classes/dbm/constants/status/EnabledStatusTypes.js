/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.status.EnabledStatusTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.status.EnabledStatusTypes");
	
	var EnabledStatusTypes = dbm.importClass("dbm.constants.status.EnabledStatusTypes");
	
	staticFunctions.DISABLED = "disabled";
	staticFunctions.ENABLED = "enabled";
	staticFunctions.FORCE_ENABLED = "forceEnabled";
	
});