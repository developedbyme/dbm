/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Definition for a function documentation.
 */
dbm.registerClass("dbm.compiler.compiledata.documentation.definitions.FunctionDefinition", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.compiledata.documentation.definitions.FunctionDefinition");
	
	//Self reference
	var FunctionDefinition = dbm.importClass("dbm.compiler.compiledata.documentation.definitions.FunctionDefinition");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.compiler.compiledata.documentation.definitions.FunctionDefinition::_init");
		
		this.superCall();
		
		this.functionName = null;
		this.argumentNames = null;
		this.returnType = "none";
		
		return this;
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.functionName = null;
		this.argumentNames = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aFunctionName		String		The name of the function.
	 * @param	aArgumentsArray		Array		The array of argument names.
	 * @param	aReturnType			String		The type of return.
	 *
	 * @return	FunctionDefinition	The newly created instance.
	 */
	staticFunctions.create = function(aFunctionName, aArgumentsArray, aReturnType) {
		var newFunctionDefinition = (new ClassReference()).init();
		
		newFunctionDefinition.functionName = aFunctionName;
		newFunctionDefinition.argumentNames = aArgumentsArray;
		newFunctionDefinition.returnType = aReturnType;
		
		return newFunctionDefinition;
	};
});