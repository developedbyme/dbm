dbm.registerClass("com.developedbyme.nodejs.server.router.RoutedData", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.RoutedData");
	//"use strict";
	
	var RoutedData = dbm.importClass("com.developedbyme.nodejs.server.router.RoutedData");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var RoutedDataTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataTypes");
	var RoutedDataStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.RoutedData::_init");
		
		this.superCall();
		
		this.type = RoutedDataTypes.UNKNOWN;
		
		this.request = null;
		this.response = null;
		
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
	
	staticFunctions.create = function(aType, aRequest) {
		//console.log("com.developedbyme.nodejs.server.router.RoutedData::create");
		//console.log(aElement);
		
		var newRoutedData = (new ClassReference()).init();
		
		newRoutedData.type = aType;
		newRoutedData.request = aRequest;
		
		return newRoutedData;
	};
});