/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown of a reference to a variable.
 */
dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownVariableReferencePart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownVariableReferencePart");
	
	//Self reference
	var ScriptBreakdownVariableReferencePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownVariableReferencePart");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	
	//Utils
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("com.developedbyme.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	//Constants
	var BreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.BreakdownTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownVariableReferencePart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.VARIABLE_REFERENCE;
		this._variableName = null;
		
		return this;
	};
	
	objectFunctions.getVariableName = function() {
		return this._variableName;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownVariableReferencePart::_breakdown");
		
		this._variableName = this._script;
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownVariableReferencePart::compile");
		//console.log(this._variableName);
		var returnReference;
		if(this.declaresVariables !== null) {
			returnReference = aCompileData.createVariableReference(this._variableName, this.declaresVariables);
		}
		else {
			returnReference = aCompileData.getVariableReference(this._variableName);
		}
		
		return returnReference;
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