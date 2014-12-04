/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.string.LevenshteinDistance", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.string.LevenshteinDistance");
	//"use strict";
	
	var LevenshteinDistance = dbm.importClass("dbm.utils.native.string.LevenshteinDistance");
	
	var MultidimensionalArrayHolder = dbm.importClass("dbm.utils.data.MultidimensionalArrayHolder");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.file.formats.csv.CsvParser::_init");
		
		this.superCall();
		
		this._values = MultidimensionalArrayHolder.create();
		this.addDestroyableObject(this._values);
		
		return this;
	};
	
	objectFunctions.compareStrings = function(aString1, aString2) {
		
		var string1Length = aString1.length+1;
		var string2Length = aString2.length+1;
		
		this._values.setLengths([string1Length, string2Length]);
		
		this._values.setValue(0, 0, 0);
		
		for(var i = 0; i < string1Length; i++) {
			this._values.setValue(i, 0, i);
		}
		for(var i = 1; i < string2Length; i++) {
			this._values.setValue(0, i, i);
		}
		
		for(var i = 1; i < string2Length; i++) {
			for(var j = 1; j < string1Length; j++) {
				var char1 = aString1.charAt(j-1);
				var char2 = aString2.charAt(i-1);
				
				if(char1 === char2) {
					this._values.setValue(j, i, this._values.getValue(j-1, i-1));
				}
				else {
					this._values.setValue(j, i, Math.min(this._values.getValue(j-1, i), this._values.getValue(j, i-1), this._values.getValue(j-1, i-1))+1);
				}
			}
		}
		
		return this._values.getValue(string1Length-1, string2Length-1);
	};
	
	objectFunctions.compareArrays = function(aString1, aString2) {
		
		var string1Length = aString1.length+1;
		var string2Length = aString2.length+1;
		
		this._values.setLengths([string1Length, string2Length]);
		
		this._values.setValue(0, 0, 0);
		
		for(var i = 0; i < string1Length; i++) {
			this._values.setValue(i, 0, i);
		}
		for(var i = 1; i < string2Length; i++) {
			this._values.setValue(0, i, i);
		}
		
		for(var i = 1; i < string2Length; i++) {
			for(var j = 1; j < string1Length; j++) {
				var char1 = aString1[j-1];
				var char2 = aString2[i-1];
				
				if(char1 === char2) {
					this._values.setValue(j, i, this._values.getValue(j-1, i-1));
				}
				else {
					this._values.setValue(j, i, Math.min(this._values.getValue(j-1, i), this._values.getValue(j, i-1), this._values.getValue(j-1, i-1))+1);
				}
			}
		}
		
		return this._values.getValue(string1Length-1, string2Length-1);
	};
	
	staticFunctions.create = function() {
		
		var newLevenshteinDistance = (new LevenshteinDistance()).init();
		
		return newLevenshteinDistance;
	};
});