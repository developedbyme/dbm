/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.string.StringAliases", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.string.StringAliases");
	//"use strict";
	
	var StringAliases = dbm.importClass("dbm.utils.native.string.StringAliases");
	
	var KeyValueObject = dbm.importClass("dbm.core.data.generic.KeyValueObject");
	var LevenshteinDistance = dbm.importClass("dbm.utils.native.string.LevenshteinDistance");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.native.string.StringAliases::_init");
		
		this.superCall();
		
		this._aliases = new Array();
		this._realValues = new Array();
		
		this._textConversions = new Array();
		this._levenshteinDistance = LevenshteinDistance.create();
		
		return this;
	};
	
	objectFunctions._getConvertedString = function(aString) {
		//console.log("dbm.utils.native.string.StringAliases::_getConvertedString");
		
		var returnString = aString;
		var currentArray = this._textConversions;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			returnString = currentObject.convertString(returnString);
		}
		
		//console.log(returnString);
		return returnString;
	};
	
	objectFunctions._compareCharCodes = function(aCharCodes1, aCharCodes2, aStartPosition) {
		//console.log("dbm.utils.native.string.StringAliases::_compareCharCodes");
		var testLength = Math.min(aCharCodes1.length, aCharCodes2.length);
		for(var i = aStartPosition; i < testLength; i++) {
			if(aCharCodes1[i] > aCharCodes2[i]) {
				return 1;
			}
			else if(aCharCodes1[i] < aCharCodes2[i]) {
				return -1;
			}
		}
		if(aCharCodes1.length === aCharCodes2.length) {
			return 0;
		}
		return (aCharCodes1.length > aCharCodes2.length) ? 1 : -1;
	};
	
	objectFunctions._findAliasIndex = function(aName) {
		
		var nameCharCodes = StringFunctions.splitToCharCodes(this._getConvertedString(aName));
		
		var startChar = 0;
		var lowIndex = 0;
		var highIndex = this._aliases.length;
		
		var currentArray = this._aliases;
		var firstComparison = this._compareCharCodes(nameCharCodes, currentArray[0].name, startChar);
		if(firstComparison < 1) {
			if(firstComparison === 0) {
				return currentArray[0].value;
			}
			return -1;
		}
		
		var lowChar = currentArray[0].name[0];
		var highChar = 10000;
		
		var debugCounter = 0;
		while(lowIndex !== highIndex) {
			if(debugCounter++ > 10000) {
				//METDO: error message
				break;
			}
			
			var testIndex = Math.floor(0.5*(lowIndex+highIndex));
			var testItem = currentArray[testIndex];
			var testCharCodes = testItem.name;
			
			var comparison = this._compareCharCodes(nameCharCodes, testCharCodes, startChar);
			if(comparison === 0) {
				return testItem.value;
			}
			
			if(comparison === 1) {
				lowIndex = testIndex+1;
				lowChar = testItem.name[startChar];
			}
			else {
				highIndex = testIndex;
				highChar = testItem.name[startChar];
			}
			
			if(lowChar === highChar) {
				var lowChar = currentArray[lowIndex].name[0];
				var highChar = 10000;
				startChar++;
			}
		}
		
		return -1;
	};
	
	objectFunctions._getInsertPosition = function(aCharCodes) {
		//console.log("dbm.utils.native.string.StringAliases::_getInsertPosition");
		
		var nameCharCodes = aCharCodes;
		
		var startChar = 0;
		var lowIndex = 0;
		var highIndex = this._aliases.length;
		
		if(highIndex === 0) {
			return 0;
		}
		
		var currentArray = this._aliases;
		var firstComparison = this._compareCharCodes(nameCharCodes, currentArray[0].name, startChar);
		if(firstComparison < 1) {
			if(firstComparison === 0) {
				//METODO: error message
				return -1;
			}
			return 0;
		}
		
		var lowChar = currentArray[0].name[0];
		var highChar = 10000;
		
		var debugCounter = 0;
		while(lowIndex !== highIndex) {
			if(debugCounter++ > 10000) {
				//METDO: error message
				break;
			}
			
			var testIndex = Math.floor(0.5*(lowIndex+highIndex));
			var testItem = currentArray[testIndex];
			var testCharCodes = testItem.name;
			
			var comparison = this._compareCharCodes(nameCharCodes, testCharCodes, startChar);
			//console.log(nameCharCodes, testCharCodes, startChar, comparison);
			if(comparison === 0) {
				//METODO: error message
				return -1;
			}
			
			if(comparison === 1) {
				lowIndex = testIndex+1;
				lowChar = testItem.name[startChar];
			}
			else {
				highIndex = testIndex;
				highChar = testItem.name[startChar];
			}
			
			if(lowChar === highChar) {
				var lowChar = currentArray[lowIndex].name[0];
				var highChar = 10000;
				startChar++;
			}
		}
		
		return lowIndex;
	};
	
	objectFunctions._createAlias = function(aName, aIndex) {
		var nameCharCodes = StringFunctions.splitToCharCodes(this._getConvertedString(aName));
		var newKeyValueObject = KeyValueObject.create(nameCharCodes, aIndex);
		
		var insertPosition = this._getInsertPosition(nameCharCodes);
		this._aliases.splice(insertPosition, 0, newKeyValueObject);
	};
	
	objectFunctions.addRealValue = function(aRealValue) {
		
		var newPosition = this._realValues.length;
		this._realValues.push(aRealValue);
		this._createAlias(aRealValue, newPosition);
		
		return newPosition;
	};
	
	objectFunctions.addAliasesToValue = function(aAliases, aRealValue) {
		
		var index = ArrayFunctions.indexOfInArray(this._realValues, aRealValue);
		if(index === -1) {
			index = this.addRealValue(aRealValue);
		}
		
		var currentArray = aAliases;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this._createAlias(currentArray[i], index);
		}
		
		return this;
	};
	
	objectFunctions.addStringConversion = function(aConverter) {
		
		this._textConversions.push(aConverter);
		
		return this;
	};
	
	objectFunctions.resolveAlias = function(aName) {
		var index = this._findAliasIndex(aName);
		if(index !== -1) {
			return this._realValues[index];
		}
		//METODO: error message
		return null;
	};
	
	objectFunctions.getClosestValue = function(aName) {
		var nameCharCodes = StringFunctions.splitToCharCodes(this._getConvertedString(aName));
		
		var lowestIndex = -1;
		var lowestText = null;
		var lowestValue = 1000;
		
		var currentArray = this._aliases;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentWord = currentArray[i].name;
		
			//var minScore = Math.abs(currentText.length-currentWord.length);
			//var maxScore = Math.max(currentText.length, currentWord.length);
			var testValue = this._levenshteinDistance.compareArrays(nameCharCodes, currentWord);
			if(testValue < lowestValue || (testValue === lowestValue && Math.abs(nameCharCodes.length-currentWord.length) < Math.abs(nameCharCodes.length-lowestText.length))) {
				lowestIndex = currentArray[i].value;
				lowestValue = testValue;
				lowestText = currentWord;
			}
		}
		
		return this._realValues[lowestIndex];
	};
	
	staticFunctions.create = function() {
		
		var newStringAliases = (new StringAliases()).init();
		
		return newStringAliases;
	};
});