dbm.registerClass("com.developedbyme.utils.htmldom.PositionFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.htmldom.PositionFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var PositionFunctions = dbm.importClass("com.developedbyme.utils.htmldom.PositionFunctions");
	
	staticFunctions.getGlobalPositionForNode = (function(aElement, aReturnPoint) {
		//console.log("com.developedbyme.utils.htmldom.PositionFunctions::getGlobalPositionForNode (static)");
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
		//console.log("com.developedbyme.utils.htmldom.PositionFunctions::getGlobalPositionForNode (static)");
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