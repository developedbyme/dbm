/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.data.MultidimensionalArrayHolder", "dbm.utils.data.ArrayHolder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.MultidimensionalArrayHolder");
	//"use strict";
	
	//Self reference
	var MultidimensionalArrayHolder = dbm.importClass("dbm.utils.data.MultidimensionalArrayHolder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependnecies
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.MultidimensionalArrayHolder::_init");
		
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
		
		var aPositions = arguments;
		
		if(aPositions.length !== this._lengths.length) {
			//METODO: error message
			return null;
		}
		
		var arrayPosition = this._getArrayPosition(aPositions);
		return this.array[arrayPosition];
	};
	
	objectFunctions.setValue = function(/* ... aPositions, aValue */) {
		//console.log("dbm.utils.data.MultidimensionalArrayHolder::setValue");
		
		if(arguments.length !== this._lengths.length+1) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setValue", "Number of positions (" + arguments.length + ") doesn't match dimensions of this array (" + this._lengths.length + ").");
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
		//console.log("dbm.utils.data.MultidimensionalArrayHolder::create");
		
		var aLengths = arguments;
		
		var newMultidimensionalArrayHolder = (new MultidimensionalArrayHolder()).init();
		newMultidimensionalArrayHolder.setLengths(ArrayFunctions.copyArray(aLengths));
		return newMultidimensionalArrayHolder;
	}; //End function create
});