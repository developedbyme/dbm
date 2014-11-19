/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Utils for adding flow into dom elements.
 */
dbm.registerClass("com.developedbyme.utils.htmldom.DomFlowFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.htmldom.DomFlowFunctions");
	
	//Self reference
	var DomFlowFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomFlowFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	staticFunctions.setElementText = function(aElement, aText) {
		//console.log("com.developedbyme.utils.htmldom.DomFlowFunctions::setElementText");
		//console.log(aElement, aText);
		
		var textElement = dbm.singletons.dbmHtmlDomManager.getControllerForHtmlElement(aElement.firstChild);
		textElement.setPropertyInput("text", aText);
		textElement.getProperty("display").update();
	};
});