dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownTryPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownTryPart");
	
	var ScriptBreakdownTryPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownTryPart");
	
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
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownTryPart::_init");
		
		this.superCall();
		
		this._type = "try";
		this._code = null;
		
		return this;
	};
	
	objectFunctions._replaceChildBreakdown = function(aCurrentPart, aNewPart) {
		
		if(this._code === aCurrentPart) this._code = aNewPart;
		
		this.superCall(aCurrentPart, aNewPart);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownTryPart::_breakdown");
		
		this._code = ScriptBreakdownCodePart.create(this, StringFunctions.trim(this._script.substring(1, this._script.length-1)));
		this._childBreakdowns.push(this._code);
	}
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownTryPart::compile");
		
		var returnString = "try {";
		
		returnString += this._code.compile(aCompileData);
		returnString += "}";
		
		//console.log(returnString);
		
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