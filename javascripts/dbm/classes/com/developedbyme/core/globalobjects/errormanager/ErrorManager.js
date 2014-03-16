/**
 * Global manager for handling errors.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.2.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	//"use strict";
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	
	dbm.setClassAsSingleton("dbmErrorManager");
	
	/**
	 * Initializes the object.
	 *
	 * @return self
	 */
	objectFunctions._init = function _init() {
		//console.log("com.developedbyme.core.globalobjects.errormanager.ErrorManager::_init");
		
		this.superCall();
		
		this._handlers = new Array();
		this._idNumber = 0;
		
		return this;
	}; //End function _init
	
	/**
	 * Adds a handler that gets called with every message.
	 *
	 * @param	aHandler	{ErrorHandlerInterface}	The handler.
	 */
	objectFunctions.addHandler = function addHandler(aHandler) {
		//console.log("com.developedbyme.core.globalobjects.errormanager.ErrorManager::addHandler");
		this._handlers.push(aHandler);
	}; //End function addHandler
	
	/**
	 * Reports errors, warning and log messages.
	 *
	 * @param	aType			{enum: ReportTypes}			The type of report.
	 * @param	aLevel			{enum: ReportLevelTypes}	The level of severety.
	 * @param	aObject			{*}							The object that sends the report.
	 * @param	aFunctionName	{String}					The name of the function that sends the report.
	 * @param	aData			{*}							The data for the report.
	 */
	objectFunctions.report = function report(aType, aLevel, aObject, aFunctionName, aData) {
		
		var currentId = this._idNumber++;
		var currentTimeStamp = new Date().valueOf();
		
		var currentArray = this._handlers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentHandler = currentArray[i];
			currentHandler.report(currentId, currentTimeStamp, aType, aLevel, aObject, aFunctionName, aData);
		}
	}; //End function report
	
	/**
	 * Reports an error catched from a try statement.
	 *
	 * @param	aObject			{*}			The object that sends the report.
	 * @param	aFunctionName	{String}	The name of the function that sends the report.
	 * @param	aError			{Error}		The error that occured.
	 */
	objectFunctions.reportError = function reportError(aObject, aFunctionName, aError) {
		
		var currentId = this._idNumber++;
		var currentTimeStamp = new Date().valueOf();
		
		var currentArray = this._handlers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentHandler = currentArray[i];
			
			currentHandler.reportError(currentId, currentTimeStamp, aObject, aFunctionName, aError);
		}
	}; //End function reportError
});