dbm.registerClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject", "com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject");
	
	var ReevaluateArrayWithTypesObject = dbm.importClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject");
	
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	
	var ObjectFunctions = dbm.importClass("com.developedbyme.utils.native.object.ObjectFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject::_init");
		
		this.superCall();
		
		this.typesArray = null;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayWithTypesObject::reevaluate");
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