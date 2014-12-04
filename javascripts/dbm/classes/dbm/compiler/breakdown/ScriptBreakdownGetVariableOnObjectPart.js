/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown of a refernce to a variable on an object.
 */
dbm.registerClass("dbm.compiler.breakdown.ScriptBreakdownGetVariableOnObjectPart", "dbm.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.breakdown.ScriptBreakdownGetVariableOnObjectPart");
	
	//Self reference
	var ScriptBreakdownGetVariableOnObjectPart = dbm.importClass("dbm.compiler.breakdown.ScriptBreakdownGetVariableOnObjectPart");
	
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
		//console.log("dbm.compiler.breakdown.ScriptBreakdownGetVariableOnObjectPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.VARIABLE_ON_OBJECT_REFERENCE;
		this._variableName = null;
		this._object = null;
		
		return this;
	};
	
	objectFunctions.getObject = function() {
		return this._object;
	};
	
	objectFunctions.getVariableName = function() {
		return this._variableName;
	};
	
	objectFunctions.setVariableName = function(aName) {
		
		this._variableName = aName;
	};
	
	objectFunctions._replaceChildBreakdown = function(aCurrentPart, aNewPart) {
		
		if(this._object === aCurrentPart) this._object = aNewPart;
		
		this.superCall(aCurrentPart, aNewPart);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("dbm.compiler.breakdown.ScriptBreakdownGetVariableOnObjectPart::_breakdown");
		
		this._object = ScriptBreakdownLinePart.create(this, this._script);
		this._childBreakdowns.push(this._object);
	};
	
	objectFunctions.compile = function(aCompileData) {
		
		return this._object.compile(aCompileData) + "." + this._variableName;
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