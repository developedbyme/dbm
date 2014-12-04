/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Utils for adding flow into dom elements.
 */
dbm.registerClass("dbm.utils.htmldom.DomFlowFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.htmldom.DomFlowFunctions");
	
	//Self reference
	var DomFlowFunctions = dbm.importClass("dbm.utils.htmldom.DomFlowFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	staticFunctions.setElementText = function(aElement, aText) {
		//console.log("dbm.utils.htmldom.DomFlowFunctions::setElementText");
		//console.log(aElement, aText);
		
		var textElement = dbm.singletons.dbmHtmlDomManager.getControllerForHtmlElement(aElement.firstChild);
		textElement.setPropertyInput("text", aText);
		textElement.getProperty("display").update();
	};
});