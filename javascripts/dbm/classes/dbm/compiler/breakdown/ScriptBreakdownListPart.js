/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown of a list, such as a list of arguments in a function declaration.
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownListPart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownListPart");
	
	//Self reference
	var ScriptBreakdownListPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownListPart");
	
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
	var StringRegularExpressions = dbm.importClass("dbm.utils.native.string.StringRegularExpressions");
	
	//Dependencies
	var BreakdownTypes = dbm.importClass("dbm.constants.compiler.BreakdownTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownListPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.LIST;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownListPart::_breakdown");
		
		if(StringRegularExpressions.isWhiteSpace(this._script)) {
			return;
		}
		
		var currentArray = this._getCommaArray(this._script);
		var currentArrayLength = currentArray.length;
		var currentPosition = 0;
		var currentBreakdown;
		for(var i = 0; i < currentArrayLength; i++) {
			currentBreakdown = ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(currentPosition, currentArray[i])));
			this._childBreakdowns.push(currentBreakdown);
			currentPosition = currentArray[i]+1;
		}
		currentBreakdown = ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script.substring(currentPosition, this._script.length)));
		this._childBreakdowns.push(currentBreakdown);
	};
	
	objectFunctions.compile = function(aCompileData) {
		
		var argumentsArray = new Array();
		
		var currentArray = this._childBreakdowns;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			argumentsArray.push(currentPart.compile(aCompileData));
		}
		
		var returnString = argumentsArray.join(",");
		
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