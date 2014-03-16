/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.generic.EnabledStatusTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.generic.EnabledStatusTypes");
	
	var EnabledStatusTypes = dbm.importClass("com.developedbyme.constants.generic.EnabledStatusTypes");
	
	staticFunctions.DISABLED = "disabled";
	staticFunctions.ENABLED = "enabled";
	staticFunctions.FORCE_ENABLED = "forceEnabled";
	
});