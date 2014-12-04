/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Function for creating and modifying colors.
 */
dbm.registerClass("dbm.utils.graphics.color.ColorFunctions", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.graphics.color.ColorFunctions");
	
	//Self reference
	var ColorFunctions = dbm.importClass("dbm.utils.graphics.color.ColorFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var RgbaColor = dbm.importClass("dbm.core.data.color.RgbaColor");
	var HslaColor = dbm.importClass("dbm.core.data.color.HslaColor");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var CssLanguageFunctions = dbm.importClass("dbm.utils.native.string.CssLanguageFunctions");
	var ScopeFunctions = dbm.importClass("dbm.utils.native.string.ScopeFunctions");
	var ProgrammingLanguageFunctions = dbm.importClass("dbm.utils.native.string.ProgrammingLanguageFunctions");
	
	//Constants
	var HtmlColorNames = dbm.importClass("dbm.utils.graphics.color.HtmlColorNames");
	
	/**
	 * Creates an array from the values in a css color string (eg. rgba(r, g, b, a), hsl(h, s, l)).
	 *
	 * @param	aCssString	String	The css string to get data from.
	 *
	 * @return	Array	The values inside the string.
	 */
	staticFunctions._getValueArrayFromCssFunctionString = function(aCssString) {
		var scopeStart = aCssString.indexOf("(");
		var scope = ScopeFunctions.getScope(aCssString, scopeStart, "(", ")");
		var data = aCssString.substring(scopeStart+1, scope.end);
		
		return ProgrammingLanguageFunctions.getSeparatedArray(data);
	};
	
	staticFunctions.createColorFromRgbaString = function(aRgbaString) {
		var newColor = RgbaColor.create();
		
		var dataArray = ClassReference._getValueArrayFromCssFunctionString(aRgbaString);
		newColor.r = CssLanguageFunctions.getPercentageValue(dataArray[0], 0xFF);
		newColor.g = CssLanguageFunctions.getPercentageValue(dataArray[1], 0xFF);
		newColor.b = CssLanguageFunctions.getPercentageValue(dataArray[2], 0xFF);
		newColor.a = CssLanguageFunctions.getPercentageValue(dataArray[3], 1);
		
		return newColor;
	};
	
	staticFunctions.createColorFromRgbString = function(aRgbString) {
		var newColor = RgbaColor.create();
		
		var dataArray = ClassReference._getValueArrayFromCssFunctionString(aRgbString);
		newColor.r = CssLanguageFunctions.getPercentageValue(dataArray[0], 0xFF);
		newColor.g = CssLanguageFunctions.getPercentageValue(dataArray[1], 0xFF);
		newColor.b = CssLanguageFunctions.getPercentageValue(dataArray[2], 0xFF);
		
		return newColor;
	};
	
	staticFunctions.createColorFromHexString = function(aHexString) {
		var dataString = aHexString.substring(1, 7);
		var dataValue = parseInt(dataString, 16);
		
		return ClassReference.createColorFromValue(dataValue);
	};
	
	/**
	 * Gets a color for the format #RRGGBB[AA]
	 *
	 * @param	aHexString	String	The hexadecimal color string.
	 *
	 * @return	Color	The color created from the string.
	 */
	staticFunctions.createColorFromHexWithOptionalAlphaString = function(aHexString) {
		//console.log("dbm.utils.graphics.color.ColorFunctions::createColorFromHexWithOptionalAlphaString");
		//console.log(aHexString);
		
		var dataString = aHexString.substring(1, 7);
		var dataValue = parseInt(dataString, 16);
		
		var returnColor = ClassReference.createColorFromValue(dataValue);
		if(aHexString.length === 9) {
			var alphaString = aHexString.substring(7, 9);
			returnColor.a = parseInt(alphaString, 16)/0xFF;
		}
		
		return returnColor;
	};
	
	/**
	 * Gets a color for the format #RRGGBB
	 *
	 * @param	aHexString	String	The hexadecimal color string.
	 *
	 * @return	Color	The color created from the string.
	 */
	staticFunctions.createColorFromShortHexString = function(aHexString) {
		
		var dataString = aHexString.substring(1, 4);
		var dataValue = parseInt(dataString, 16);
		
		var r = ((dataValue >> 8) & 0x0F)/0x0F;
		r &= r << 4;
		var g = ((dataValue >> 4) & 0x0F)/0x0F;
		g &= g << 4;
		var b = ((dataValue) & 0x0F)/0x0F;
		b &= b << 4;
		
		var newColor = RgbaColor.create(r, g, b);
		
		return newColor;
	};
	
	staticFunctions.createColorFromValue = function(aValue) {
		var newColor = RgbaColor.create(((aValue >> 16) & 0xFF)/0xFF, ((aValue >> 8) & 0xFF)/0xFF, ((aValue) & 0xFF)/0xFF);
		return newColor;
	};
	
	staticFunctions.createColorFromName = function(aName) {
		
		var lowerCaseName = aName.toLowerCase();
		
		if(ArrayFunctions.indexOfInArray(lowerCaseName, HtmlColorNames.namesArray) === -1) {
			//METODO: error message
			return -1;
		}
		
		return ClassReference.createColorFromValue(HtmlColorNames[lowerCaseName]);
	};
	
	staticFunctions.createColorFromHslString = function(aHslString) {
		var newColor = HslaColor.create();
		
		var dataArray = ClassReference._getValueArrayFromCssFunctionString(aHslString);
		newColor.h = CssLanguageFunctions.getPercentageValue(dataArray[0], 360);
		newColor.s = CssLanguageFunctions.getPercentageValue(dataArray[1], 100);
		newColor.l = CssLanguageFunctions.getPercentageValue(dataArray[2], 100);
		
		return newColor;
	};
	
	staticFunctions.createColorFromHslaString = function(aHslaString) {
		var newColor = HslaColor.create();
		
		var dataArray = ClassReference._getValueArrayFromCssFunctionString(aHslaString);
		newColor.h = CssLanguageFunctions.getPercentageValue(dataArray[0], 360);
		newColor.s = CssLanguageFunctions.getPercentageValue(dataArray[1], 100);
		newColor.l = CssLanguageFunctions.getPercentageValue(dataArray[2], 100);
		newColor.a = CssLanguageFunctions.getPercentageValue(dataArray[3], 1);
		
		return newColor;
	};
	
	staticFunctions.createColorFromCssString = function(aCssString) {
		var currentType = CssLanguageFunctions.getColorType(aCssString);
		switch(currentType) {
			case "hex":
				return ClassReference.createColorFromHexString(aCssString);
			case "shortHex":
				return ClassReference.createColorFromShortHexString(aCssString);
			case "rgba":
				return ClassReference.createColorFromRgbaString(aCssString);
			case "rgb":
				return ClassReference.createColorFromRgbString(aCssString);
			case "hsla":
				return ClassReference.createColorFromHslaString(aCssString);
			case "hsl":
				return ClassReference.createColorFromHslString(aCssString);
		}
		
		switch(aCssString.toLowerCase()) {
			case "transparent":
				return RgbaColor.create(0, 0, 0, 0);
			case "inherit":
			case "currentcolor":
				//MENOTE: Can't handle these at this level
				break;
			default:
				return ClassReference.createColorFromName(aCssString);
		}
		return null;
	};
});