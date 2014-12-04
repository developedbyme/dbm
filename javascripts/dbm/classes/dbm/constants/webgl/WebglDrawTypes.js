/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.webgl.WebglDrawTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.webgl.WebglDrawTypes");
	
	var WebglDrawTypes = dbm.importClass("dbm.constants.webgl.WebglDrawTypes");
	
	staticFunctions.STREAM_DRAW = 0x88E0;
	staticFunctions.STATIC_DRAW = 0x88E4;
	staticFunctions.DYNAMIC_DRAW = 0x88E8;
});