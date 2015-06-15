/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.svg.SvgColorFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.svg.SvgColorFunctions");
	//"use strict";
	
	var SvgColorFunctions = dbm.importClass("dbm.utils.svg.SvgColorFunctions");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
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