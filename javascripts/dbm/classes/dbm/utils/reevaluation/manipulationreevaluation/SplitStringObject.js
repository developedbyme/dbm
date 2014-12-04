/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevaluator that splits a string into an array.
 */
dbm.registerClass("dbm.utils.reevaluation.manipulationreevaluation.SplitStringObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.manipulationreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var SplitStringObject = dbm.importClass("dbm.utils.reevaluation.manipulationreevaluation.SplitStringObject");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.manipulationreevaluation.SplitStringObject::_init");
		
		this.superCall();
		
		this.stringReevaluator = null;
		this.separatorReevaluator = null;
		this.trimLeftReevaluator = null;
		this.trimRightReevaluator = null;
		
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
		//console.log("dbm.utils.reevaluation.manipulationreevaluation.SplitStringObject::reevaluate");
		//console.log(this, aBaseObject);
		
		var string = this.stringReevaluator.reevaluate(aBaseObject);
		var separator = this.separatorReevaluator.reevaluate(aBaseObject);
		var trimLeft = this.trimLeftReevaluator.reevaluate(aBaseObject);
		var trimRight = this.trimLeftReevaluator.reevaluate(aBaseObject);
		
		return StringFunctions.splitSeparatedString(string, separator, trimLeft, trimRight);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.stringReevaluator = null;
		this.separatorReevaluator = null;
		this.trimLeftReevaluator = null;
		this.trimRightReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aString, aSeparator, aTrimLeft, aTrimRight) {
		//console.log("dbm.utils.reevaluation.manipulationreevaluation.SplitStringObject::createCommand (static)");
		var newCommand = ClassReference._createAndInitClass(ClassReference);
		
		aSeparator = VariableAliases.valueWithDefault(aSeparator, ",");
		aTrimLeft = VariableAliases.valueWithDefault(aTrimLeft, true);
		aTrimRight = VariableAliases.valueWithDefault(aTrimRight, true);
		
		newCommand.stringReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aString);
		newCommand.separatorReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aSeparator);
		newCommand.trimLeftReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aTrimLeft);
		newCommand.trimRightReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aTrimRight);
		
		return newCommand;
	};
});