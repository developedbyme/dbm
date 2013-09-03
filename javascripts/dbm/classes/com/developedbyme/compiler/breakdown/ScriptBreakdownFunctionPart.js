dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownFunctionPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownFunctionPart");
	
	var ScriptBreakdownFunctionPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownFunctionPart");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	var ScriptBreakdownListPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownListPart");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownFunctionPart::_init");
		
		this.superCall();
		
		this._type = "functionDeclaration";
		this._functionName = null;
		this._arguments = null;
		this._code = null;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownFunctionPart::_breakdown");
		
		var argumentsIndex = this._script.indexOf("(");
		
		var functionName = StringFunctions.trim(this._script.substring(8, argumentsIndex));
		if(!VariableAliases.isEmptyText(functionName)) {
			this._functionName = functionName;
		}
		
		var argumentsScope = ScopeFunctions.getScope(this._script, argumentsIndex, "(", ")");
		
		this._arguments = ScriptBreakdownListPart.create(this, StringFunctions.trim(this._script.substring(argumentsScope.start+1, argumentsScope.end)));
		this._arguments.declaresVariables = "argument";
		var codeString = StringFunctions.trim(this._script.substring(argumentsScope.end+1, this._script.length));
		
		this._code = ScriptBreakdownCodePart.create(this, codeString.substring(1, codeString.length-1));
		this._code.setScope("{", "}");
		
		this._childBreakdowns.push(this._arguments);
		this._childBreakdowns.push(this._code);
	}
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownFunctionPart::compile");
		//console.log(aCompileData);
		
		aCompileData.createScope();
		
		var returnString = "function";
		
		//if(this._functionName !== null) {
		//	returnString += " " + this._functionName;
		//}
		
		returnString += "(" + this._arguments.compile(aCompileData) + ")";
		returnString += this._code.compile(aCompileData);
		
		aCompileData.removeLastScope();
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._arguments = null;
		this._code = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});