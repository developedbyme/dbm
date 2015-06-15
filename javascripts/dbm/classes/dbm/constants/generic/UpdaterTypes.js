/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Types used by the update manager to control in which order functions are called.
 */
dbm.registerClass("dbm.constants.generic.UpdaterTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.generic.UpdaterTypes");
	//"use strict";
	
	//Self reference
	var UpdaterTypes = dbm.importClass("dbm.constants.generic.UpdaterTypes");
	
	staticFunctions.UPDATE_INPUT = "updateInput";
	staticFunctions.UPDATE_TIMELINES = "updateTimelines";
	staticFunctions.DEFAULT = "default";
	staticFunctions.UPDATE_FLOW = "updateFlow";
});