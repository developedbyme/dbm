/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown for a literal array ([item1, item2, item3]).
 */
dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart");
	
	//Self reference
	var ScriptBreakdownLiteralArrayPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependnecies
	var ScriptBreakdownLinePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownLinePart");
	var ScriptBreakdownCodePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownCodePart");
	var ScriptBreakdownListPart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownListPart");
	
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
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.LITERAL_ARRAY;
		this._arguments = null;
		
		return this;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart::_breakdown");
		
		this._arguments = ScriptBreakdownListPart.create(this, this._script);
		this._childBreakdowns.push(this._arguments);
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownLiteralArrayPart::compile");
		
		var returnString = "[" + this._arguments.compile(aCompileData) + "]";
		
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