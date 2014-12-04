/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.server.router.RoutedData", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.server.router.RoutedData");
	//"use strict";
	
	var url = require("url");
	
	//Self reference
	var RoutedData = dbm.importClass("dbm.nodejs.server.router.RoutedData");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Utils
	var UrlFunctions = dbm.importClass("dbm.utils.native.string.UrlFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var RoutedDataTypes = dbm.importClass("dbm.nodejs.constants.RoutedDataTypes");
	var RoutedDataStatusTypes = dbm.importClass("dbm.nodejs.constants.RoutedDataStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.server.router.RoutedData::_init");
		
		this.superCall();
		
		this.type = RoutedDataTypes.UNKNOWN;
		
		this._localPath = null;
		this._localPathHistory = new Array();
		
		this.requestMethod = null;
		this.requestData = this.addDestroyableObject(NamedArray.create(false));
		
		this.request = null;
		this.response = null;
		
		this.socket = null;
		this.headData = null;
		
		this._errorText = null;
		this._error = null;
		
		this._status = RoutedDataStatusTypes.UNHANDLED;
		
		return this;
	};
	
	objectFunctions.getStatus = function() {
		return this._status;
	};
	
	objectFunctions.setStatus = function(aStatus) {
		this._status = aStatus;
		
		return this;
	};
	
	objectFunctions.setAsDone = function() {
		this._status = RoutedDataStatusTypes.DONE;
		
		return this;
	};
	
	objectFunctions.setError = function(aText, aError) {
		this._status = RoutedDataStatusTypes.ERROR;
		
		this._errorText = aText;
		this._error = aError;
		
		return this;
	};
	
	objectFunctions.hasError = function() {
		return (this._status === RoutedDataStatusTypes.ERROR);
	};
	
	objectFunctions.getError = function() {
		return this._error;
	};
	
	objectFunctions.getErrorText = function() {
		return this._errorText;
	};
	
	objectFunctions.getLocalPath = function() {
		return this._localPath;
	};
	
	objectFunctions.setLocalPath = function(aPath) {
		if(this._localPath !== null) {
			this._localPathHistory.push(this._localPath);
		}
		this._localPath = aPath;
	};
	
	objectFunctions.stopUsingCurrentLocalPath = function() {
		if(this._localPathHistory.length > 0) {
			this._localPath = this._localPathHistory.pop();
		}
		else {
			this._localPath = null;
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._localPath = null;
		this._localPathHistory = null;
		
		this.requestMethod = null;
		this.requestData = null;
		
		this.request = null;
		this.response = null;
		
		this.socket = null;
		this.headData = null;
		
		this._errorText = null;
		this._error = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aType, aRequest) {
		//console.log("dbm.nodejs.server.router.RoutedData::create");
		//console.log(aElement);
		
		var newRoutedData = ClassReference._createAndInitClass(ClassReference);
		
		newRoutedData.type = aType;
		var requestMethod = aRequest.method;
		newRoutedData.requestMethod = requestMethod;
		newRoutedData.request = aRequest;
		
		var parsedData = url.parse(aRequest.url);
		var pathName = parsedData.pathname;
		newRoutedData.setLocalPath(pathName.substring(1, pathName.length));
		//METODO: authentication
		//METODO: headers
		
		if(requestMethod === "GET" && VariableAliases.isSet(parsedData.query)) {
			UrlFunctions.parseQueryString(parsedData.query, newRoutedData.requestData);
		}
		
		
		return newRoutedData;
	};
});