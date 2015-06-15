/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown of a string.
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownStringPart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownStringPart");
	
	//Self reference
	var ScriptBreakdownStringPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownStringPart");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var BreakdownTypes = dbm.importClass("dbm.constants.compiler.BreakdownTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownStringPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.STRING;
		this._scoop = "\"";
		
		return this;
	};
	
	objectFunctions.getString = function() {
		return this._script;
	};
	
	objectFunctions.setScoop = function(aScoop) {
		this._scoop = aScoop;
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownStringPart::_breakdown");
		//console.log(this._script);
	};
	
	objectFunctions.compile = function(aCompileData) {
		
		return aCompileData.addString(this._script, this._scoop);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript, aScoop) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		newScriptBreakDown.setScoop(aScoop);
		return newScriptBreakDown;
	};
});