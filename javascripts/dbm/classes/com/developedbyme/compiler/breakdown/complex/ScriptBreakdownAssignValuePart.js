/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown for a decalared function.
 */
dbm.registerClass("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownAssignValuePart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownAssignValuePart");
	
	//Self reference
	var ScriptBreakdownAssignValuePart = dbm.importClass("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownAssignValuePart");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var BreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.BreakdownTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownAssignValuePart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.ASSIGN_VALUE;
		this._name = null;
		this._value = null;
		
		return this;
	};
	
	/**
	 * Gets the name breakdown of this declaration.
	 *
	 * @return	ScriptBreakdownPart		The name part of this breakdown.
	 */
	objectFunctions.getNameBreakdown = function() {
		return this._name;
	};
	
	/**
	 * Gets the value breakdown of this declaration.
	 *
	 * @return	ScriptBreakdownFunctionPart		The value part of this breakdown.
	 */
	objectFunctions.getValueBreakdown = function() {
		return this._value;
	};
	
	objectFunctions.setupFunction = function(aName, aValue) {
		this._name = aName;
		this._name.changeParent(this);
		this._childBreakdowns.push(this._name);
		
		this._value = aValue;
		this._value.changeParent(this);
		this._childBreakdowns.push(this._value);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownAssignValuePart::_breakdown");
		
		//METODO: some kind of error message here?
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownAssignValuePart::compile");
		//console.log(aCompileData);
		
		var returnString = this._name.compile(aCompileData) + "=" + this._value.compile(aCompileData);
		
		return returnString;
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._name = null;
		this._value = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript, aName, aValue) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		newScriptBreakDown.setupFunction(aName, aValue);
		return newScriptBreakDown;
	};
});