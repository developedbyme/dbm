dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownFinallyPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownFinallyPart");
	
	var ScriptBreakdownFinallyPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownFinallyPart");
	
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
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownFinallyPart::init");
		
		this.superCall();
		
		this._type = "finally";
		this._code = null;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownFinallyPart::_breakdown");
		
		this._code = ScriptBreakdownCodePart.create(this, this._script.substring(1, this._script.length-1));
		this._childBreakdowns.push(this._code);
	}
	
	objectFunctions.compile = function(aCompileData) {
		
		var returnString = "finally {";
		
		returnString += + this._code.compile(aCompileData);
		returnString += "}";
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
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