/**
 * Error handler that stores reports to be used with flow
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.core.globalobjects.errormanager.handlers.FlowHandler", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.errormanager.handlers.FlowHandler");
	//"use strict";
	
	var FlowHandler = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.handlers.FlowHandler");
	
	var ReportData = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.data.ReportData");
	
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	/**
	 * Initializes the object.
	 *
	 * @return self
	 */
	objectFunctions._init = function _init() {
		//console.log("com.developedbyme.core.globalobjects.errormanager.handlers.FlowHandler::_init");
		
		this.superCall();
		
		this._numberOfErrors = this.createProperty("numberOfErrors", 0);
		this._numberOfWarnings = this.createProperty("numberOfWarnings", 0);
		this._numberOfLogs = this.createProperty("numberOfLogs", 0);
		
		this._reports = this.createProperty("reports", new Array());
		
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
				this._numberOfErrors.setValue(this._numberOfErrors.getValue()+1);
				break;
			case ReportTypes.WARNING:
				this._numberOfWarnings.setValue(this._numberOfWarnings.getValue()+1);
				break;
			case ReportTypes.LOG:
				this._numberOfLogs.setValue(this._numberOfLogs.getValue()+1);
				break;
			default:
				//MENOTE: unknow counts as log
				this._numberOfLogs.setValue(this._numberOfLogs.getValue()+1);
				break;
		}
		
		var reportsArray = this._reports.getValue();
		reportsArray.push(ReportData.create(aId, aTimeStamp, aType, aLevel, aObject.toString(), aFunctionName, aData));
		this._reports.setAsDirty();
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
		//console.log("com.developedbyme.core.globalobjects.errormanager.handlers.FlowHandler::reportError");
		
		this._numberOfErrors.setValue(this._numberOfErrors.getValue()+1);
		
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
		
		var reportsArray = this._reports.getValue();
		reportsArray.push(ReportData.create(aId, aTimeStamp, ReportTypes.ERROR, ReportLevelTypes.UNKNOWN, aObject.toString(), aFunctionName, aError.toString() + " " + errorString));
		this._reports.setAsDirty();
	}; //End function reportError
	
	staticFunctions.create = function create() {
		var newFlowHandler = (new FlowHandler()).init();
		return newFlowHandler;
	};
});