dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownEvaluationPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownEvaluationPart");
	
	var ScriptBreakdownEvaluationPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownEvaluationPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	var ScriptBreakdownVariableReferencePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownVariableReferencePart");
	var ScriptBreakdownGetVariableOnObjectPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownGetVariableOnObjectPart");
	var ScriptBreakdownCallFunctionPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCallFunctionPart");
	var ScriptBreakdownCommentPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCommentPart");
	var ScriptBreakdownGetAssociativeVariableOnObjectPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownGetAssociativeVariableOnObjectPart");
	var ScriptBreakdownNewPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownNewPart");
	var ScriptBreakdownNumberPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownNumberPart");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownEvaluationPart::init");
		
		this.superCall();
		
		this._operation = null;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownEvaluationPart::_breakdown");
		//console.log(this._script.substring(0, 60));
		
		if(!VariableAliases.isEmptyText(this._script)) {
			
			var operators = new Array();
			var scopes = ScopeFunctions.splitEvaluation(this._script, operators);
			
			if(scopes.length == 0) {
				if(JavascriptLanguageFunctions.startsWithSpecifiedKeyword(this._script, "new")) {
					this._childBreakdowns.push(ScriptBreakdownNewPart.create(this, StringFunctions.trim(this._script.substring(3, this._script.length))));
				}
				else {
					if(!isNaN(this._script)) {
						this._childBreakdowns.push(ScriptBreakdownNumberPart.create(this, this._script));
					}
					else {
						this._childBreakdowns.push(ScriptBreakdownVariableReferencePart.create(this, this._script));
					}
				}
			}
			else {
				
				var lowestPresedenceIndex = this._getLowestPrecedenceIndex(operators);
				var splitPosition = scopes[lowestPresedenceIndex];
				
				switch(operators[lowestPresedenceIndex]) {
					case null:
						this._operation = "";
						var currentScopeType = ScopeFunctions.getTypeOfScopeStart(this._script, splitPosition);
						switch(currentScopeType) {
							case "(":
								var beforePart = StringFunctions.trim(this._script.substring(0, splitPosition));
								if(beforePart == "new") {
									this._childBreakdowns.push(ScriptBreakdownNewPart.create(this, StringFunctions.trim(this._script.substring(splitPosition, this._script.length))));
								}
								else {
									this._childBreakdowns.push(ScriptBreakdownLinePart.create(this, beforePart));
									this._childBreakdowns.push(ScriptBreakdownCallFunctionPart.create(this, StringFunctions.trim(this._script.substring(splitPosition+1, this._script.length-1))));
								}
								break;
							case "[":
								this._childBreakdowns.push(
									ScriptBreakdownGetAssociativeVariableOnObjectPart.create(
										this,
										StringFunctions.trim(this._script.substring(0, splitPosition)),
										StringFunctions.trim(this._script.substring(splitPosition+1, this._script.length-1))
									)
								);
								break;
							case "//":
							case "/*":
								this._childBreakdowns.push(ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(0, splitPosition))));
								this._childBreakdowns.push(ScriptBreakdownCommentPart.create(this, StringFunctions.trim(this._script.substring(splitPosition, this._script.length))));
								break;
						}
						break;
					case ".":
						var firstPart = StringFunctions.trim(this._script.substring(0, splitPosition));
						var lastPart = StringFunctions.trim(this._script.substring(splitPosition+operators[lowestPresedenceIndex].length));
						if(!isNaN(firstPart) && !isNaN(lastPart)) {
							this._childBreakdowns.push(ScriptBreakdownNumberPart.create(this, this._script));
						}
						else {
							this._childBreakdowns.push(ScriptBreakdownGetVariableOnObjectPart.create(this, firstPart, lastPart));
						}
						break;
					default:
						this._operation = operators[lowestPresedenceIndex];
						this._childBreakdowns.push(ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(0, splitPosition))));
						this._childBreakdowns.push(ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(splitPosition+this._operation.length))));
						break;
				}
			}
		}
	}
	
	objectFunctions._getLowestPrecedenceIndex = function(aOperatorsArray) {
		var returnIndex = -1;
		var lowestPrecedence = -1;
		var currentArray = aOperatorsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentIndex = currentArrayLength-i-1;
			var currentPresedence = this._getPrecedence(currentArray[currentIndex]);
			if(lowestPrecedence == -1 || currentPresedence < lowestPrecedence) {
				lowestPrecedence = currentPresedence;
				returnIndex = currentIndex;
			}
		}
		return returnIndex;
	}
	
	objectFunctions._getPrecedence = function(aOperator) {
		switch(aOperator) {
			case null:
			case ".":
				return 13;
			case "!":
			case "~":
			case "*":
			case "&":
			case "++":
			case "--":
				return 12;
			case "*":
			case "/":
			case "%":
				return 11;
			case "+":
			case "-":
				return 10;
			case "<<":
			case ">>":
			case "<<<":
			case ">>>":
				return 9;
			case "<":
			case "<=":
			case ">":
			case ">=":
				return 8;
			case "==":
			case "!=":
			case "===":
			case "!==":
			case " instanceof ":
				return 7;
			case "&":
				return 6;
			case "^":
				return 5;
			case "|":
				return 4;
			case "&&":
				return 3;
			case "||":
				return 2;
			case "?":
			case ":":
				return 1;
			case "=":
			case "+=":
			case " -=":
			case "*=":
			case "/=":
			case "%=":
			case "&=":
			case "|=":
			case "^=":
			case "<<=":
			case ">>=":
			case "<<<=":
			case ">>>=":
				return 0;
		}
		
		//METODO: error message
		return 14;
	}
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownEvaluationPart::compile");
		//console.log(aCompileData);
		
		//MEDEBUG
		if(this._childBreakdowns.length == 0) {
			return "";
		}
		
		
		var returnString = this._childBreakdowns[0].compile(aCompileData);
		if(this._childBreakdowns.length > 1) {
			returnString += this._operation;
			returnString += this._childBreakdowns[1].compile(aCompileData);
		}
		
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._evaluation = null;
		this._result = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});