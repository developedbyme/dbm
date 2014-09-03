/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for reevalution objects that needs to reference an object.
 */
dbm.registerClass("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var ObjectReevaluationBaseObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	//Error report
	
	//Dependnecies
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var NoChangeObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.NoChangeObject");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject::_init");
		
		this.superCall();
		
		this.objectReevaluator = null;
		
		return this;
	};
	
	/**
	 * Sets the object reevaluator to use the base object.
	 *
	 * @return	self
	 */
	objectFunctions.useBaseObjectAsObject = function() {
		this.objectReevaluator = (new NoChangeObject()).init();
		
		return this;
	};
	
	/**
	 * Sets the object reevaluator to use a static object.
	 *
	 * @return	self
	 */
	objectFunctions.setStaticObjectAsObject = function(aObject) {
		var staticVaraiableObject = (new StaticVariableObject()).init();
		staticVaraiableObject.reevaluationData = aObject;
		
		this.objectReevaluator = staticVaraiableObject;
		
		return this;
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyIfExists(this.objectReevaluator);
		
		this.superCall();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.objectReevaluator = null;
		
		this.superCall();
	};
});