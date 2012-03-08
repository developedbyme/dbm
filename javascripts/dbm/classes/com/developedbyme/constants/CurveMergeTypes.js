dbm.registerClass("com.developedbyme.constants.CurveMergeTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.CurveMergeTypes");
	//"use strict";
	
	var CurveMergeTypes = dbm.importClass("com.developedbyme.constants.CurveMergeTypes");
	
	staticFunctions.NON_COMPACT = 0;
	staticFunctions.POINT_MERGE = 1;
	staticFunctions.LINEAR_CONNECT = 2;
	staticFunctions.TANGENT_CURVE_CONNECT = 3;
	
});