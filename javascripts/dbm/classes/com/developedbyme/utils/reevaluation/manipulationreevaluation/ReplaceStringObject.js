/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevaluator that replaces a key value in a string.
 */
dbm.registerClass("com.developedbyme.utils.reevaluation.manipulationreevaluation.ReplaceStringObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.manipulationreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var ReplaceStringObject = dbm.importClass("com.developedbyme.utils.reevaluation.manipulationreevaluation.ReplaceStringObject");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.manipulationreevaluation.ReplaceStringObject::_init");
		
		this.superCall();
		
		this.stringReevaluator = null;
		this.oldValueReevaluator = null;
		this.newValueReevaluator = null;
		
		return this;
	};
	
	/**
	 * Reevaluates the value.
	 *
	 * @param	aBaseObject	The abse for the reevaluation.
	 *
	 * @return	Any	The reevaluated value.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.manipulationreevaluation.ReplaceStringObject::reevaluate");
		//console.log(this, aBaseObject);
		
		var string = this.stringReevaluator.reevaluate(aBaseObject);
		var oldValue = this.oldValueReevaluator.reevaluate(aBaseObject);
		var newValue = this.newValueReevaluator.reevaluate(aBaseObject);
		
		return string.split(oldValue).join(newValue);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.stringReevaluator = null;
		this.oldValueReevaluator = null;
		this.newValueReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aString, aOldValue, aNewValue) {
		//console.log("com.developedbyme.utils.reevaluation.manipulationreevaluation.ReplaceStringObject::createCommand (static)");
		var newCommand = ClassReference._createAndInitClass(ClassReference);
		
		newCommand.stringReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aString);
		newCommand.oldValueReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aOldValue);
		newCommand.newValueReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aNewValue);
		
		return newCommand;
	};
});