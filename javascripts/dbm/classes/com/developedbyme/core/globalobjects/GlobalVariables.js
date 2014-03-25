/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.GlobalVariables", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.GlobalVariables");
	//"use strict";
	
	var GlobalVariables = dbm.importClass("com.developedbyme.core.globalobjects.GlobalVariables");
	
	staticFunctions.FLOW_UPDATE_NUMBER = 1;
	staticFunctions.RANDOM_VALUES = new Array();
	staticFunctions.SHARED_RANDOM_NUMBER_GENERATOR = null;
});