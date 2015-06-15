/**
 * Error handler that prints reports in the console.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.2.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.errormanager.handlers.PrintInConsoleHandler", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.errormanager.handlers.PrintInConsoleHandler");
	//"use strict";
	
	var PrintInConsoleHandler = dbm.importClass("dbm.core.globalobjects.errormanager.handlers.PrintInConsoleHandler");
	
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	
	/**
	 * Initializes the object.
	 *
	 * @return self
	 */
	objectFunctions._init = function _init() {
		//console.log("dbm.core.globalobjects.errormanager.handlers.PrintInConsoleHandler::_init");
		
		this.superCall();
		
		return this;
	}; //End function _init
	
	/**
	 * Reports errors, warning and log messages.
	 *
	 * @param	aId				{Uint}						The id for the call.
	 * @param	aTimeStamp		{Uint}						The time stamp for the report.
	 * @param	aType			{enum: ReportTypes}			The type of report.
	 * @param	aLevel			{enum: ReportLevelTypes}	The level of severety.
	 * @param	aObject			{*}							The object that sends the report.
	 * @param	aFunctionName	{String}					The name of the function that sends the report.
	 * @param	aData			{*}							The data for the report.
	 */
	objectFunctions.report = function report(aId, aTimeStamp, aType, aLevel, aObject, aFunctionName, aData) {
		switch(aType) {
			case ReportTypes.ERROR:
				console.error(aObject, aFunctionName+":", aData);
				break;
			case ReportTypes.WARNING:
				console.warn(aObject, aFunctionName+":", aData);
				break;
			case ReportTypes.LOG:
				console.log(aObject, aFunctionName+":", aData);
				break;
			default:
				console.log(aType, aObject, aFunctionName+":", aData);
				break;
		}
	}; //End function report
	
	/**
	 * Reports an error catched from a try statement.
	 *
	 * @param	aId				{Uint}		The id for the call.
	 * @param	aTimeStamp		{Uint}		The time stamp for the report.
	 * @param	aObject			{*}			The object that sends the report.
	 * @param	aFunctionName	{String}	The name of the function that sends the report.
	 * @param	aError			{Error}		The error that occured.
	 */
	objectFunctions.reportError = function reportError(aId, aTimeStamp, aObject, aFunctionName, aError) {
		//console.log("dbm.core.globalobjects.errormanager.handlers.PrintInConsoleHandler::reportError");
		var errorProperties = new Array();
		if(aError.fileName) {
			errorProperties.push("fileName: " + aError.fileName);
		}
		if(aError.sourceURL) {
			errorProperties.push("sourceURL: " + aError.sourceURL);
		}
		if(aError.lineNumber) {
			errorProperties.push("lineNumber: " + aError.lineNumber);
		}
		if(aError.line) {
			errorProperties.push("lineNumber: " + aError.line);
		}
		if(aError.stack) {
			errorProperties.push("stack: " + aError.stack);
		}
		
		var errorString = aError.message +" (" + errorProperties.join(", ") + ")";
		
		console.error(aObject, aFunctionName+":", aError, errorString);
	}; //End function reportError
});