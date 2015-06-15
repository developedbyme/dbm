/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown for a catch statement.
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownCatchPart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownCatchPart");
	
	//Self reference
	var ScriptBreakdownCatchPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCatchPart");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ScriptBreakdownLinePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCodePart");
	var ScriptBreakdownVariableReferencePart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownVariableReferencePart");
	
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
		//console.log("dbm.compiler.breakdown.ScriptBreakdownCatchPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.CATCH;
		this._evaluation = null;
		this._result = null;
		
		return this;
	};
	
	objectFunctions._replaceChildBreakdown = function(aCurrentPart, aNewPart) {
		
		if(this._evaluation === aCurrentPart) this._evaluation = aNewPart;
		if(this._result === aCurrentPart) this._result = aNewPart;
		
		this.superCall(aCurrentPart, aNewPart);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownCatchPart::_breakdown");
		
		var evaluationIndex = this._script.indexOf("(");
		var evaluationScope = ScopeFunctions.getScope(this._script, evaluationIndex, "(", ")");
		this._evaluation = ScriptBreakdownVariableReferencePart.create(this, StringFunctions.trim(this._script.substring(evaluationScope.start+1, evaluationScope.end)));
		this._evaluation.declaresVariables = "error";
		var resultString = StringFunctions.trim(this._script.substring(evaluationScope.end+1, this._script.length));
		this._result = ScriptBreakdownCodePart.create(this, resultString.substring(1, resultString.length-1));
		this._result.setScope("{", "}");
		this._childBreakdowns.push(this._evaluation);
		this._childBreakdowns.push(this._result);
	};
	
	objectFunctions.setConditionType = function(aType) {
		
		this._conditionType = aType;
		
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownCatchPart::compile");
		
		var returnString = "catch";
		
		if(this._evaluation !== null) {
			returnString += "(" + this._evaluation.compile(aCompileData) + ")";
		}
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