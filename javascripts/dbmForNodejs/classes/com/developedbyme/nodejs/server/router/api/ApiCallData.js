/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.server.router.api.ApiCallData", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.api.ApiCallData");
	//"use strict";
	
	var ApiCallData = dbm.importClass("com.developedbyme.nodejs.server.router.api.ApiCallData");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.api.ApiCallData::_init");
		
		this.superCall();
		
		this.routingData = null;
		this._timeoutLength = -1;
		
		return this;
	};
	
	objectFunctions.setTimeoutLength = function(aTimeoutLength) {
		this._timeoutLength = aTimeoutLength;
		
		return this;
	};
	
	objectFunctions.startTimeout = function() {
		//METODO
		
		return this;
	};
	
	//METODO
	
	staticFunctions.create = function(aRoutingData) {
		//console.log("com.developedbyme.nodejs.server.router.api.ApiCallData::create");
		
		var newApiCallData = (new ClassReference()).init();
		
		newApiCallData.routingData = aRoutingData;
		
		return newApiCallData;
	};
});