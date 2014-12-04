/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject", "dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject");
	
	var ReevaluateArrayWithTypesObject = dbm.importClass("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject");
	
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	var ReevaluationBaseObject = dbm.importClass("dbm.utils.reevaluation.ReevaluationBaseObject");
	
	var ObjectFunctions = dbm.importClass("dbm.utils.native.object.ObjectFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject::_init");
		
		this.superCall();
		
		this.typesArray = null;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject::reevaluate");
		//console.log(this, aBaseObject);
		
		var currentArray = this.superCall(aBaseObject);
		var currentArrayLength = currentArray.length;
		
		for(var i = 0; i < currentArrayLength; i++) {
			currentArray[i] = ObjectFunctions.convertValueToType(currentArray[i], this.typesArray[i]);
		}
		
		return currentArray;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.typesArray = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new reevaluator that reevaluates the objects of an array.
	 * 
	 * @param	aOriginalArray	The array that can have both static and reevaluator objects.
	 * @param	aTypesArray		The types that the array should be converted to.
	 * @return	The new object.
	 */
	staticFunctions.createCommand = function(aOriginalArray, aTypesArray) {
		var newObject = (new ReevaluateArrayWithTypesObject()).init();
		newObject.originalArray = ReevaluationCreator.reevaluationOrStaticValue(aOriginalArray);
		newObject.typesArray = aTypesArray;
		return newObject;
	};
});