/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.native.array.ArrayGenerator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.array.ArrayGenerator");
	//"use strict";
	
	var ArrayGenerator = dbm.importClass("com.developedbyme.utils.native.array.ArrayGenerator");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var BinaryTreeFunctions = dbm.importClass("com.developedbyme.utils.data.BinaryTreeFunctions");
	
	staticFunctions.createOrderArray = function(aStartValue, aEndValue) {
		var length = aEndValue-aStartValue;
		var returnArray = new Array(length);
		for(var i = 0; i < length; i++) {
			returnArray[i] = aStartValue+i;
		}
		return returnArray;
	};
	
	staticFunctions.createHalfSplitOrderArray = function(aLength) {
		var powerOfTwoBase = BinaryTreeFunctions.getNextPowerOfTwoLength(aLength);
		var length = 2 << powerOfTwoBase;
		var returnArray = new Array(length);
		
		for(var i = 0; i < aLength; i++) {
			var insertPosition = BinaryTreeFunctions.getArrayPosition(i, powerOfTwoBase);
			returnArray[insertPosition] = i;
		}
		
		ArrayFunctions.removeEmptyPositions(returnArray);
		
		return returnArray;
	};
	
	staticFunctions.createArrayFromCharCodes = function(aStartIndex, aEndIndex, aReturnArray) {
		for(var i = aStartIndex; i < aEndIndex; i++) {
			aReturnArray.push(String.fromCharCode(i));
		}
	};
	
	staticFunctions.createRange = function(aStartIndex, aEndIndex, aStep, aReturnArray) {
		for(var i = aStartIndex; i < aEndIndex; i += aStep) {
			aReturnArray.push(i);
		}
	};
	
	staticFunctions.createNewRange = function(aStartIndex, aEndIndex, aStep) {
		aStep = VariableAliases.valueWithDefault(aStep, 1);
		var returnArray = new Array();
		ClassReference.createRange(aStartIndex, aEndIndex, aStep, returnArray);
		return returnArray;
	};
});