dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownWhilePart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownWhilePart");
	
	var ScriptBreakdownWhilePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownWhilePart");
	
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
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownWhilePart::_init");
		
		this.superCall();
		
		this._type = "while";
		this._whileType = null;
		this._evaluation = null;
		this._code = null;
		
		return this;
	};
	
	objectFunctions._replaceChildBreakdown = function(aCurrentPart, aNewPart) {
		
		if(this._evaluation === aCurrentPart) this._evaluation = aNewPart;
		if(this._code === aCurrentPart) this._code = aNewPart;
		
		this.superCall(aCurrentPart, aNewPart);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownWhilePart::_breakdown");
		if(this._whileType === "while") {
			var evaluationIndex = this._script.indexOf("(");
			var evaluationScope = ScopeFunctions.getScope(this._script, evaluationIndex, "(", ")");
			this._evaluation = ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(evaluationScope.start+1, evaluationScope.end)));
			var resultString = StringFunctions.trim(this._script.substring(evaluationScope.end+1, this._script.length));
			if(resultString.charAt(0) === "{" && ScopeFunctions.getScope(resultString, 0, "{", "}").end === resultString.length-1) {
				this._code = ScriptBreakdownCodePart.create(this, resultString.substring(1, resultString.length-1));
				this._code.setScope("{", "}");
			}
			else {
				this._code = ScriptBreakdownLinePart.create(this, resultString);
			}
		}
		else {
			var resultString = StringFunctions.trim(this._script.substring(2, this._script.length));
			
			var codeScope = ScopeFunctions.getScope(resultString, 0, "{", "}");
			
			this._code = ScriptBreakdownCodePart.create(this, resultString.substring(1, codeScope.end));
			this._code.setScope("{", "}");
			
			var endString = StringFunctions.trim(this._script.substring(codeScope.end+1, this._script.length));
			this._evaluation = ScriptBreakdownLinePart.create(this, StringFunctions.trim(endString.substring(5, endString.length)));
		}
		this._childBreakdowns.push(this._evaluation);
		this._childBreakdowns.push(this._code);
	}
	
	objectFunctions.setWhileType = function(aType) {
		
		this._whileType = aType;
		
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownWhilePart::compile");
		var returnString = this._whileType;
		
		var evaluation = "(" + this._evaluation.compile(aCompileData) + ")";
		var code = this._code.compile(aCompileData);
		
		if(this._whileType === "while") {
			returnString += evaluation;
			returnString += code;
		}
		else {
			returnString += code;
			returnString += "while";
			returnString += evaluation;
		}
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._evaluation = null;
		this._code = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aType, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setWhileType(aType);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});