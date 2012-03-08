dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownConditionPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownConditionPart");
	
	var ScriptBreakdownConditionPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownConditionPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownConditionPart::_init");
		
		this.superCall();
		
		this._type = "condition";
		this._conditionType = null;
		this._evaluation = null;
		this._result = null;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownConditionPart::_breakdown");
		if(this._conditionType != "else") {
			var evaluationIndex = this._script.indexOf("(");
			var evaluationScope = ScopeFunctions.getScope(this._script, evaluationIndex, "(", ")");
			this._evaluation = ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(evaluationScope.start+1, evaluationScope.end)));
			var resultString = StringFunctions.trim(this._script.substring(evaluationScope.end+1, this._script.length));
			if(resultString.charAt(0) == "{" && ScopeFunctions.getScope(resultString, 0, "{", "}").end == resultString.length-1) {
				this._result = ScriptBreakdownCodePart.create(this, resultString.substring(1, resultString.length-1));
				this._result.setScope("{", "}");
			}
			else {
				this._result = ScriptBreakdownLinePart.create(this, resultString);
			}
			this._childBreakdowns.push(this._evaluation);
		}
		else {
			var resultString = StringFunctions.trim(this._script.substring(4, this._script.length));
			if(resultString.charAt(0) == "{" && ScopeFunctions.getScope(resultString, 0, "{", "}").end == resultString.length-1) {
				this._result = ScriptBreakdownCodePart.create(this, resultString.substring(1, resultString.length-1));
				this._result.setScope("{", "}");
			}
			else {
				this._result = ScriptBreakdownLinePart.create(this, resultString);
			}
		}
		this._childBreakdowns.push(this._result);
	}
	
	objectFunctions.setConditionType = function(aType) {
		
		this._conditionType = aType;
		
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownConditionPart::compile");
		//console.log(aCompileData);
		
		var returnString = this._conditionType;
		
		if(this._evaluation != null) {
			returnString += "(" + this._evaluation.compile(aCompileData) + ")";
		}
		returnString += this._result.compile(aCompileData);
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._evaluation = null;
		this._result = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aType, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setConditionType(aType);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});