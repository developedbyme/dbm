dbm.registerClass("com.developedbyme.utils.native.array.ArrayGenerator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.array.ArrayGenerator");
	//"use strict";
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ArrayGenerator = dbm.importClass("com.developedbyme.utils.native.array.ArrayGenerator");
	
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
});