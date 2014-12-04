/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevalutor that jsut returns a static value.
 */
dbm.registerClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	//Self reference
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject::_init");
		
		this.superCall();
		
		this.reevaluationData = null;
		
		return this;
	};
	
	objectFunctions.getDataObject = function() {
		return this.reevaluationData;
	};
	
	/**
	 * The function that reevalutes this reference. Should be overridden.
	 *
	 * @param	aBaseObject		*	The object to base the reevaluation from.
	 *
	 * @return	*	The value set to this command.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		return this.reevaluationData;
	}; //End function reevaluate
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.reevaluationData = null;
		
		this.superCall();
	};
	
	/**
	 * Checks if a variable is owned by this object. Part of the destroy function.
	 *
	 * @param	aName	The name of the variable.
	 *
	 * @return	Boolean	True if this object is the owner of a variable.
	 */
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "reevaluationData":
				return false;
		}
		return this.superCall();
	};
	
	/**
	 * Creates a new reevaluator that returns a static value.
	 * 
	 * @param	aData	*	The data to return when beeing resolved.
	 *
	 * @return	StaticVariableObject	The new object.
	 */
	staticFunctions.createCommand = function(aData) {
		var newObject = (new StaticVariableObject()).init();
		newObject.reevaluationData = aData;
		return newObject;
	};
	
	/**
	 * Creates a new reevaluator that returns a static value.
	 * 
	 * @param	aData	*	The data to return when beeing resolved.
	 *
	 * @return	StaticVariableObject	The new object.
	 */
	staticFunctions.createReevaluationObject = function(aData) {
		var newObject = (new StaticVariableObject()).init();
		newObject.reevaluationData = aData;
		return newObject;
	};
});