/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevaluator rounds a number.
 */
dbm.registerClass("dbm.utils.reevaluation.mathreevaluation.RoundReevaluation", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.mathreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var RoundReevaluation = dbm.importClass("dbm.utils.reevaluation.mathreevaluation.RoundReevaluation");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.mathreevaluation.RoundReevaluation::_init");
		
		this.superCall();
		
		this.valueReevaluator = null;
		
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
		//console.log("dbm.utils.reevaluation.mathreevaluation.RoundReevaluation::reevaluate");
		//console.log(this, aBaseObject);
		
		var value = this.valueReevaluator.reevaluate(aBaseObject);
		
		return Math.round(value);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.roundReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aValue) {
		//console.log("dbm.utils.reevaluation.mathreevaluation.RoundReevaluation::createCommand (static)");
		var newCommand = ClassReference._createAndInitClass(ClassReference);
		
		newCommand.valueReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aValue);
		
		return newCommand;
	};
});