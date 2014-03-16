/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.websocket.SharedPropertyDataTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.websocket.SharedPropertyDataTypes");
	
	var SharedPropertyDataTypes = dbm.importClass("com.developedbyme.constants.websocket.SharedPropertyDataTypes");
	
	staticFunctions.ANY = 0x00;
	
	staticFunctions.STRING = 0x01;
	staticFunctions.BOOLEAN = 0x02;
	staticFunctions.UINT = 0x03;
	staticFunctions.INT = 0x04;
	staticFunctions.FLOAT_32 = 0x05;
	staticFunctions.FLOAT_64 = 0x06;
	
	staticFunctions.NULL = 0x09;
	
	staticFunctions.UINT_7 = 0x11;
	staticFunctions.UINT_14 = 0x12;
	staticFunctions.UINT_28 = 0x13;
	staticFunctions.UINT_56 = 0x14;
	
	staticFunctions.INT_7 = 0x19;
	staticFunctions.INT_14 = 0x1A;
	staticFunctions.INT_28 = 0x1B;
	staticFunctions.INT_56 = 0x1C;
	
	staticFunctions.JSON = 0x41;
	
	//Same data array
	//Mixed array
	
	//Parameters
});