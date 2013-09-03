dbm.registerClass("com.developedbyme.utils.data.MultidimensionalArrayHolder", "com.developedbyme.utils.data.ArrayHolder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.MultidimensionalArrayHolder");
	//"use strict";
	
	var MultidimensionalArrayHolder = dbm.importClass("com.developedbyme.utils.data.MultidimensionalArrayHolder");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.MultidimensionalArrayHolder::_init");
		
		this.superCall();
		
		this._lengths = null;
		
		return this;
	};
	
	objectFunctions.getDimesionLength = function(aDimension) {
		return this._lengths[aDimension];
	};
	
	objectFunctions._getArrayPosition = function(aPositions) {
		
		var returnValue = 0;
		var multiplier = 1;
		
		var currentArray = this._lengths;
		var currentArrayLength = currentArray.length;
		for(var i = currentArrayLength; --i >= 0;) { //MENOTE: loop from end to start
			returnValue += multiplier*aPositions[i];
			multiplier *= currentArray[i];
		}
		
		return returnValue;
	};
	
	objectFunctions.getValue = function(/* ... aPositions */) {
		
		aPositions = arguments;
		
		if(aPositions.length !== this._lengths.length) {
			//METODO: error message
			return null;
		}
		
		var arrayPosition = this._getArrayPosition(aPositions);
		return this.array[arrayPosition];
	};
	
	objectFunctions.setValue = function(/* ... aPositions, aValue */) {
		
		if(arguments.length !== this._lengths.length+1) {
			//METODO: error message
			return;
		}
		
		var arrayPosition = this._getArrayPosition(arguments);
		this.array[arrayPosition] = arguments[arguments.length-1];
	};
	
	objectFunctions.setLengths = function(aLengths) {
		this._lengths = aLengths;
		var totalLength = 1;
		var currentArray = this._lengths;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			totalLength *= currentArray[i];
		}
		this.array = new Array(totalLength);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._lengths = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new holder
	 */
	 staticFunctions.create = function(/* ... aLengths */) {
		//trace("breel.utils.data.MultidimensionalArrayHolder.create");
		
		aLengths = arguments;
		
		var newMultidimensionalArrayHolder = (new MultidimensionalArrayHolder()).init();
		newMultidimensionalArrayHolder.setLengths(ArrayFunctions.copyArray(aLengths));
		return newMultidimensionalArrayHolder;
	} //End function create
});