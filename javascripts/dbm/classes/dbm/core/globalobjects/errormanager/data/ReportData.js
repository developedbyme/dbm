/**
 * Data for one report.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.errormanager.data.ReportData", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.errormanager.data.ReportData");
	//"use strict";
	
	var ReportData = dbm.importClass("dbm.core.globalobjects.errormanager.data.ReportData");
	
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	
	/**
	 * Initializes the object
	 *
	 * @return	self
	 */
	objectFunctions.init = function() {
		//console.log("dbm.core.globalobjects.errormanager.data.ReportData::_init");
		
		this.id = -1;
		this.timeStamp = -1;
		this.type = ReportTypes.UNKNOWN;
		this.level = -1;
		this.object = null;
		this.functionName = null;
		this.data = null;
		
		//MENOTE: sealing the object gets much lower perfomance
		//if(Object.seal !== undefined) {
		//	Object.seal(this);
		//}
		
		return this;
	}; //End function init
	
	/**
	 * Sets up the object with all the data.
	 *
	 * @param	aId				{Uint}					The id for the call.
	 * @param	aTimeStamp		{Uint}					The time stamp for the report.
	 * @param	aType			{enum: ReportTypes}		The type of report.
	 * @param	aLevel			{enum: ReportLevelTypes}	The level of severety.
	 * @param	aObject			{*}						The object that sends the report.
	 * @param	aFunctionName	{String}				The name of the function that sends the report.
	 * @param	aData			{*}						The data for the report.
	 *
	 * @return	self
	 */
	objectFunctions.setup = function setup(aId, aTimeStamp, aType, aLevel, aObject, aFunctionName, aData) {
		this.id = aId;
		this.timeStamp = aTimeStamp;
		this.type = aType;
		this.level = aLevel;
		this.object = aObject;
		this.functionName = aFunctionName;
		this.data = aData;
		
		//MENOTE: sealing the object gets much lower perfomance
		//if(Object.freeze !== undefined) {
		//	Object.freeze(this);
		//}
		
		return this;
	}; //End function setup
	
	/**
	 * Creates a new report data.
	 *
	 * @param	aId				{Uint}						The id for the call.
	 * @param	aTimeStamp		{Uint}						The time stamp for the report.
	 * @param	aType			{enum: ReportTypes}			The type of report.
	 * @param	aLevel			{enum: ReportLevelTypes}	The level of severety.
	 * @param	aObject			{*}							The object that sends the report.
	 * @param	aFunctionName	{String}					The name of the function that sends the report.
	 * @param	aData			{*}							The data for the report.
	 *
	 * @return	{ReportData}	The new report data.
	 */
	staticFunctions.create = function create(aId, aTimeStamp, aType, aLevel, aObject, aFunctionName, aData) {
		var newReportData = (new ReportData()).init();
		newReportData.setup(aId, aTimeStamp, aType, aLevel, aObject, aFunctionName, aData);
		return newReportData;
	}; //End function create (static)
});