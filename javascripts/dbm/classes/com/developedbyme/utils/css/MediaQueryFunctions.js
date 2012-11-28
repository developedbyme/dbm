dbm.registerClass("com.developedbyme.utils.css.MediaQueryFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.css.MediaQueryFunctions");
	//"use strict";
	
	var MediaQueryFunctions = dbm.importClass("com.developedbyme.utils.css.MediaQueryFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CssReferenceFunctions = dbm.importClass("com.developedbyme.utils.css.CssReferenceFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	var CssRuleTypes = dbm.importClass("com.developedbyme.constants.CssRuleTypes");
	var MediaTypes = dbm.importClass("com.developedbyme.constants.css.MediaTypes");
	
	staticFunctions.getCombinedSelectionCriteriaForMediaRule = function(aRule) {
		//console.log("com.developedbyme.utils.css.MediaQueryFunctions::getCombinedSelectionCriteriaForMediaRule");
		//console.log(aRule);
		
		var currentArray = aRule.media;
		
		if(currentArray != null && currentArray.length > 0) {
			//MENOTE: MediaList doesn't have any join function
			var currentArrayLength = currentArray.length;
			var returnString = currentArray[0];
			for(var i = 1; i < currentArrayLength; i++) { //MENOTE: First value is added without ", " before loop
				returnString += ", " + currentArray[i];
			}
			return returnString;
		}
		else {
			return MediaTypes.ALL;
		}
	};
	
	staticFunctions.getFullSelectionCriteriaForMediaRule = function(aRule, aReturnArray) {
		//console.log("com.developedbyme.utils.css.MediaQueryFunctions::getFullSelectionCriteriaForMediaRule");
		//console.log(aRule);
		
		var parentArray = new Array();
		if(aRule.parentRule) {
			ClassReference.getFullSelectionCriteriaForMediaRule(aRule.parentRule, parentArray);
		}
		else if(aRule.ownerRule) {
			//MENOTE: for import nodes
			ClassReference.getFullSelectionCriteriaForMediaRule(aRule.ownerRule, parentArray);
		}
		else if(aRule.parentStyleSheet) {
			ClassReference.getFullSelectionCriteriaForMediaRule(aRule.parentStyleSheet, parentArray);
		}
		
		var parentArrayLength = parentArray.length;
		
		
		var currentArray = aRule.media;
		if(currentArray != null && currentArray.length > 0) {
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentSelection = currentArray[i];
				if(parentArrayLength == 0) {
					aReturnArray.push(currentSelection);
				}
				else {
					var isAfter = (currentSelection.charAt(0) == "(");
					
					for(var j = 0; j < parentArrayLength; j++) {
						if(isAfter) {
							aReturnArray.push(parentArray[j] + " and " + currentSelection);
						}
						else {
							aReturnArray.push(currentSelection + " and " + parentArray[j]);
						}
					}
				}
			}
		}
		else {
			for(var i = 0; i < parentArrayLength; i++) {
				aReturnArray.push(parentArray[i]);
			}
		}
	};
	
	staticFunctions.getAllMediaRulesOnDocument = function(aDocument) {
		//console.log("com.developedbyme.utils.css.MediaQueryFunctions::getAllMediaRulesOnDocument");
		
		aDocument = VariableAliases.valueWithDefault(aDocument, document);
		
		var returnArray = new Array();
		var rulesArray = new Array();
		
		var currentArray = aDocument.styleSheets;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentStyleSheet = currentArray[i];
			//console.log(currentStyleSheet);
			CssReferenceFunctions.getRulesOnStyleSheet(currentStyleSheet, rulesArray);
		}
		
		CssReferenceFunctions.getRulesByType(CssRuleTypes.MEDIA_RULE, rulesArray, returnArray);
		
		return returnArray;
	};
	
	staticFunctions.getFullSelectionCriteriaForMediaRulesOnDocument = function(aDocument) {
		//console.log("com.developedbyme.utils.css.MediaQueryFunctions::getFullSelectionCriteriaForMediaRulesOnDocument");
		
		var returnArray = new Array();
		
		var currentArray = ClassReference.getAllMediaRulesOnDocument(aDocument);
		//console.log(currentArray);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			ClassReference.getFullSelectionCriteriaForMediaRule(currentArray[i], returnArray);
		}
		
		return returnArray;
	};
	
	/**
	 * Checks if a media query matches on a window.
	 */
	staticFunctions.mediaQueryIsActive = function(aQuery, aWindow) {
		
		aWindow = VariableAliases.valueWithDefault(aWindow, window);
		
		var mediaResult = aWindow.matchMedia(aQuery);
		
		if(mediaResult.media == "invalid") {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[MediaQueryFunctions]", "mediaQueryIsActive", "Query \"" + aQuery + "\" is invalid.");
		}
		
		return mediaResult.matches;
	}; //End function mediaQueryIsActive (static)
});