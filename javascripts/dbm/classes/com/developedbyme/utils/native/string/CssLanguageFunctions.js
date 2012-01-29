dbm.registerClass("com.developedbyme.utils.native.string.CssLanguageFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.CssLanguageFunctions");
	
	var CssLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.CssLanguageFunctions");
	
	var Gradient = dbm.importClass("com.developedbyme.utils.graphics.gradient.Gradient");
	
	var ProgrammingLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.ProgrammingLanguageFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	
	staticFunctions.COLOR_REG_EXPS = [
		new RegExp("#[0-9a-fA-F]{6}"),
		new RegExp("#[0-9a-fA-F]{3}"),
		new RegExp("rgba\\("),
		new RegExp("rgb\\("),
		new RegExp("hsla\\("),
		new RegExp("hsl\\(")
	];
	
	staticFunctions.COLOR_REG_EXP_NAMES = [
		"hex",
		"shortHex",
		"rgba",
		"rgb",
		"hsla",
		"hsl"
	];
	
	staticFunctions.getColorType = function(aCssString) {
		var currentArray = ClassReference.COLOR_REG_EXPS;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(aCssString.match(currentArray[i])) {
				return ClassReference.COLOR_REG_EXP_NAMES[i];
			}
		}
		return null;
	};
	
	staticFunctions.getPercentageValue = function(aCssString, aMax) {
		
		aMax = VariableAliases.valueWithDefault(aMax, 0xFF);
		
		var percentageSignPosition = aCssString.indexOf("%");
		
		if(percentageSignPosition != -1) {
			return 0.01*parseFloat(aCssString.substring(0, percentageSignPosition));
		}
		return parseFloat(aCssString)/aMax;
	}
	
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
				//METODO: use legacy
				dataArray.shift(); //MENOTE: remove type
				dataArray.shift(); //MENOTE: remove direction start
				dataArray.shift(); //MENOTE: remove direction end
				var currentArray = dataArray;
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					this._addWebkitLegacyColorStopToGradient(currentArray[i], newGradient, i/(currentArrayLength-1));
				}
				break;
			case "linear-gradient":
			case "-dbm-linear-gradient":
			case "-khtml-linear-gradient":
			case "-moz-linear-gradient":
			case "-ms-linear-gradient":
			case "-o-linear-gradient":
			case "-webkit-linear-gradient":
				dataArray.shift(); //MENOTE: remove direction
				var currentArray = dataArray;
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					this._addColorStopToGradient(currentArray[i], newGradient, i/(currentArrayLength-1));
				}
				break;
			case "radial-gradient":
			case "-dbm-radial-gradient":
			case "-khtml-radial-gradient":
			case "-moz-radial-gradient":
			case "-ms-radial-gradient":
			case "-o-radial-gradient":
			case "-webkit-radial-gradient":
				dataArray.shift(); //MENOTE: remove direction and/or position
				var currentArray = dataArray;
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					this._addColorStopToGradient(currentArray[i], newGradient, i/(currentArrayLength-1));
				}
				break;
			default:
				//METODO: add radial gradients
				//METODO: error message
				break;
		}
		
		return newGradient;
	};
	
	staticFunctions._addColorStopToGradient = function(aCssString, aGradient, aDefaultPosition) {
		var dataArray = ProgrammingLanguageFunctions.getSeparatedArray(aCssString, [" "]);
		var position = (dataArray.length > 1) ? ClassReference.getPercentageValue(dataArray[1]) : aDefaultPosition;
		
		aGradient.createColorStopFromCssString(position, dataArray[0]);
	};
	
	staticFunctions._addWebkitLegacyColorStopToGradient = function(aCssString, aGradient, aDefaultPosition) {
		//METODO
	};
});