/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Qualifier that checks that 2 values are matching.
 */
dbm.registerClass("com.developedbyme.nodejs.server.router.qualifiers.EqualsQualifier", "com.developedbyme.nodejs.server.router.qualifiers.QualifierBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.qualifiers.EqualsQualifier");
	//"use strict";
	
	//Self reference
	var EqualsQualifier = dbm.importClass("com.developedbyme.nodejs.server.router.qualifiers.EqualsQualifier");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.qualifiers.EqualsQualifier::_init");
		
		this.superCall();
		
		this.firstValueEvaluator = null;
		this.secondValueEvaluator = null;
		
		return this;
	};
	
	/**
	 * Qualifies a routing data.
	 *
	 * @param	RoutedData	The data being qualified.
	 *
	 * @return	Boolean	True if the routing data is qualified.
	 */
	objectFunctions.qualify = function(aRoutingData) {
		return (this.firstValueEvaluator.reevaluate(aRoutingData) === this.secondValueEvaluator.reevaluate(aRoutingData));
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyIfExists(this.firstValueEvaluator);
		ClassReference.destroyIfExists(this.secondValueEvaluator);
		
		this.superCall();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.firstValueEvaluator = null;
		this.secondValueEvaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aFirstValue		Any	Static value or reevaluation for the first value to compare.
	 * @param	aSecondValue	Any	Static value or reevaluation for the second value to compare.
	 *
	 * @return	The newly created object.
	 */
	staticFunctions.create = function(aFirstValue, aSecondValue) {
		//console.log("com.developedbyme.nodejs.server.router.qualifiers.EqualsQualifier::create");
		
		var newEqualsQualifier = ClassReference._createAndInitClass(ClassReference);
		
		newEqualsQualifier.firstValueEvaluator = ReevaluationCreator.reevaluationOrStaticValue(aFirstValue);
		newEqualsQualifier.secondValueEvaluator = ReevaluationCreator.reevaluationOrStaticValue(aSecondValue);
		
		return newEqualsQualifier;
	};
});