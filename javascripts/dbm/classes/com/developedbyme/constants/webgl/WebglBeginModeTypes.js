/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.webgl.WebglBeginModeTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.webgl.WebglBeginModeTypes");
	
	var WebglBeginModeTypes = dbm.importClass("com.developedbyme.constants.webgl.WebglBeginModeTypes");
	
	staticFunctions.POINTS = 0x0000;
	staticFunctions.LINES = 0x0001;
	staticFunctions.LINE_LOOP = 0x0002;
	staticFunctions.LINE_STRIP = 0x0003;
	staticFunctions.TRIANGLES = 0x0004;
	staticFunctions.TRIANGLE_STRIP = 0x0005;
	staticFunctions.TRIANGLE_FAN = 0x0006;
});

