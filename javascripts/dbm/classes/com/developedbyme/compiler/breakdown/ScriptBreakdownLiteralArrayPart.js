dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart");
	
	var ScriptBreakdownLiteralArrayPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart");
	
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
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart::init");
		
		this.superCall();
		
		this._type = "literalArray";
		this._arguments = null;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart::_breakdown");
		
		this._arguments = ScriptBreakdownListPart.create(this, this._script);
		this._childBreakdowns.push(this._arguments);
	}
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart::compile");
		
		returnString = "[" + this._arguments.compile(aCompileData) + "]";
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._arguments = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});