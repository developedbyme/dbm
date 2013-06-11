dbm.registerClass("com.developedbyme.utils.native.array.ArrayFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.array.ArrayFunctions");
	//"use strict";
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions.indexOfInArray = function(aArray, aData) {
		if(aArray == null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[ArrayFunctions]", "indexOfInArray", "Array is " + aArray + ". Can't get index of " + aData + ".");
			return -1;
		}
		if(aArray.indexOf) {
			return aArray.indexOf(aData);
		}
		else {
			//MENOTE: MSIE <9 doesn't have the indexOf function
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
	
	staticFunctions.lastIndexOfInArray = function(aArray, aData) {
		if(aArray == null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[ArrayFunctions]", "lastIndexOfInArray", "Array is " + aArray + ". Can't get index of " + aData + ".");
			return -1;
		}
		if(aArray.lastIndexOf) {
			return aArray.lastIndexOf(aData);
		}
		else {
			//MENOTE: MSIE <9 doesn't have the lastIndexOf function
			var currentArray = aArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentData = currentArray[currentArrayLength-i-1];
				if(currentData == aData) {
					return i;
				}
			}
		}
		return -1;
	};
	
	staticFunctions.hasDuplicates = function(aArray) {
		if(aArray == null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[ArrayFunctions]", "hasDuplicates", "Array is " + aArray + ". Can't get index of " + aData + ".");
			return -1;
		}
		var currentArray = aArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentData1 = currentArray[i];
			for(var j = i+1; j < currentArrayLength; j++) {
				var currentData2 = currentArray[j];
				if(currentData1 == currentData2) {
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
	
	staticFunctions.getPositionInOrder = function(aValue, aArray) {
		var currentArray = aArray
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(aValue < currentArray[i]) {
				return i;
			}
		}
		return currentArrayLength;
	};
	
	/**
	 * Randomizes an array.
	 */
	staticFunctions.randomizeArray = function(aArray, aNumberOfTimes) {
		var currentArray = aArray;
		var currentArrayLength= currentArray.length;
		for(var i = 0; i < aNumberOfTimes; i++) {
			var randomIndex1 = Math.floor(Math.random()*currentArrayLength);
			var randomIndex2 = (currentArrayLength+Math.floor(Math.random()*(currentArrayLength-1))+1)%currentArrayLength;
			
			var tempValue = currentArray[randomIndex1];
			currentArray[randomIndex1] = currentArray[randomIndex2];
			currentArray[randomIndex2] = tempValue;
		}
	}; //End function randomizeArray
	
	/**
	 * Randomizes an array with a random number generator.
	 */
	staticFunctions.controlledRandomizeArray = function(aArray, aNumberOfTimes, aRandomGenerator) {
		var currentArray = aArray;
		var currentArrayLength= currentArray.length;
		for(var i = 0; i < aNumberOfTimes; i++) {
			var randomIndex1 = Math.floor(aRandomGenerator.generateRealClosedOpen()*currentArrayLength);
			var randomIndex2 = (currentArrayLength+Math.floor(aRandomGenerator.generateRealClosedOpen()*(currentArrayLength-1))+1)%currentArrayLength;
			
			var tempValue = currentArray[randomIndex1];
			currentArray[randomIndex1] = currentArray[randomIndex2];
			currentArray[randomIndex2] = tempValue;
		}
	}; //End function randomizeArray
	
	staticFunctions.trim = function(aArray, aTrimLeft, aTrimRight) {
		
		aTrimLeft = VariableAliases.valueWithDefault(aTrimLeft, true);
		aTrimRight = VariableAliases.valueWithDefault(aTrimRight, true);
		
		var currentArray = aArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			currentArray[i] = StringFunctions.trim(currentArray[i], aTrimLeft, aTrimRight);
		}
		
		return aArray;
	};
	
	staticFunctions.removeEmptyPositions = function(aArray) {
		
		var currentArray = aArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentValue = currentArray[i];
			if(!VariableAliases.isSet(currentValue)) {
				currentArray.splice(i, 1);
				i--;
				currentArrayLength--;
			}
		}
		
		return aArray;
	};
});