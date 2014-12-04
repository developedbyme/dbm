/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown for a keyword (eg. break, continue)
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownKeywordPart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownKeywordPart");
	
	//Self reference
	var ScriptBreakdownKeywordPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownKeywordPart");
	
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
		//console.log("dbm.compiler.breakdown.ScriptBreakdownKeywordPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.KEYWORD;
		this._keyword = null;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownKeywordPart::_breakdown");
		
		this._keyword = this._script;
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownKeywordPart::compile");
		//console.log(this._keyword);
		return this._keyword;
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