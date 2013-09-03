dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCallFunctionPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCallFunctionPart");
	
	var ScriptBreakdownCallFunctionPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCallFunctionPart");
	
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
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCallFunctionPart::_init");
		
		this.superCall();
		
		this._type = "callFunction";
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownCallFunctionPart::_breakdown");
		var currentArray = this._getCommaArray(this._script);
		var currentArrayLength = currentArray.length;
		var currentPosition = 0;
		for(var i = 0; i < currentArrayLength; i++) {
			this._childBreakdowns.push(ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(currentPosition, currentArray[i]))));
			currentPosition = currentArray[i]+1;
		}
		this._childBreakdowns.push(ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(currentPosition, this._script.length))));
	};
	
	objectFunctions.compile = function(aCompileData) {
		
		var returnString = "(";
		
		var argumentsArray = new Array();
		
		var currentArray = this._childBreakdowns;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			argumentsArray.push(currentPart.compile(aCompileData));
		}
		
		returnString += argumentsArray.join(",");
		
		returnString += ")";
		
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