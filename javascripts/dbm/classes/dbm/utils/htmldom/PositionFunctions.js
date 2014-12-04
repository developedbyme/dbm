/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.htmldom.PositionFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.htmldom.PositionFunctions");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var PositionFunctions = dbm.importClass("dbm.utils.htmldom.PositionFunctions");
	
	staticFunctions.getGlobalPositionForNode = (function(aElement, aReturnPoint) {
		//console.log("dbm.utils.htmldom.PositionFunctions::getGlobalPositionForNode (static)");
		var currentElement = aElement;
		aReturnPoint.x = 0;
		aReturnPoint.y = 0;
		var debugBreakCounter = 0;
		while(currentElement !== null) {
			if(debugBreakCounter++ > 1000) {
				//METODO: error message
				break;
			}
			//console.log({x: currentElement}, currentElement.offsetLeft, currentElement.offsetTop);
			aReturnPoint.x += currentElement.offsetLeft;
			aReturnPoint.y += currentElement.offsetTop;
			currentElement = currentElement.offsetParent;
		}
		
		return aReturnPoint;
	});
	
	staticFunctions.getParentPositionForNode = (function(aElement, aParentElement, aReturnPoint) {
		//console.log("dbm.utils.htmldom.PositionFunctions::getGlobalPositionForNode (static)");
		var currentElement = aElement;
		aReturnPoint.x = 0;
		aReturnPoint.y = 0;
		var debugBreakCounter = 0;
		while(currentElement !== null) {
			if(debugBreakCounter++ > 1000) {
				//METODO: error message
				break;
			}
			//console.log({x: currentElement}, currentElement.offsetLeft, currentElement.offsetTop);
			aReturnPoint.x += currentElement.offsetLeft;
			aReturnPoint.y += currentElement.offsetTop;
			currentElement = currentElement.offsetParent;
			if(aParentElement === currentElement) {
				return aReturnPoint;
			}
		}
		
		//METODO: error message
		return aReturnPoint;
	});
	
});