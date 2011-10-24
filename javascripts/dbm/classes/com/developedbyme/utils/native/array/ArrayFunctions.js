dbm.registerClass("com.developedbyme.utils.native.array.ArrayFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	staticFunctions.indexOfInArray = function(aArray, aData) {
		if(aArray == null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[ArrayFunctions]", "indexOfInArray", "Array is " + aArray + ". Can't get index of " + aData + ".");
			return -1;
		}
		if(aArray.indexOf) {
			return aArray.indexOf(aData);
		}
		else {
			//MENOTE: ie doesn't have the indexOf function
			var currentArray = aArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentData = currentArray[i];
				if(currentData == aData) {
					return i;
				}
			}
		}
		return -1;
	};
	
	staticFunctions.copyArray = function(aArray) {
		var currentArray = new Array(aArray.length);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			currentArray[i] = aArray[i];
		}
		return currentArray;
	};
});