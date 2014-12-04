/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevaluation that just returns the base object.
 */
dbm.registerClass("dbm.utils.reevaluation.staticreevaluation.SelectBaseObjectObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	//Self reference
	var SelectBaseObjectObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Contructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.staticreevaluation.SelectBaseObjectObject::_init");
		
		this.superCall();
		
		this.reevaluationData = null;
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference.
	 *
	 * @param	aBaseObject		*	The object to base the reevaluation from.
	 *
	 * @return	*	The base object
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		
		return aBaseObject;
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.reevaluationData = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new command of this class.
	 *
	 * @return	SelectBaseObjectObject	The newly created command.
	 */
	staticFunctions.createCommand = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});