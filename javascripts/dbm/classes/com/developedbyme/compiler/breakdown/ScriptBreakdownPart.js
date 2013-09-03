dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownPart", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownPart");
	
	var ScriptBreakdownPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownPart::_init");
		
		this.superCall();
		
		this._type = null;
		this._parent = null;
		this._script = null;
		this._isBrokenDown = false;
		this._isNewScope = false;
		this._executesInitially = false;
		this._childBreakdowns = new Array();
		this.executesDirectly = true;
		this.declaresVariables = null;
		this._replaceablePart = null;
		
		return this;
	};
	
	objectFunctions.getType = function() {
		return this._type;
	};
	
	objectFunctions.getChildBreakdowns = function() {
		return this._childBreakdowns;
	};
	
	objectFunctions.setParent = function(aParent) {
		
		this._parent = aParent;
		if(this._parent !== null) {
			this.declaresVariables = this._parent.declaresVariables;
		}
	};
	
	objectFunctions.changeParent = function(aParent) {
		
		if(this._parent !== null) {
			this._parent._internalFunctionality_removeChildBreakdown(this);
			this._parent = null;
		}
		
		this._parent = aParent;
		
	};
	
	objectFunctions.setScript = function(aScript) {
		
		this._script = aScript;
	};
	
	objectFunctions.appendScript = function(aScript) {
		
		this._script += aScript;
	};
	
	objectFunctions.getDeeperBreakdownIfEmpty = function() {
		return this._replaceablePart;
	};
	
	objectFunctions._internalFunctionality_removeChildBreakdown = function(aChildBreakdown) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownPart::_internalFunctionality_removeChildBreakdown");
		//console.log(this, this._childBreakdowns, aChildBreakdown);
		var childIndex = ArrayFunctions.indexOfInArray(this._childBreakdowns, aChildBreakdown);
		if(childIndex > -1) {
			this._childBreakdowns.splice(childIndex, 1);
		}
		else {
			//METODO: error message
		}
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownPart::_breakdown");
		
		//MENOTE: should be overridden
		
		this._isBrokenDown = true;
	};
	
	objectFunctions._childsBrokenDown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownPart::_childsBrokenDown");
		
		//MENOTE: should be overridden
	};
	
	objectFunctions._getCommaArray = function(aText) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart::_getCommaArray");
		
		if(this._isBrokenDown) {
			return;
		}
		
		var currentPosition = 0;
		var debugCounter = 0;
		
		var returnArray = new Array();
		var lineEndArray = [","];
		
		while(true) {
			if(debugCounter++ > 10000) {
				break;
			}
			var scopeStartPosition = ScopeFunctions.getScopeStart(aText, currentPosition);
			var endLinePosition = ScopeFunctions.getScopeStart(aText, currentPosition, lineEndArray);
			
			while((endLinePosition < scopeStartPosition || scopeStartPosition === -1) && endLinePosition !== -1) {
				
				returnArray.push(endLinePosition);
				
				currentPosition = endLinePosition+1;
				
				endLinePosition = ScopeFunctions.getScopeStart(aText, currentPosition, lineEndArray);
			}
			if(endLinePosition === -1) {
				break;
			}
			var currentScopeStartType = ScopeFunctions.getTypeOfScopeStart(aText, scopeStartPosition);
			var currentEndScopeType = ScopeFunctions.getTypeOfScopeEndForScopeStart(currentScopeStartType);
			var currentScope = ScopeFunctions.getAnyScope(aText, scopeStartPosition, currentScopeStartType, currentEndScopeType)
			if(currentScope.end === -1) {
				break;
			}
			currentPosition = currentScope.end+currentEndScopeType.length;
		}
		
		return returnArray;
	};
	
	objectFunctions._getColonPosition = function(aText) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart::_getColonPosition");
		
		if(this._isBrokenDown) {
			return;
		}
		
		var currentPosition = 0;
		var debugCounter = 0;
		
		while(true) {
			if(debugCounter++ > 10000) {
				break;
			}
			var scopeStartPosition = ScopeFunctions.getScopeStart(aText, currentPosition);
			var colonPosition = ScopeFunctions.getScopeStart(aText, currentPosition, ":");
			
			if((colonPosition < scopeStartPosition || scopeStartPosition === -1) && colonPosition !== -1) {
				return colonPosition;
			}
			if(colonPosition === -1) {
				break;
			}
			var currentScopeStartType = ScopeFunctions.getTypeOfScopeStart(aText, scopeStartPosition);
			var currentEndScopeType = ScopeFunctions.getTypeOfScopeEndForScopeStart(currentScopeStartType);
			var currentScope = ScopeFunctions.getAnyScope(aText, scopeStartPosition, currentScopeStartType, currentEndScopeType)
			if(currentScope.end === -1) {
				break;
			}
			currentPosition = currentScope.end+currentEndScopeType.length;
		}
		
		return -1;
	};
	
	objectFunctions._replaceChildBreakdown = function(aCurrentPart, aNewPart) {
		var currentIndex = ArrayFunctions.indexOfInArray(this._childBreakdowns, aCurrentPart);
		if(currentIndex > -1) {
			aNewPart.changeParent(this);
			this._childBreakdowns[currentIndex] = aNewPart;
			aCurrentPart.destroy();
		}
		else {
			//METODO: error message
		}
	};
	
	objectFunctions.breakdownForInitialExecution = function() {
		if(this._isBrokenDown) {
			return;
		}
		
		this._breakdown();
		
		var currentArray = this._childBreakdowns;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			if(currentPart === null) {
				console.log(">>>>>>", this.toString(), this._script, this._childBreakdowns);
				continue;
			}
			
			if(currentPart.executesDirectly) {
				currentPart.breakdownForInitialExecution();
			}
			
			var deeperBreakdown = currentPart.getDeeperBreakdownIfEmpty();
			if(deeperBreakdown !== null) {
				
				this._replaceChildBreakdown(currentPart, deeperBreakdown);
				
			}
		}
		
		this._childsBrokenDown(); //METODO: check that everything has been executed
	};
	
	objectFunctions.fullBreakdown = function() {
		
		this._script = aScript;
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart::compile");
		//console.log(aCompileData);
		var returnString = "";
		
		var currentArray = this._childBreakdowns;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			if(currentPart.executesDirectly) {
				var newString = currentPart.compile(aCompileData);
				if(returnString.length !== 0 && newString.length !== 0 && !JavascriptLanguageFunctions.startsWithSpecifiedKeyword(newString, "else") && !JavascriptLanguageFunctions.startsWithSpecifiedKeyword(newString, "catch") && !JavascriptLanguageFunctions.startsWithSpecifiedKeyword(newString, "finally")) {
					returnString += ";";
				}
				returnString += newString;
			}
		}
		
		return returnString;
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function _internalFunctionality_ownsVariable(aName) {
		switch(aName) {
			case "_parent":
			case "_replaceablePart":
			case "_childBreakdowns":
				return false;
		}
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._parent = null;
		this._script = null;
		this._childBreakdowns = null;
		this._replaceablePart = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});