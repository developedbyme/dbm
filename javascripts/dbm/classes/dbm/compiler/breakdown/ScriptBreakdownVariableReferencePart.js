/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown of a reference to a variable.
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownVariableReferencePart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownVariableReferencePart");
	
	//Self reference
	var ScriptBreakdownVariableReferencePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownVariableReferencePart");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var ScriptBreakdownLinePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCodePart");
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var ScopeFunctions = dbm.importClass("dbm.utils.native.string.ScopeFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var JavascriptLanguageFunctions = dbm.importClass("dbm.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	//Constants
	var BreakdownTypes = dbm.importClass("dbm.constants.compiler.BreakdownTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownVariableReferencePart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.VARIABLE_REFERENCE;
		this._variableName = null;
		
		return this;
	};
	
	objectFunctions.getVariableName = function() {
		return this._variableName;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownVariableReferencePart::_breakdown");
		
		this._variableName = this._script;
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownVariableReferencePart::compile");
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