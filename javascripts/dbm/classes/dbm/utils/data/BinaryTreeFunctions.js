/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.data.BinaryTreeFunctions", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.BinaryTreeFunctions");
	//"use strict";
	
	var BinaryTreeFunctions = dbm.importClass("dbm.utils.data.BinaryTreeFunctions");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	staticFunctions.getArrayPosition = function(aNumber, aDepth) {
		var returnPosition = 0;
		var currentValue = aNumber;
		
		for(var i = 0; i <= aDepth; i++) {
			var offsetLength = aDepth-i;
			var currentBit = currentValue & 0x01;
			returnPosition += currentBit*(1 << offsetLength);
			currentValue >>= 1;
		}
		
		return returnPosition;
	};
	
	staticFunctions.getNextPowerOfTwoLength = function(aValue) {
		var returnLength = 0;
		while(aValue > (2 << returnLength)) {
			returnLength++;
		}
		return returnLength;
	};
});