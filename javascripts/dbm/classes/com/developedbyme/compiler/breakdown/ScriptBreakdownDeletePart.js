/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown of a delete operation.
 */
dbm.registerClass("com.developedbyme.compiler.breakdown.ScriptBreakdownDeletePart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownDeletePart");
	
	//Self reference
	var ScriptBreakdownDeletePart = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdownDeletePart");
	
	//Error report
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
	
	//Constants
	var BreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.BreakdownTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownDeletePart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.DELETE;
		this._line = null;
		
		return this;
	};
	
	objectFunctions._replaceChildBreakdown = function(aCurrentPart, aNewPart) {
		
		if(this._line === aCurrentPart) this._line = aNewPart;
		
		this.superCall(aCurrentPart, aNewPart);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownDeletePart::_breakdown");
		if(this._script !== "") {
			this._line = ScriptBreakdownLinePart.create(this, StringFunctions.trim(this._script));
			this._childBreakdowns.push(this._line);
		}
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.ScriptBreakdownDeletePart::compile");
		
		var returnString = "delete";
		
		if(this._line !== null) {
			returnString += " " + this._line.compile(aCompileData);
		}
		
		return returnString;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._line = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		return newScriptBreakDown;
	};
});