/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.string.CssLanguageFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.string.CssLanguageFunctions");
	//"use strict";
	
	//Self reference
	var CssLanguageFunctions = dbm.importClass("dbm.utils.native.string.CssLanguageFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var Gradient = dbm.importClass("dbm.utils.graphics.gradient.Gradient");
	
	//Utils
	var ProgrammingLanguageFunctions = dbm.importClass("dbm.utils.native.string.ProgrammingLanguageFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	var ScopeFunctions = dbm.importClass("dbm.utils.native.string.ScopeFunctions");
	var RegExpFunctions = dbm.importClass("dbm.utils.native.regexp.RegExpFunctions");
	
	//Constants
	
	
	/**
	 * Regular expressions for color formats.
	 */
	staticFunctions.COLOR_REG_EXPS = [
		new RegExp("#[0-9a-fA-F]{6}"),
		new RegExp("#[0-9a-fA-F]{3}"),
		new RegExp("rgba\\("),
		new RegExp("rgb\\("),
		new RegExp("hsla\\("),
		new RegExp("hsl\\(")
	];
	
	/**
	 * Names matching the regular expressions for color formats.
	 */
	staticFunctions.COLOR_REG_EXP_NAMES = [
		"hex",
		"shortHex",
		"rgba",
		"rgb",
		"hsla",
		"hsl"
	];
	
	/**
	 * Gets the type of format that a color is described in.
	 *
	 * @param	aCssString	String	The css color string.
	 *
	 * @return	String	The name for the format that the color is specified in.
	 */
	staticFunctions.getColorType = function(aCssString) {
		return RegExpFunctions.matchTextInRegExpArrayWithNames(aCssString, ClassReference.COLOR_REG_EXPS, ClassReference.COLOR_REG_EXP_NAMES);
	};
	
	staticFunctions.getPercentageValue = function(aCssString, aMax) {
		
		aMax = VariableAliases.valueWithDefault(aMax, 0xFF);
		
		var percentageSignPosition = aCssString.indexOf("%");
		
		if(percentageSignPosition !== -1) {
			return 0.01*parseFloat(aCssString.substring(0, percentageSignPosition));
		}
		return parseFloat(aCssString)/aMax;
	};
	
	staticFunctions.createGradientFromCss = function(aCssString) {
		
		aCssString = ProgrammingLanguageFunctions.getUncommentedCode(aCssString);
		
		var newGradient = Gradient.create();
		
		var scopeStart = aCssString.indexOf("(");
		var scope = ScopeFunctions.getScope(aCssString, scopeStart, "(", ")");
		
		var type = StringFunctions.trim(aCssString.substring(0, scopeStart)).toLowerCase();
		var data = StringFunctions.trim(aCssString.substring(scopeStart+1, scope.end));
		var dataArray = ProgrammingLanguageFunctions.getSeparatedArray(data);
		ArrayFunctions.trim(dataArray);
		
		switch(type) {
			case "-webkit-gradient":
				//METODO: error message, legacy description not supported
				break;
			case "linear-gradient":
			case "-dbm-linear-gradient":
			case "-khtml-linear-gradient":
			case "-moz-linear-gradient":
			case "-ms-linear-gradient":
			case "-o-linear-gradient":
			case "-webkit-linear-gradient":
			case "radial-gradient":
			case "-dbm-radial-gradient":
			case "-khtml-radial-gradient":
			case "-moz-radial-gradient":
			case "-ms-radial-gradient":
			case "-o-radial-gradient":
			case "-webkit-radial-gradient":
				//MENOTE: remove direction and or direction
				ClassReference._addColorStopsToGradient(dataArray, newGradient, 1, dataArray.length);
				break;
			default:
				//METODO: error message
				break;
		}
		
		return newGradient;
	};
	
	staticFunctions._addColorStopsToGradient = function(aCssStrings, aGradient, aStartPosition, aEndPosition) {
		//console.log("dbm.utils.native.string.CssLanguageFunctions::_addColorStopsToGradient");
		//console.log(aCssStrings, aGradient, aStartPosition, aEndPosition);
		
		var currentArray = aCssStrings;
		for(var i = aStartPosition; i < aEndPosition; i++) {
			this._addColorStopToGradient(currentArray[i], aGradient, (i-aStartPosition)/(aEndPosition-1));
		}
	};
	
	staticFunctions._addColorStopToGradient = function(aCssString, aGradient, aDefaultPosition) {
		//console.log("dbm.utils.native.string.CssLanguageFunctions::_addColorStopToGradient");
		//console.log(aCssString, aGradient, aDefaultPosition);
		
		var dataArray = ProgrammingLanguageFunctions.getSeparatedArray(aCssString, [" "]);
		var position = (dataArray.length > 1) ? ClassReference.getPercentageValue(dataArray[1]) : aDefaultPosition;
		
		aGradient.createColorStopFromCssString(position, dataArray[0]);
	};
});