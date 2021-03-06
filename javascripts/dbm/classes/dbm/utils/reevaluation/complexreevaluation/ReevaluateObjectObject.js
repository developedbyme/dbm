/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.complexreevaluation.ReevaluateObjectObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.complexreevaluation.ReevaluateObjectObject");
	
	var ReevaluateObjectObject = dbm.importClass("dbm.utils.reevaluation.complexreevaluation.ReevaluateObjectObject");
	
	var ReevaluationBaseObject = dbm.importClass("dbm.utils.reevaluation.ReevaluationBaseObject");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.complexreevaluation.ReevaluateObjectObject::_init");
		
		this.superCall();
		
		this.originalObject = null;
		
		return this;
	};
	
	objectFunctions.getDataObject = function() {
		return this.originalObject;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		var currentArray = this.originalObject;
		var theLength = currentArray.length;
		
		var returnObject = new Object();
		
		for(var objectName in this.originalObject) {
			var currentData = this.originalObject[objectName];
			if(currentData instanceof ReevaluationBaseObject) {
				returnObject[objectName] = currentData.reevaluate(aBaseObject);
			}
			else {
				returnObject[objectName] = currentData;
			}
		}
		
		return returnObject;
	};
	
	objectFunctions.performDestroy = function() {
		
		//METODO: destroy child evaluators
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.originalObject = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new reevaluator that reevaluates the objects of an object.
	 * 
	 * @param	aOriginalObject	The object that can have both static and reevaluator objects.
	 * @return	The new object.
	 */
	staticFunctions.createReevaluationObject = function(aOriginalObject) {
		var newObject = (new ReevaluateObjectObject()).init();
		newObject.originalObject = aOriginalObject;
		return newObject;
	};
});