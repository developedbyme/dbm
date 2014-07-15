/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for qualifying a request being routed.
 */
dbm.registerClass("com.developedbyme.nodejs.server.router.qualifiers.QualifierBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.qualifiers.QualifierBaseObject");
	//"use strict";
	
	//Self reference
	var QualifierBaseObject = dbm.importClass("com.developedbyme.nodejs.server.router.qualifiers.QualifierBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.qualifiers.QualifierBaseObject::_init");
		
		this.superCall();
		
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
		//MENOTE: Should be overridden
		//METODO: error message
		
		return false;
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @return	The newly created object.
	 */
	staticFunctions.create = function() {
		//console.log("com.developedbyme.nodejs.server.router.qualifiers.QualifierBaseObject::create");
		
		var newQualifierBaseObject = ClassReference._createAndInitClass(ClassReference);
		
		return newQualifierBaseObject;
	};
});