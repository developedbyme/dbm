dbm.registerClass("com.developedbyme.utils.native.array.ArrayComparison", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.array.ArrayComparison");
	//"use strict";
	
	var ArrayComparison = dbm.importClass("com.developedbyme.utils.native.array.ArrayComparison");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		
		this.superCall();
		
		this._existsInBothsArray = new Array();
		this._existsOnlyInArray1 = new Array();
		this._existsOnlyInArray2 = new Array();
		
		return this;
	};
	
	objectFunctions.compareArrays = function(aArray1, aArray2) {
		this._existsOnlyInArray1 = ArrayFunctions.copyArray(aArray1);
		this._existsOnlyInArray1.sort();
		this._existsOnlyInArray2 = ArrayFunctions.copyArray(aArray2);
		this._existsOnlyInArray2.sort();
		
		var length1 = this._existsOnlyInArray1.length;
		var length2 = this._existsOnlyInArray2.length;
		for(var position1 = 0, position2 = 0; position1 < length1 && position2 < length2;) {
			console.log(position1, position2, this._existsOnlyInArray1[position1], this._existsOnlyInArray2[position2], this._existsOnlyInArray1[position1] === this._existsOnlyInArray2[position2]);
			if(this._existsOnlyInArray1[position1] === this._existsOnlyInArray2[position2]) {
				this._existsInBothsArray.push(this._existsOnlyInArray1[position1]);
				this._existsOnlyInArray1.splice(position1, 1);
				this._existsOnlyInArray2.splice(position2, 1);
				length1--;
				length2--;
			}
			else if(this._existsOnlyInArray1[position1] < this._existsOnlyInArray2[position2]) {
				position1++;
			}
			else {
				position2++;
			}
		}
	};
	
	staticFunctions.create = function() {
		var newArrayComparison = (new ArrayComparison()).init();
		
		return newArrayComparison;
	};
});