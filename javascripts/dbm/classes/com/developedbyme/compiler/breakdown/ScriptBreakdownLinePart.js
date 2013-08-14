dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ScriptBreakdownConditionPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownConditionPart");
	var ScriptBreakdownVarPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownVarPart");
	var ScriptBreakdownEvaluationPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownEvaluationPart");
	var ScriptBreakdownFunctionPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownFunctionPart");
	var ScriptBreakdownStringPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownStringPart");
	var ScriptBreakdownCommentPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCommentPart");
	var ScriptBreakdownForPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownForPart");
	var ScriptBreakdownReturnPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownReturnPart");
	var ScriptBreakdownDeletePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownDeletePart");
	var ScriptBreakdownWhilePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownWhilePart");
	var ScriptBreakdownLiteralObjectPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralObjectPart");
	var ScriptBreakdownLiteralArrayPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart");
	var ScriptBreakdownSwitchPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownSwitchPart");
	var ScriptBreakdownCasePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCasePart");
	var ScriptBreakdownDefaultPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownDefaultPart");
	var ScriptBreakdownKeywordPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownKeywordPart");
	var ScriptBreakdownTryPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownTryPart");
	var ScriptBreakdownFinallyPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownFinallyPart");
	var ScriptBreakdownCatchPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCatchPart");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart::_init");
		
		this.superCall();
		
		this._type = "line";
		this._debugCompileString = "";
		this._scopeStart = "";
		this._scopeEnd = "";
		
		return this;
	};
	
	objectFunctions.setScope = function(aStart, aEnd) {
		this._scopeStart = aStart;
		this._scopeEnd = aEnd;
	};
	
	objectFunctions.getDeeperBreakdownIfEmpty = function() {
		if(this._scopeStart == "" && this._scopeEnd == "" && this._childBreakdowns.length == 1) {
			return this._childBreakdowns[0];
		}
		return this.superCall();
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart::_breakdown");
		//console.log(this._script.substring(0, 30));
		
		var scriptWithoutScoop = this._script;
		
		var scopeStart = ScopeFunctions.getScopeStart(this._script, 0);
		if(scopeStart == 0) {
			var currentScopeStartType = ScopeFunctions.getTypeOfScopeStart(this._script, scopeStart);
			var currentScopeEndType = ScopeFunctions.getTypeOfScopeEndForScopeStart(currentScopeStartType);
			var scope = ScopeFunctions.getAnyScope(this._script, scopeStart, currentScopeStartType, currentScopeEndType);
			if(scope.end == this._script.length-currentScopeEndType.length) {
				switch(currentScopeStartType) {
					case "\"":
					case "\'":
						this._childBreakdowns.push(ScriptBreakdownStringPart.create(this, scriptWithoutScoop.substring(1, scriptWithoutScoop.length-1), currentScopeStartType));
						return;
					case "(":
						this.setScope(currentScopeStartType, currentScopeEndType);
						scriptWithoutScoop = StringFunctions.trim(scriptWithoutScoop.substring(1, scriptWithoutScoop.length-1));
						break;
					case "[":
						this._childBreakdowns.push(ScriptBreakdownLiteralArrayPart.create(this, scriptWithoutScoop.substring(1, scriptWithoutScoop.length-1)));
						return;
					case "{":
						this._childBreakdowns.push(ScriptBreakdownLiteralObjectPart.create(this, scriptWithoutScoop.substring(1, scriptWithoutScoop.length-1)));
						return;
					case "//":
					case "/*":
						this._childBreakdowns.push(ScriptBreakdownCommentPart.create(this, scriptWithoutScoop));
						return;
				}
			}
		}
		
		var keywordType = JavascriptLanguageFunctions.startsWithKeyword(scriptWithoutScoop);
		if(keywordType != null) {
			switch(keywordType) {
				case "if":
				case "else if":
				case "else":
					this._childBreakdowns.push(ScriptBreakdownConditionPart.create(this, keywordType, scriptWithoutScoop));
					break;
				case "do":
				case "while":
					this._childBreakdowns.push(ScriptBreakdownWhilePart.create(this, keywordType, this._script));
					break;
				case "for":
					this._childBreakdowns.push(ScriptBreakdownForPart.create(this, this._script));
					break;
				case "var":
				case "const":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScoop.substring(keywordType.length, scriptWithoutScoop.length));
					var currentArray = this._getCommaArray(stringWithoutKeyword);
					var currentArrayLength = currentArray.length;
					var currentPosition = 0;
					for(var i = 0; i < currentArrayLength; i++) {
						this._childBreakdowns.push(ScriptBreakdownVarPart.create(this, StringFunctions.trim(stringWithoutKeyword.substring(currentPosition, currentArray[i]))));
						currentPosition = currentArray[i]+1;
					}
					this._childBreakdowns.push(ScriptBreakdownVarPart.create(this, StringFunctions.trim(stringWithoutKeyword.substring(currentPosition, stringWithoutKeyword.length))));
					break;
				case "function":
					this._childBreakdowns.push(ScriptBreakdownFunctionPart.create(this, scriptWithoutScoop));
					break;
				case "switch":
					this._childBreakdowns.push(ScriptBreakdownSwitchPart.create(this, scriptWithoutScoop));
					break;
				case "case":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScoop.substring(4, scriptWithoutScoop.length));
					this._childBreakdowns.push(ScriptBreakdownCasePart.create(this, stringWithoutKeyword));
					break;
				case "default":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScoop.substring(7, scriptWithoutScoop.length));
					this._childBreakdowns.push(ScriptBreakdownDefaultPart.create(this, stringWithoutKeyword));
					break;
				case "return":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScoop.substring(6, scriptWithoutScoop.length));
					this._childBreakdowns.push(ScriptBreakdownReturnPart.create(this, stringWithoutKeyword));
					break;
				case "delete":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScoop.substring(6, scriptWithoutScoop.length));
					this._childBreakdowns.push(ScriptBreakdownDeletePart.create(this, stringWithoutKeyword));
					break;
				case "continue":
				case "break":
					this._childBreakdowns.push(ScriptBreakdownKeywordPart.create(this, scriptWithoutScoop));
					break;
				case "try":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScoop.substring(keywordType.length, scriptWithoutScoop.length));
					this._childBreakdowns.push(ScriptBreakdownTryPart.create(this, stringWithoutKeyword));
					break;
				case "finally":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScoop.substring(keywordType.length, scriptWithoutScoop.length));
					this._childBreakdowns.push(ScriptBreakdownFinallyPart.create(this, stringWithoutKeyword));
					break;
				case "catch":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScoop.substring(keywordType.length, scriptWithoutScoop.length));
					this._childBreakdowns.push(ScriptBreakdownCatchPart.create(this, stringWithoutKeyword));
					break;
				default:
				case "new": //MENOTE: new is broken down in evaluation
					this._childBreakdowns.push(ScriptBreakdownEvaluationPart.create(this, scriptWithoutScoop));
					//this._debugCompileString = this._script;
					break;
			}
		}
		else {
			this._childBreakdowns.push(ScriptBreakdownEvaluationPart.create(this, scriptWithoutScoop));
			//this._debugCompileString = this._script;
		}
	}
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart::compile");
		//console.log(this);
		//console.log(aCompileData);
		var returnString = this._debugCompileString + this._scopeStart;
		
		var currentArray = this._childBreakdowns;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			if(currentPart.executesDirectly) {
				returnString += currentPart.compile(aCompileData);
			}
		}
		
		returnString += this._scopeEnd;
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});