/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownLinePart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownLinePart");
	
	//Self reference
	var ScriptBreakdownLinePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownLinePart");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ScriptBreakdownConditionPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownConditionPart");
	var ScriptBreakdownVarPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownVarPart");
	var ScriptBreakdownEvaluationPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownEvaluationPart");
	var ScriptBreakdownFunctionPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownFunctionPart");
	var ScriptBreakdownStringPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownStringPart");
	var ScriptBreakdownCommentPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCommentPart");
	var ScriptBreakdownForPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownForPart");
	var ScriptBreakdownReturnPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownReturnPart");
	var ScriptBreakdownDeletePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownDeletePart");
	var ScriptBreakdownWhilePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownWhilePart");
	var ScriptBreakdownLiteralObjectPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownLiteralObjectPart");
	var ScriptBreakdownLiteralArrayPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownLiteralArrayPart");
	var ScriptBreakdownSwitchPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownSwitchPart");
	var ScriptBreakdownCasePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCasePart");
	var ScriptBreakdownDefaultPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownDefaultPart");
	var ScriptBreakdownKeywordPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownKeywordPart");
	var ScriptBreakdownTryPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownTryPart");
	var ScriptBreakdownFinallyPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownFinallyPart");
	var ScriptBreakdownCatchPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCatchPart");
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("dbm.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("dbm.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	//Constants
	var BreakdownTypes = dbm.importClass("dbm.constants.compiler.BreakdownTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownLinePart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.LINE;
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
		if(this._scopeStart === "" && this._scopeEnd === "" && this._childBreakdowns.length === 1) {
			return this._childBreakdowns[0];
		}
		return this.superCall();
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownLinePart::_breakdown");
		//console.log(this._script.substring(0, 30));
		//console.log(this._script.substring(this._script.length-30, this._script.length));
		
		var scriptWithoutScope = this._script;
		
		var scopeStart = ScopeFunctions.getScopeStart(this._script, 0);
		if(scopeStart === 0) {
			var currentScopeStartType = ScopeFunctions.getTypeOfScopeStart(this._script, scopeStart);
			var currentScopeEndType = ScopeFunctions.getTypeOfScopeEndForScopeStart(currentScopeStartType);
			var scope = ScopeFunctions.getAnyScope(this._script, scopeStart, currentScopeStartType, currentScopeEndType);
			if(scope.end === this._script.length-currentScopeEndType.length) {
				switch(currentScopeStartType) {
					case "\"":
					case "\'":
						this._childBreakdowns.push(ScriptBreakdownStringPart.create(this, scriptWithoutScope.substring(1, scriptWithoutScope.length-1), currentScopeStartType));
						return;
					case "(":
						this.setScope(currentScopeStartType, currentScopeEndType);
						scriptWithoutScope = StringFunctions.trim(scriptWithoutScope.substring(1, scriptWithoutScope.length-1));
						break;
					case "[":
						this._childBreakdowns.push(ScriptBreakdownLiteralArrayPart.create(this, scriptWithoutScope.substring(1, scriptWithoutScope.length-1)));
						return;
					case "{":
						this._childBreakdowns.push(ScriptBreakdownLiteralObjectPart.create(this, scriptWithoutScope.substring(1, scriptWithoutScope.length-1)));
						return;
					case "//":
					case "/*":
						this._childBreakdowns.push(ScriptBreakdownCommentPart.create(this, scriptWithoutScope));
						return;
					default:
						console.log("Unknown startType " + currentScopeStartType);
						break;
				}
			}
		}
		
		var keywordType = JavascriptLanguageFunctions.startsWithKeyword(scriptWithoutScope);
		if(keywordType !== null) {
			switch(keywordType) {
				case "if":
				case "else if":
				case "else":
					this._childBreakdowns.push(ScriptBreakdownConditionPart.create(this, keywordType, scriptWithoutScope));
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
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScope.substring(keywordType.length, scriptWithoutScope.length));
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
					this._childBreakdowns.push(ScriptBreakdownFunctionPart.create(this, scriptWithoutScope));
					break;
				case "switch":
					this._childBreakdowns.push(ScriptBreakdownSwitchPart.create(this, scriptWithoutScope));
					break;
				case "case":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScope.substring(4, scriptWithoutScope.length));
					this._childBreakdowns.push(ScriptBreakdownCasePart.create(this, stringWithoutKeyword));
					break;
				case "default":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScope.substring(7, scriptWithoutScope.length));
					this._childBreakdowns.push(ScriptBreakdownDefaultPart.create(this, stringWithoutKeyword));
					break;
				case "return":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScope.substring(6, scriptWithoutScope.length));
					this._childBreakdowns.push(ScriptBreakdownReturnPart.create(this, stringWithoutKeyword));
					break;
				case "delete":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScope.substring(6, scriptWithoutScope.length));
					this._childBreakdowns.push(ScriptBreakdownDeletePart.create(this, stringWithoutKeyword));
					break;
				case "continue":
				case "break":
					this._childBreakdowns.push(ScriptBreakdownKeywordPart.create(this, scriptWithoutScope));
					break;
				case "try":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScope.substring(keywordType.length, scriptWithoutScope.length));
					this._childBreakdowns.push(ScriptBreakdownTryPart.create(this, stringWithoutKeyword));
					break;
				case "finally":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScope.substring(keywordType.length, scriptWithoutScope.length));
					this._childBreakdowns.push(ScriptBreakdownFinallyPart.create(this, stringWithoutKeyword));
					break;
				case "catch":
					var stringWithoutKeyword = StringFunctions.trim(scriptWithoutScope.substring(keywordType.length, scriptWithoutScope.length));
					this._childBreakdowns.push(ScriptBreakdownCatchPart.create(this, stringWithoutKeyword));
					break;
				default:
				case "new": //MENOTE: new is broken down in evaluation
					this._childBreakdowns.push(ScriptBreakdownEvaluationPart.create(this, scriptWithoutScope));
					//this._debugCompileString = this._script;
					break;
			}
		}
		else {
			this._childBreakdowns.push(ScriptBreakdownEvaluationPart.create(this, scriptWithoutScope));
			//this._debugCompileString = this._script;
		}
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownLinePart::compile");
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