/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.css.CssReferenceFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.css.CssReferenceFunctions");
	
	var CssReferenceFunctions = dbm.importClass("dbm.utils.css.CssReferenceFunctions");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	var CssRuleTypes = dbm.importClass("dbm.constants.CssRuleTypes");
	
	staticFunctions.getRulesByType = function(aType, aRulesArray, aReturnArray) {
		//console.log("dbm.utils.css.CssReferenceFunctions::getRulesByType");
		
		var currentArray = aRulesArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentRule = currentArray[i];
			if(currentRule.type === aType) {
				aReturnArray.push(currentRule);
			}
			
			if(currentRule.type === CssRuleTypes.MEDIA_RULE) {
				ClassReference.getRulesByType(aType, currentRule.cssRules, aReturnArray);
			}
			else if(currentRule.type === CssRuleTypes.IMPORT_RULE) {
				ClassReference.getRulesByType(aType, currentRule.styleSheet.cssRules, aReturnArray);
			}
		}
	};
	
	staticFunctions.getRulesOnStyleSheet = function(aStyleSheet, aReturnArray) {
		//console.log("dbm.utils.css.CssReferenceFunctions::getRulesOnStyleSheet");
		
		var currentArray = aStyleSheet.cssRules;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			aReturnArray.push(currentArray[i]);
		}
	};
	
	staticFunctions.getStyleDeclarationsBySelectorOnDocument = function(aSelector, aDocument) {
		
		aDocument = VariableAliases.valueWithDefault(aDocument, document);
		
		var normalizedSelector = ClassReference.normalizeSelector(aSelector);
		
		var returnArray = new Array();
		
		var currentArray = aDocument.styleSheets;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentStyleSheet = currentArray[i];
			ClassReference.getStyleDeclarationsBySelector(normalizedSelector, currentStyleSheet.rules, returnArray);
		}
		
		return returnArray;
	};
	
	staticFunctions.getStyleDeclarationsBySelector = function(aNormalizedSelector, aRulesArray, aReturnArray) {
		var currentArray = aRulesArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentRule = currentArray[i];
			if(currentRule.type === CssRuleTypes.STYLE_RULE) {
				var currentArray2 = StringFunctions.splitSeparatedString(currentRule.selectorText);
				var currentArray2Length = currentArray2.length;
				for(var j = 0; j < currentArray2Length; j++) {
					var currentSelector = ClassReference.normalizeSelector(currentArray2[j]);
					//console.log(currentSelector, aNormalizedSelector);
					if(currentSelector === aNormalizedSelector) {
						aReturnArray.push(currentRule.style);
					}
				}
			}
			else if(currentRule.type === CssRuleTypes.MEDIA_RULE) {
				ClassReference.getStyleDeclarationsBySelector(aNormalizedSelector, currentRule.cssRules, aReturnArray);
			}
			else if(currentRule.type === CssRuleTypes.IMPORT_RULE) {
				ClassReference.getStyleDeclarationsBySelector(aNormalizedSelector, currentRule.styleSheet.rules, aReturnArray);
			}
		}
	};
	
	staticFunctions.getStyleSheetByPathOnDocument = function(aPath, aDocument) {
		
		aDocument = VariableAliases.valueWithDefault(aDocument, document);
		
		var absolutePath = dbm.singletons.dbmPageManager.getUrlResolver().getAbsolutePath(aPath);
		
		//console.log(absolutePath);
		
		var currentArray = aDocument.styleSheets;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentStyleSheet = currentArray[i];
			if(currentStyleSheet.href === absolutePath) {
				return currentStyleSheet;
			}
		}
		
		//METODO: error message
		return null;
	};
	
	staticFunctions.normalizeSelector = function(aSelector) {
		//console.log("normalizeSelector");
		//console.log(aSelector);
		
		aSelector = StringFunctions.trim(aSelector);
		
		var returnString = "";
		var selectorLength = aSelector.length;
		var currentPosition = 0;
		var debugCounter = 0;
		while(true) {
			if(debugCounter++ > 20) {
				//METODO: error message
				break;
			}
			var nextSpace = aSelector.indexOf(" ", currentPosition);
			if(nextSpace === -1) {
				returnString += aSelector.substring(currentPosition, aSelector.length);
				break;
			}
			returnString += aSelector.substring(currentPosition, nextSpace);
			
			var lastChar = aSelector.charCodeAt(nextSpace-1);
			for(var i = nextSpace+1; i < selectorLength; i++) {
				var currentChar = aSelector.charCodeAt(i);
				if(!(currentChar === 0x20 || currentChar === 0x09 || currentChar === 0x0A || currentChar === 0x0D || currentChar === 0x0C)) {
					currentPosition = i;
					break;
				}
			}
			var newChar = aSelector.charCodeAt(currentPosition);
			if(((lastChar >= 97 && lastChar <= 122) || (lastChar >= 48 && lastChar <= 57) || (lastChar >= 65 && lastChar <= 90) || (lastChar === 42) || (lastChar === 46)) && ((newChar >= 97 && newChar <= 122) || (newChar >= 48 && newChar <= 57) || (newChar >= 65 && newChar <= 90) || (newChar === 42) || (newChar === 46))) {
				returnString += " ";
			}
		}
		
		return returnString;
	};
});