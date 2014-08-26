/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Selects a value in a named array.
 */
dbm.registerClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject", "com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var GetNamedArrayValueObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject");
	
	//Error report
	
	//Dependnecies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject::_init");
		
		this.superCall();
		
		this.nameReevaluator = null;
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference.
	 *
	 * @param	aBaseObject	The object to base the reevaluation from.
	 *
	 * @return	The selected value in the named array.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject::reevaluate");
		//console.log(this);
		
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		var theName = this.nameReevaluator.reevaluate(aBaseObject);
		
		//console.log(theObject, theName);
		
		return theObject.getObject(theName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.nameReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that gets a value from a named array
	 * 
	 * @param	aObject		NamedArray	The named array to get the value from.
	 * @param	aName		String		The name of the value to get.
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aObject, aName) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject::createCommand (static)");
		//console.log(aName);
		var newCommand = (new GetNamedArrayValueObject()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aObject);
		newCommand.nameReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aName);
		
		return newCommand;
	};
});