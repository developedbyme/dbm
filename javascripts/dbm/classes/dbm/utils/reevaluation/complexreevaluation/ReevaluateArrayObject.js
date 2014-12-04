/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	
	var ReevaluateArrayObject = dbm.importClass("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	var ReevaluationBaseObject = dbm.importClass("dbm.utils.reevaluation.ReevaluationBaseObject");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayObject::_init");
		
		this.superCall();
		
		this.originalArray = null;
		
		return this;
	};
	
	objectFunctions.getDataObject = function() {
		return this.originalArray;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayObject::reevaluate");
		//console.log(this, aBaseObject);
		
		var currentArray = this.originalArray.reevaluate(aBaseObject);
		var theLength = currentArray.length;
		
		var returnArray = new Array(theLength);
		
		for (var i = 0; i < theLength; i++) {
			var currentData = currentArray[i];
			if(currentData instanceof ReevaluationBaseObject) {
				returnArray[i] = currentData.reevaluate(aBaseObject);
			}
			else {
				returnArray[i] = currentData;
			}
		}
		
		return returnArray;
	};
	
	objectFunctions.performDestroy = function() {
		
		//METODO: destroy child evaluators
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.originalArray = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new reevaluator that reevaluates the objects of an array.
	 * 
	 * @param	aOriginalArray	The array that can have both static and reevaluator objects.
	 * @return	The new object.
	 */
	staticFunctions.createReevaluationObject = function(aOriginalArray) {
		var newObject = (new ReevaluateArrayObject()).init();
		newObject.originalArray = ReevaluationCreator.reevaluationOrStaticValue(aOriginalArray);
		return newObject;
	};
});