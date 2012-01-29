dbm.registerClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	
	var ReevaluateArrayObject = dbm.importClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	
	var ReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationBaseObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject::init");
		
		this.superCall();
		
		this.originalArray = null;
		
		return this;
	};
	
	objectFunctions.getDataObject = function() {
		return this.originalArray;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		var currentArray = this.originalArray;
		var theLength = currentArray.length;
		
		var returnArray = new Array(theLength);
		
		for (var i = 0; i < theLength; i++) {
			var currentData = this.originalArray[i];
			if(currentData instanceof ReevaluationBaseObject) {
				returnArray[i] = currentData.reevaluate(aBaseObject);
			}
			else {
				returnArray[i] = currentData;
			}
		}
		
		return returnArray;
	}
	
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
		newObject.originalArray = aOriginalArray;
		return newObject;
	}
});