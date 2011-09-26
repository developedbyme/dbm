dbm.registerClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	
	var ReevaluateArrayObject = dbm.importClass("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.reevaluation.complexreevaluation.ReevaluateArrayObject::init");
		
		this.superCall();
		
		this.originalArray = null;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		var currentArray = this.originalArray;
		var theLength = currentArray.length;
		
		var returnArray = new Array(theLength);
		
		for (var i = 0; i < theLength; i++) {
			var currentData = this.originalArray[i];
			if(currentData.reevaluate != undefined) {
				returnArray[i] = currentData.reevaluate(aBaseObject);
			}
			else {
				returnArray[i] = currentData;
			}
		}
		
		return returnArray;
	}
	
	objectFunctions.performDestroy = function() {
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