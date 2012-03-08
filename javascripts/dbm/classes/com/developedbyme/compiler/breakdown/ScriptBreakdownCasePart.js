dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCasePart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCasePart");
	
	var ScriptBreakdownCasePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCasePart");
	
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
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCasePart::_init");
		
		this.superCall();
		
		this._type = "switch";
		this._evaluation = null;
		this._result = null;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCasePart::_breakdown");
		
		var colonPosition = this._getColonPosition(this._script);
		
		this._evaluation = ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(0, colonPosition)));
		this._result = ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(colonPosition+1, this._script.length)));
		
		this._childBreakdowns.push(this._evaluation);
		this._childBreakdowns.push(this._result);
	}
	
	objectFunctions.setConditionType = function(aType) {
		
		this._conditionType = aType;
		
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCasePart::compile");
		
		var returnString = "case ";
		
		returnString += this._evaluation.compile(aCompileData);
		returnString += ":";
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