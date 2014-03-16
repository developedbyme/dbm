/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.webgl.WebglDrawTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.webgl.WebglDrawTypes");
	
	var WebglDrawTypes = dbm.importClass("com.developedbyme.constants.webgl.WebglDrawTypes");
	
	staticFunctions.STREAM_DRAW = 0x88E0;
	staticFunctions.STATIC_DRAW = 0x88E4;
	staticFunctions.DYNAMIC_DRAW = 0x88E8;
});