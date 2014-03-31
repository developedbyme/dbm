/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.ExtrapolationTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.ExtrapolationTypes");
	
	var ExtrapolationTypes = dbm.importClass("com.developedbyme.constants.ExtrapolationTypes");
	
	staticFunctions.CONSTANT = 0;
	staticFunctions.CYCLE = 1;
	staticFunctions.CYCLE_WITH_OFFSET = 2;
	staticFunctions.LINEAR = 3;
	staticFunctions.OSCILLATE = 4;
	
});
