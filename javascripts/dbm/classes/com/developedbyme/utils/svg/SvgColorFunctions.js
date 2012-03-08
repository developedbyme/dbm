dbm.registerClass("com.developedbyme.utils.svg.SvgColorFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.svg.SvgColorFunctions");
	//"use strict";
	
	var SvgColorFunctions = dbm.importClass("com.developedbyme.utils.svg.SvgColorFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	staticFunctions.fillSvgGradient = function(aSvgGradient, aGradient) {
		var svgCreator = dbm.singletons.dbmHtmlDomManager.getSvgCreator(aSvgGradient.ownerDocument);
		aGradient.getProperty("order").update();
		var currentArray = aGradient.getColorStops();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentColorStop = currentArray[i];
			
			var newColorStopElement = svgCreator.createNode("stop");
			newColorStopElement.offset.baseVal = currentColorStop.getProperty("position").getValue();
			
			var color = currentColorStop.getProperty("value").getValue();
			
			newColorStopElement.style.setProperty("stop-color", color.getSvgColorStopString(), "");
			newColorStopElement.style.setProperty("stop-opacity", color.getSvgColorStopOpacityString(), "");
			
			aSvgGradient.appendChild(newColorStopElement);
		}
	};
});