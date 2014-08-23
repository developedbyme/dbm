/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Script breakdown for the import of a class.
 */
dbm.registerClass("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmRegisterClassPart", "com.developedbyme.compiler.breakdown.ScriptBreakdownPart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmRegisterClassPart");
	
	//Self reference
	var ScriptBreakdownDbmRegisterClassPart = dbm.importClass("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmRegisterClassPart");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var DbmBreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.DbmBreakdownTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmRegisterClassPart::_init");
		
		this.superCall();
		
		this._type = DbmBreakdownTypes.REGISTER_CLASS;
		this._classPath = null;
		this._superClassPath = null;
		this._declarationFunction = null;
		
		return this;
	};
	
	/**
	 * Gets the name of the variable where local functions are declared.
	 *
	 * @return	String	The name of the variable.
	 */
	objectFunctions.getLocalFunctionsVariableName = function() {
		//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmRegisterClassPart::getLocalFunctionsVariableName");
		//console.log(this._declarationFunction);
		
		return this._getArgumentVariableName(0);
	};
	
	/**
	 * Gets the name of the variable where static functions and variables are declared.
	 *
	 * @return	String	The name of the variable.
	 */
	objectFunctions.getStaticFunctionsVariableName = function() {
		//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmRegisterClassPart::getStaticFunctionsVariableName");
		//console.log(this._declarationFunction);
		
		return this._getArgumentVariableName(1);
	};
	
	/**
	 * Gets a variable name from the declaraion function.
	 *
	 * @param	aIndex	Number	The index of the argument to get.
	 *
	 * @return	String	The name for the argument.
	 */
	objectFunctions._getArgumentVariableName = function(aIndex) {
		//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmRegisterClassPart::getStaticFunctionsVariableName");
		var nameBreakdown = this._declarationFunction.getArgumentBreakdown(aIndex);
		
		return nameBreakdown.getVariableName();
	};
	
	/**
	 * Sets up the class registation for this breakdown.
	 *
	 * @param	aClassPath				ScriptBreakdownPart	The breakdown for the class name.
	 * @param	aSuperClassPath			ScriptBreakdownPart	The breakdown for the extended class name.
	 * @param	aDeclarationFunction	ScriptBreakdownPart	The breakdown for the declaration function.
	 */
	objectFunctions.setupRegistation = function(aClassPath, aSuperClassPath, aDeclarationFunction) {
		this._classPath = aClassPath;
		this._classPath.changeParent(this);
		this._childBreakdowns.push(this._classPath);
		
		this._superClassPath = aSuperClassPath;
		this._superClassPath.changeParent(this);
		this._childBreakdowns.push(this._superClassPath);
		
		this._declarationFunction = aDeclarationFunction;
		this._declarationFunction.changeParent(this);
		this._childBreakdowns.push(this._declarationFunction);
	};
	
	objectFunctions._breakdown = function() {
		//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmRegisterClassPart::_breakdown");
		
		//METODO: some kind of error message here?
	};
	
	objectFunctions.compile = function(aCompileData) {
		//console.log("com.developedbyme.compiler.breakdown.dbm.ScriptBreakdownDbmRegisterClassPart::compile");
		//console.log(aCompileData);
		
		var returnString = "dbm.registerClass(" + this._classPath.compile(aCompileData) + "," + this._superClassPath.compile(aCompileData) + "," + this._declarationFunction.compile(aCompileData) + ")";
		
		return returnString;
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParent, aScript, aClassPath, aSuperClassPath, aDeclarationFunction) {
		var newScriptBreakDown = (new ClassReference()).init();
		newScriptBreakDown.setParent(aParent);
		newScriptBreakDown.setScript(aScript);
		newScriptBreakDown.setupRegistation(aClassPath, aSuperClassPath, aDeclarationFunction);
		return newScriptBreakDown;
	};
});