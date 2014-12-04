/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.string.ProgrammingLanguageFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.string.ProgrammingLanguageFunctions");
	//"use strict";
	
	var ProgrammingLanguageFunctions = dbm.importClass("dbm.utils.native.string.ProgrammingLanguageFunctions");
	
	var ScopeFunctions = dbm.importClass("dbm.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	staticFunctions.commentStarters = ["//", "/*"];
	staticFunctions.commentReplace = ["\n", ""];
	staticFunctions.defaultSpearators = [","];
	
	staticFunctions.getUncommentedCode = function(aCode, aScopeStarts, aScopeEnds, aCommentScopeStarts, aCommentReplace) {
		
		aScopeStarts = VariableAliases.valueWithDefault(aScopeStarts, ScopeFunctions.scopeStarters);
		aScopeEnds = VariableAliases.valueWithDefault(aScopeEnds, ScopeFunctions.scopeEnders);
		aCommentScopeStarts = VariableAliases.valueWithDefault(aCommentScopeStarts, ClassReference.commentStarters);
		aCommentReplace = VariableAliases.valueWithDefault(aCommentScopeStarts, ClassReference.commentReplace);
		
		var returnText = "";
		var currentPosition = 0;
		
		var debugCounter = 0;
		while(true) {
			if(debugCounter++ > 1000) {
				//METODO: error message
				break;
			}
			
			var scopeStartPosition = ScopeFunctions.getScopeStart(aCode, currentPosition, aCommentScopeStarts);
			
			if(scopeStartPosition === -1) {
				returnText += aCode.substring(currentPosition, aCode.length);
				break;
			}
			else if(scopeStartPosition !== currentPosition) {
				returnText += aCode.substring(currentPosition, scopeStartPosition);
			}
			
			var startType = ScopeFunctions.getTypeOfScopeStart(aCode, scopeStartPosition, aScopeStarts);
			var endType = ScopeFunctions.getTypeOfScopeEndForScopeStart(startType, aScopeStarts, aScopeEnds);
			var newScope = ScopeFunctions.getScope(aCode, scopeStartPosition, startType, endType, aScopeStarts, aScopeEnds);
			
			if(newScope === null) {
				//METODO: error message
				break;
			}
			
			ClassReference._getUncommentedCodeFromScope(aCode, newScope, aCommentScopeStarts, aCommentReplace);
		}
		
		return returnText;
	};
	
	staticFunctions._getUncommentedCodeFromScope = function(aCode, aScope, aCommentScopeStarts, aCommentReplace) {
		
		var commentPosition = ArrayFunctions.indexOfInArray(aCommentScopeStarts, aScope.type);
		
		if(commentPosition !== -1) {
			return aCommentReplace[commentPosition];
		}
		
		var returnText = "";
		var currentPosition = aScope.start;
		
		var currentArray = aScope.childScopes;
		if(currentArray !== null) {
			var currentScope;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				currentScope = currentArray[i];
				returnText += aCode.substring(currentPosition, currentScope.start);
				returnText += ClassReference._getUncommentedCodeFromScope(aCode, currentScope, aCommentScopeStarts, aCommentReplace);
				currentPosition = currentScope.end;
			}
			returnText += aCode.substring(currentPosition, currentScope.end);
		}
		
		return returnText;
	};
	
	staticFunctions.getSeparatedArray = function(aText, aSeparators, aScopeStarts, aScopeEnds) {
		
		aScopeStarts = VariableAliases.valueWithDefault(aScopeStarts, ScopeFunctions.scopeStarters);
		aScopeEnds = VariableAliases.valueWithDefault(aScopeEnds, ScopeFunctions.scopeEnders);
		aSeparators = VariableAliases.valueWithDefault(aSeparators, ClassReference.defaultSpearators);
		
		var currentPosition = 0;
		var debugCounter = 0;
		var currentValue = "";
		
		var returnArray = new Array();
		
		while(true) {
			if(debugCounter++ > 10000) {
				break;
			}
			var scopeStartPosition = ScopeFunctions.getScopeStart(aText, currentPosition, aScopeStarts, aScopeEnds);
			var endLinePosition = ScopeFunctions.getScopeStart(aText, currentPosition, aSeparators);
			
			while((endLinePosition < scopeStartPosition || scopeStartPosition === -1) && endLinePosition !== -1) {
				
				currentValue += aText.substring(currentPosition, endLinePosition);
				returnArray.push(currentValue);
				currentValue = "";
				
				currentPosition = endLinePosition+1;
				
				endLinePosition = ScopeFunctions.getScopeStart(aText, currentPosition, aSeparators);
			}
			if(endLinePosition === -1) {
				break;
			}
			var currentScopeStartType = ScopeFunctions.getTypeOfScopeStart(aText, scopeStartPosition, aScopeStarts);
			var currentEndScopeType = ScopeFunctions.getTypeOfScopeEndForScopeStart(currentScopeStartType, aScopeStarts, aScopeEnds);
			var currentScope = ScopeFunctions.getAnyScope(aText, scopeStartPosition, currentScopeStartType, currentEndScopeType, aScopeStarts, aScopeEnds);
			if(currentScope.end === -1) {
				break;
			}
			var newPosition = currentScope.end+currentEndScopeType.length;
			currentValue += aText.substring(currentPosition, newPosition);
			currentPosition = newPosition;
		}
		
		currentValue += aText.substring(currentPosition, aText.length);
		returnArray.push(currentValue);
		
		return returnArray;
	};
});