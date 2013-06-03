dbm.registerClass("com.developedbyme.utils.data.BinaryTreeFunctions", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.BinaryTreeFunctions");
	//"use strict";
	
	var BinaryTreeFunctions = dbm.importClass("com.developedbyme.utils.data.BinaryTreeFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
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