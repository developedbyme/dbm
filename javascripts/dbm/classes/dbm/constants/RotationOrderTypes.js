/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.RotationOrderTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.RotationOrderTypes");
	
	var RotationOrderTypes = dbm.importClass("dbm.constants.RotationOrderTypes");
	
	staticFunctions.XYZ = "xyz";
	staticFunctions.XZY = "xzy";
	staticFunctions.YXZ = "yxz";
	staticFunctions.YZX = "yzx";
	staticFunctions.ZXY = "zxy";
	staticFunctions.ZYX = "zyx";
	
});