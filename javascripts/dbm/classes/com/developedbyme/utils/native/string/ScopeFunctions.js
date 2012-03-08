dbm.registerClass("com.developedbyme.utils.native.string.ScopeFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.ScopeFunctions");
	//"use strict";
	
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions.scopeStarters = ["(", "{", "[", "\"", "\'", "//", "/*"];
	staticFunctions.scopeEnders = [")", "}", "]", "\"", "\'", "\n", "*/"];
	staticFunctions.operatorTypes = [" instanceof ", "===", "<<<=", ">>>=", "!==", "<<<", ">>>", "==", "!=", "<<=", ">>=", "&&", "||", "&=", "|=", "<<", ">>", ">=", "<=", "<", ">", ".", "%", "+", "-", "*", "/", "=", "&", "|", "^", "!", "?", ":"];
	
	staticFunctions.getScopeStart = function(aText, aFromPosition, aScopeStarts) {
		//console.log("com.developedbyme.utils.native.string.ScopeFunctions::getScopeStart");
		
		aFromPosition = VariableAliases.valueWithDefault(aFromPosition, 0);
		aScopeStarts = VariableAliases.valueWithDefault(aScopeStarts, ClassReference.scopeStarters);
		//console.log(aFromPosition, aScopeStarts);
		
		var returnPosition = -1;
		var currentArray = aScopeStarts;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentIndex = aText.indexOf(currentArray[i], aFromPosition);
			if((currentIndex != -1 && currentIndex < returnPosition) || returnPosition == -1) {
				returnPosition = currentIndex;
			}
		}
		
		return returnPosition;
	};
	
	staticFunctions.splitEvaluation = function(aText, aReturnOperators) {
		//console.log("com.developedbyme.utils.native.string.ScopeFunctions::getTypeOfScopeStart");
		
		var returnArray = new Array();
		
		var debugCounter = 0;
		var currentPosition = 0;
		
		var scopeStartPosition = ClassReference.getScopeStart(aText, currentPosition);
		var operatorPosition = ClassReference.getScopeStart(aText, currentPosition, ClassReference.operatorTypes);
		var textLength = aText.length;
		
		var whiteSpaceRegExp = new RegExp("[^\\s]");
		
		while(scopeStartPosition != -1 || operatorPosition != -1) {
			if(debugCounter++ > 10000) {
				break;
			}
			while((operatorPosition < scopeStartPosition || scopeStartPosition == -1) && operatorPosition != -1) {
				if(debugCounter++ > 10000) {
					break;
				}
				var currentOperator = ClassReference.getTypeOfScopeStart(aText, operatorPosition, ClassReference.operatorTypes);
				
				returnArray.push(operatorPosition);
				aReturnOperators.push(currentOperator);
				currentPosition = operatorPosition+currentOperator.length;
				for(var i = currentPosition; i < textLength; i++) {
					var currentChar = aText.charAt(i);
					if(currentChar.match(whiteSpaceRegExp)) {
						break;
					}
					currentPosition++;
				}
				operatorPosition = ClassReference.getScopeStart(aText, currentPosition, ClassReference.operatorTypes);
			}
			
			if(scopeStartPosition != -1) {
				var currentScopeStartType = ClassReference.getTypeOfScopeStart(aText, scopeStartPosition);
				var currentScopeEndType = ClassReference.getTypeOfScopeEndForScopeStart(currentScopeStartType);
				if(currentPosition != scopeStartPosition || aReturnOperators[aReturnOperators.length-1] == null) {
					returnArray.push(scopeStartPosition);
					aReturnOperators.push(null);
				}
				var currentScope = ClassReference.getAnyScope(aText, scopeStartPosition, currentScopeStartType, currentScopeEndType);
				if(currentScope.end == -1) {
					break;
				}
				currentPosition = currentScope.end+currentScopeEndType.length;
				
				scopeStartPosition = ClassReference.getScopeStart(aText, currentPosition);
				operatorPosition = ClassReference.getScopeStart(aText, currentPosition, ClassReference.operatorTypes);
			}
		}
		
		return returnArray;
	};
	
	staticFunctions.getTypeOfScopeStart = function(aText, aPosition, aScopeStarts) {
		//console.log("com.developedbyme.utils.native.string.ScopeFunctions::getTypeOfScopeStart");
		
		aPosition = VariableAliases.valueWithDefault(aPosition, 0);
		aScopeStarts = VariableAliases.valueWithDefault(aScopeStarts, ClassReference.scopeStarters);
		
		var currentArray = aScopeStarts;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentScopeName = currentArray[i];
			var scopeLength = currentScopeName.length;
			var isCorrect = true;
			for(var j = 0; j < scopeLength; j++) {
				if(currentScopeName.charAt(j) != aText.charAt(aPosition+j)) {
					isCorrect = false;
					break;
				}
			}
			if(isCorrect) {
				return currentScopeName;
			}
		}
		
		return null;
	};
	
	staticFunctions.getTypeOfScopeEndForScopeStart = function(aStart, aScopeStarts, aScopeEnds) {
		//console.log("com.developedbyme.utils.native.string.ScopeFunctions::getTypeOfScopeEndForScopeStart");
		
		aScopeStarts = VariableAliases.valueWithDefault(aScopeStarts, ClassReference.scopeStarters);
		aScopeEnds = VariableAliases.valueWithDefault(aScopeEnds, ClassReference.scopeEnders);
		//console.log(aStart, aScopeStarts, aScopeEnds);
		
		var currentArray = aScopeStarts;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(aStart == currentArray[i]) {
				return aScopeEnds[i];
			}
		}
		//METODO: error message
	};
	
	staticFunctions.getAnyScope = function(aText, aStartPosition, aStartType, aEndType, aScopeStarts, aScopeEnds) {
		//console.log("com.developedbyme.utils.native.string.ScopeFunctions::getAnyScope");
		
		aScopeStarts = VariableAliases.valueWithDefault(aScopeStarts, ClassReference.scopeStarters);
		aScopeEnds = VariableAliases.valueWithDefault(aScopeEnds, ClassReference.scopeEnders);
		aEndType = VariableAliases.valueWithDefault(aEndType, ClassReference.getTypeOfScopeEndForScopeStart(aStartType));
		
		var newChildScope = null;
		if(aStartType == "\"" || aStartType == "\'") {
			newChildScope = ClassReference.getTextScope(aText, aStartPosition, aStartType, aEndType);
		}
		else if(aStartType == "//" || aStartType == "/*") {
			newChildScope = ClassReference.getCommentScope(aText, aStartPosition, aStartType, aEndType);
		}
		else {
			newChildScope = ClassReference.getScope(aText, aStartPosition, aStartType, aEndType, aScopeStarts, aScopeEnds);
		}
		
		return newChildScope;
	};
	
	staticFunctions.getScope = function(aText, aStartPosition, aStartType, aEndType, aScopeStarts, aScopeEnds) {
		//console.log("com.developedbyme.utils.native.string.ScopeFunctions::getScope");
		//console.log(aStartPosition, aStartType, aEndType, aText.substring(Math.max(0, aStartPosition-4), aStartPosition+1));
		
		aScopeStarts = VariableAliases.valueWithDefault(aScopeStarts, ClassReference.scopeStarters);
		aScopeEnds = VariableAliases.valueWithDefault(aScopeEnds, ClassReference.scopeEnders);
		
		var returnScope = new Object();
		returnScope.type = aStartType;
		returnScope.start = aStartPosition;
		
		var currentIndex = aStartPosition+aStartType.length;
		var debugCounter = 0;
		while(true) {
			if(debugCounter++ > 10000) {
				console.log("break getScope");
				break;
			}
			var newScopeStart = ClassReference.getScopeStart(aText, currentIndex, aScopeStarts);
			var newScopeEnd = aText.indexOf(aEndType, currentIndex);
			if(newScopeEnd == -1) {
				returnScope.end = -1;
				break;
			}
			if(newScopeStart == -1 || newScopeEnd < newScopeStart) {
				returnScope.end = newScopeEnd;
				break;
			}
			var newScopeStartType = ClassReference.getTypeOfScopeStart(aText, newScopeStart, aScopeStarts, aScopeStarts, aScopeEnds);
			var newScopeEndType = ClassReference.getTypeOfScopeEndForScopeStart(newScopeStartType, aScopeStarts, aScopeEnds);
			
			var newChildScope = ClassReference.getAnyScope(aText, newScopeStart, newScopeStartType, newScopeEndType, aScopeStarts, aScopeEnds);
			
			if(returnScope.childScopes == undefined) {
				returnScope.childScopes = new Array();
			}
			returnScope.childScopes.push(newChildScope);
			if(newChildScope.end == -1 || newChildScope.end == aText.length) {
				returnScope.end = newScopeEnd;
				break;
			}
			currentIndex = newChildScope.end+newScopeEndType.length;
		}
		return returnScope;
	};
	
	staticFunctions.getCommentScope = function(aText, aStartPosition, aStartType, aEndType) {
		var returnScope = new Object();
		returnScope.type = aStartType;
		returnScope.start = aStartPosition;
		
		var endPosition = aText.indexOf(aEndType, aStartPosition);
		if(endPosition == -1 && aStartType == "//") {
			returnScope.end = aText.length;
		}
		else {
			returnScope.end = endPosition;
		}
		
		return returnScope;
	};
	
	staticFunctions.getTextScope = function(aText, aStartPosition, aStartType, aEndType) {
		var returnScope = new Object();
		returnScope.type = aStartType;
		returnScope.start = aStartPosition;
		
		var currentIndex = aStartPosition+aStartType.length;
		var debugCounter = 0;
		while(true) {
			if(debugCounter++ > 10000) {
				console.log("break getTextScope 1");
				break;
			}
			var endPosition = aText.indexOf(aEndType, currentIndex);
			if(endPosition == -1) {
				returnScope.end = -1;
				break;
			}
			checkPosition = endPosition-1;
			var slashCount = 0;
			while(aText.charAt(checkPosition) == "\\") {
				if(debugCounter++ > 10000) {
					console.log("break getTextScope 2");
					break;
				}
				slashCount++;
				checkPosition--;
			}
			if(slashCount%2 == 0) {
				returnScope.end = endPosition;
				break;
			}
			currentIndex = endPosition+aStartType.length;
		}
		
		return returnScope;
	};
});
