/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for all routers.
 */
dbm.registerClass("com.developedbyme.nodejs.server.router.RouterBaseObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.RouterBaseObject");
	//"use strict";
	
	//Self reference
	var RouterBaseObject = dbm.importClass("com.developedbyme.nodejs.server.router.RouterBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	//Utils
	
	//Constants
	var RoutedDataStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.RouterBaseObject::_init");
		
		this.superCall();
		
		this._qualifiers = this.addDestroyableObject(ArrayHolder.create(true));
		
		return this;
	};
	
	/**
	 * Adds a qualifier to this router.
	 *
	 * @param	QualifierBaseObject	The qualifier to add.
	 *
	 * @return	self
	 */
	objectFunctions.addQualifier = function(aQualifier) {
		this._qualifiers.array.push(aQualifier);
		
		return this;
	};
	
	/**
	 * Qualifies if the request is valid for this route.
	 *
	 * @param	aRoutedData	RoutedData	The data for the request.
	 *
	 * @return	Boolean	True if the request should be routed by this router.
	 */
	objectFunctions._qualifyRouting = function(aRoutedData) {
		//console.log("com.developedbyme.nodejs.server.router.RouterBaseObject::_qualifyRouting");
		//console.log(this);
		
		var currentArray = this._qualifiers.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentQualifier = currentArray[i];
			var qualifiedReusult = currentQualifier.qualify(aRoutedData);
			if(!qualifiedReusult) {
				return false;
			}
		}
		
		return true;
	};
	
	/**
	 * Routes a new request.
	 *
	 * @param	aRoutedData	RoutedData	The data for the request.
	 *
	 * @return	RoutedDataStatusType	The status of the routing.
	 */
	objectFunctions.route = function(aRoutedData) {
		//console.log("com.developedbyme.nodejs.server.router.RouterBaseObject::route");
		//console.log(this._id);
		
		if(!this._qualifyRouting(aRoutedData)) {
			return aRoutedData.getStatus();
		}
		
		return this._performRoute(aRoutedData);
	};
	
	/**
	 * Performs the actual routing (after being qualified).
	 *
	 * @param	aRoutedData	RoutedData	The data for the request.
	 *
	 * @return	RoutedDataStatusType	The status of the routing.
	 */
	objectFunctions._performRoute = function(aRoutedData) {
		//METODO: error message
		aRoutedData.setError("Router " + this + " has not implemented the _performRoute function.");
		return RoutedDataStatusTypes.ERROR;
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		this._qualifiers = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.nodejs.server.router.RouterBaseObject::create");
		//console.log(aElement);
		
		var newRouterBaseObject = ClassReference._createAndInitClass(ClassReference);
		
		return newRouterBaseObject;
	};
});