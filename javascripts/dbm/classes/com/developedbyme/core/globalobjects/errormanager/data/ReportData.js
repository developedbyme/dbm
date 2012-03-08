/**
 * Data for one report.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.core.globalobjects.errormanager.data.ReportData", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.errormanager.data.ReportData");
	//"use strict";
	
	var ReportData = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.data.ReportData");
	
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	
	/**
	 * Initializes the object
	 *
	 * @return	self
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.errormanager.data.ReportData::_init");
		
		this.superCall();
		
		this.id = -1;
		this.timeStamp = -1;
		this.type = ReportTypes.UNKNOWN;
		this.level = -1;
		this.object = null;
		this.functionName = null;
		this.data = null;
		
		Object.seal(this);
		
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
		
		Object.freezeObject(this);
		
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
	objectFunctions.create = function create(aId, aTimeStamp, aType, aLevel, aObject, aFunctionName, aData) {
		var newReportData = (new ReportData()).init();
		newReportData.setup(aId, aTimeStamp, aType, aLevel, aObject, aFunctionName, aData);
		return newReportData;
	}; //End function create
});