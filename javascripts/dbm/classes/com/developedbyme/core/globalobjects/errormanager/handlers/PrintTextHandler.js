/**
 * Error handler that prints reports in a html element.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.2.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.errormanager.handlers.PrintTextHandler", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.errormanager.handlers.PrintTextHandler");
	//"use strict";
	
	var PrintTextHandler = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.handlers.PrintTextHandler");
	
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	/**
	 * Initializes the object.
	 *
	 * @return self
	 */
	objectFunctions._init = function _init() {
		//console.log("com.developedbyme.core.globalobjects.errormanager.handlers.PrintTextHandler::_init");
		
		this.superCall();
		
		this.htmlElement = null;
		
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
		var className;
		switch(aType) {
			case ReportTypes.ERROR:
				className = "dbmReportErrorField";
				break;
			case ReportTypes.WARNING:
				className = "dbmReportWarningField";
				break;
			case ReportTypes.LOG:
				className = "dbmReportLogField";
				break;
			default:
				className = "dbmReportUnknownField";
				break;
		}
		
		var htmlString = "<div class=\"dbmReportField " + className + "\"><span class=\"dbmReportType\">" + aType + "</span><span class=\"dbmReportLevel\">" + aLevel + "</span><span class=\"dbmReportObject\">" + aObject + "</span><span class=\"dbmReportFunction\">" + aFunctionName + "</span><span class=\"dbmReportData\">" + aData + "</span></div>";
		this.htmlElement.innerHTML += htmlString;
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
		var htmlString = "<div class=\"dbmReportField dbmReportErrorField\"><span class=\"dbmReportType\">error</span><span class=\"dbmReportObject\">" + aObject + "</span><span class=\"dbmReportFunction\">" + aFunctionName + "</span><span class=\"dbmReportError\">" + aError + "</span></div>";
		this.htmlElement.innerHTML += htmlString;
	}; //End function reportError
	
	/**
	 * Creates a new PrintTextHandler
	 *
	 * @param	aHtmlElement {HTMLElement}	The element to print the data to.
	 *
	 * @return	{PrintTextHandler}	The new PrintTextHandler.
	 */
	staticFunctions.create = function create(aHtmlElement) {
		var newHandler = (new ClassReference()).init();
		newHandler.htmlElement = aHtmlElement;
		return newHandler;
	}; //End function create
	
	/**
	 * Creates a new PrintTextHandler with a new element that is appended to the paren.
	 *
	 * @param	aParentOrDocument {HTMLElement|HTMLDocument}	Parent element or document to use as parent for the newly created div.
	 *
	 * @return	{PrintTextHandler}	The new PrintTextHandler.
	 */
	staticFunctions.createWithDiv = function createWithDiv(aParentOrDocument) {
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		var newDiv = htmlCreator.createNode("div", {"class": "dbmReport"});
		theParent.appendChild(newDiv);
		
		var newHandler = ClassReference.create(newDiv);
		return newHandler;
	}; //End function createWithDiv
});