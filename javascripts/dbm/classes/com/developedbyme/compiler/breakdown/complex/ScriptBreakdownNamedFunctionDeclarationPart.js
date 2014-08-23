/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown for the import of a class.
 */
dbm.registerClass("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownNamedFunctionDeclarationPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownNamedFunctionDeclarationPart");
	
	//Self reference
	var ScriptBreakdownNamedFunctionDeclarationPart = dbm.importClass("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownNamedFunctionDeclarationPart");
	
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
		//console.log("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownNamedFunctionDeclarationPart::_init");
		
		this.superCall();
		
		this._type = BreakdownTypes.NAMED_FUNCTION_DECLARATION;
		this._name = null;
		this._declarationFunction = null;
		
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
	 * Gets the function breakdown of this declaration.
	 *
	 * @return	ScriptBreakdownFunctionPart		The name part of this breakdown.
	 */
	objectFunctions.getFunctionBreakdown = function() {
		return this._declarationFunction;
	};
	
	objectFunctions.setupFunction = function(aName, aDeclarationFunction) {
		this._name = aName;
		this._name.changeParent(this);
		this._childBreakdowns.push(this._name);
		
		this._declarationFunction = aDeclarationFunction;
		this._declarationFunction.changeParent(this);
		this._childBreakdowns.push(this._declarationFunction);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownNamedFunctionDeclarationPart::_breakdown");
		
		//METODO: some kind of error message here?
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.complex.ScriptBreakdownNamedFunctionDeclarationPart::compile");
		//console.log(aCompileData);
		
		var returnString = this._name.compile(aCompileData) + "=" + this._declarationFunction.compile(aCompileData);
		
		return returnString;
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript, aName, aDeclarationFunction) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		newScriptBreakDown.setupFunction(aName, aDeclarationFunction);
		return newScriptBreakDown;
	};
});