/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Qualifier that checks if a string starts in a certain way.
 */
dbm.registerClass("dbm.nodejs.server.router.qualifiers.StartsWithQualifier", "dbm.nodejs.server.router.qualifiers.QualifierBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.server.router.qualifiers.StartsWithQualifier");
	//"use strict";
	
	//Self reference
	var StartsWithQualifier = dbm.importClass("dbm.nodejs.server.router.qualifiers.StartsWithQualifier");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.server.router.qualifiers.StartsWithQualifier::_init");
		
		this.superCall();
		
		this.searchStringEvaluator = null;
		this.fullStringEvaluator = null;
		
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
		
		var fullString = this.searchStringEvaluator.reevaluate(aRoutingData);
		var searchString = this.fullStringEvaluator.reevaluate(aRoutingData);
		
		return (fullString.indexOf(searchString) === 0);
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyIfExists(this.searchStringEvaluator);
		ClassReference.destroyIfExists(this.fullStringEvaluator);
		
		this.superCall();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.searchStringEvaluator = null;
		this.fullStringEvaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aSearchString	Any	Static value or reevaluation for the search string.
	 * @param	aFullString		Any	Static value or reevaluation for the full string.
	 *
	 * @return	The newly created object.
	 */
	staticFunctions.create = function(aSearchString, aFullString) {
		//console.log("dbm.nodejs.server.router.qualifiers.StartsWithQualifier::create");
		
		var newStartsWithQualifier = ClassReference._createAndInitClass(ClassReference);
		
		newStartsWithQualifier.searchStringEvaluator = ReevaluationCreator.reevaluationOrStaticValue(aFirstValue);
		newStartsWithQualifier.fullStringEvaluator = ReevaluationCreator.reevaluationOrStaticValue(aFullString);
		
		return newStartsWithQualifier;
	};
});