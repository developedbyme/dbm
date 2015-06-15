/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.generic.CurveMergeTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.generic.CurveMergeTypes");
	//"use strict";
	
	var CurveMergeTypes = dbm.importClass("dbm.constants.generic.CurveMergeTypes");
	
	staticFunctions.NON_COMPACT = 0;
	staticFunctions.POINT_MERGE = 1;
	staticFunctions.LINEAR_CONNECT = 2;
	staticFunctions.TANGENT_CURVE_CONNECT = 3;
	
});