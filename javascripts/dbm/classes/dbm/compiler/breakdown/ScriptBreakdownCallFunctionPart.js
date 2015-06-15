/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Breakdown for a function call.
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownCallFunctionPart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownCallFunctionPart");
	
	//Self reference
	var ScriptBreakdownCallFunctionPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownCallFunctionPart");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
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
		//console.log("dbm.compiler.breakdown.ScriptBreakdownCallFunctionPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.CALL_FUNCTION;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownCallFunctionPart::_breakdown");
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