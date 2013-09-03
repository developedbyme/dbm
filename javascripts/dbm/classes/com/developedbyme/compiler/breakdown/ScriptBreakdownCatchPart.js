dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCatchPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCatchPart");
	
	var ScriptBreakdownCatchPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCatchPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	var ScriptBreakdownVariableReferencePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownVariableReferencePart");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCatchPart::_init");
		
		this.superCall();
		
		this._type = "catch";
		this._evaluation = null;
		this._result = null;
		
		return this;
	};
	
	objectFunctions._replaceChildBreakdown = function(aCurrentPart, aNewPart) {
		
		if(this._evaluation === aCurrentPart) this._evaluation = aNewPart;
		if(this._result === aCurrentPart) this._result = aNewPart;
		
		this.superCall(aCurrentPart, aNewPart);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCatchPart::_breakdown");
		
		var evaluationIndex = this._script.indexOf("(");
		var evaluationScope = ScopeFunctions.getScope(this._script, evaluationIndex, "(", ")");
		this._evaluation = ScriptBreakdownVariableReferencePart.create(this, StringFunctions.trim(this._script.substring(evaluationScope.start+1, evaluationScope.end)));
		this._evaluation.declaresVariables = "error";
		var resultString = StringFunctions.trim(this._script.substring(evaluationScope.end+1, this._script.length));
		this._result = ScriptBreakdownCodePart.create(this, resultString.substring(1, resultString.length-1));
		this._result.setScope("{", "}");
		this._childBreakdowns.push(this._evaluation);
		this._childBreakdowns.push(this._result);
	};
	
	objectFunctions.setConditionType = function(aType) {
		
		this._conditionType = aType;
		
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCatchPart::compile");
		
		var returnString = "catch";
		
		if(this._evaluation !== null) {
			returnString += "(" + this._evaluation.compile(aCompileData) + ")";
		}
		returnString += this._result.compile(aCompileData);
		
		//console.log(returnString);
		
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