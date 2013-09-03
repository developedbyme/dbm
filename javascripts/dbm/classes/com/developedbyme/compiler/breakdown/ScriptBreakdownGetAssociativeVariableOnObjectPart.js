dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownGetAssociativeVariableOnObjectPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownGetAssociativeVariableOnObjectPart");
	
	var ScriptBreakdownGetAssociativeVariableOnObjectPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownGetAssociativeVariableOnObjectPart");
	
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
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownGetAssociativeVariableOnObjectPart::_init");
		
		this.superCall();
		
		this._type = "associativeVariableOnObjectReference";
		this._variableName = null;
		this._variableNameLine = null;
		this._object = null;
		
		return this;
	};
	
	objectFunctions.setVariableName = function(aName) {
		
		this._variableName = aName;
	};
	
	objectFunctions._replaceChildBreakdown = function(aCurrentPart, aNewPart) {
		
		if(this._variableNameLine === aCurrentPart) this._variableNameLine = aNewPart;
		if(this._object === aCurrentPart) this._object = aNewPart;
		
		this.superCall(aCurrentPart, aNewPart);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownGetAssociativeVariableOnObjectPart::_breakdown");
		//console.log(this._variableName);
		
		this._variableNameLine = ScriptBreakdownLinePart.create(this, this._variableName);
		this._childBreakdowns.push(this._variableNameLine);
		
		this._object = ScriptBreakdownLinePart.create(this, this._script);
		this._childBreakdowns.push(this._object);
	}
	
	objectFunctions.compile = function(aCompileData) {
		
		return this._object.compile(aCompileData) + "[" + this._variableNameLine.compile(aCompileData) + "]";
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript, aName) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		
		newScriptBreakDown.setVariableName(aName);
		return newScriptBreakDown;
	};
});