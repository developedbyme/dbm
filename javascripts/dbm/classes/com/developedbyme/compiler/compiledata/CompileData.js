/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Data used for compiling code.
 */
dbm.registerClass("com.developedbyme.compiler.compiledata.CompileData", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.compiledata.CompileData");
	
	//Self reference
	var CompileData = dbm.importClass("com.developedbyme.compiler.compiledata.CompileData");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var CompileScopeData = dbm.importClass("com.developedbyme.compiler.compiledata.CompileScopeData");
	var CustomBaseIdGroup = dbm.importClass("com.developedbyme.core.globalobjects.idmanager.objects.CustomBaseIdGroup");
	
	//Utils
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.compiledata.CompileData::_init");
		
		this.superCall();
		
		this._scopesData = new Array();
		this._shortVariables = NamedArray.create(true);
		this._strings = NamedArray.create(true);
		this._imports = NamedArray.create(true);
		this._stringsCode = null;
		this._importsCode = null;
		
		this._argumentsIdGroup = CustomBaseIdGroup.createFullAlphabet("a");
		this._variablesIdGroup = CustomBaseIdGroup.createFullAlphabet("l");
		this._errorIdGroup = CustomBaseIdGroup.createFullAlphabet("e");
		this._globalVariablesIdGroup = CustomBaseIdGroup.createFullAlphabet("g");
		this._stringIdGroup = CustomBaseIdGroup.createFullAlphabet("S");
		this._importsIdGroup = CustomBaseIdGroup.createFullAlphabet("C");
		
		return this;
	};
	
	/**
	 * Adds a variable that should be compiled with a short name instread of using autogenerating naming.
	 *
	 * @param	aVariableName	String	The original variable name to compile.
	 * @param	aShortName		String	The compiled name of the variable.
	 */
	objectFunctions.addShortVariable = function(aVariableName, aShortName) {
		this._shortVariables.addObject(aVariableName, aShortName);
	}; //End function addShortVariable
	
	/**
	 * Adds a scope to this compilation.
	 *
	 * @param	aScopeData	CompileScopeData	The new scope data.
	 */
	objectFunctions.addScope = function(aScopeData) {
		
		if(this._scopesData.length > 0) {
			var parentScope = this._scopesData[this._scopesData.length-1];
			aScopeData.numberOfArguments = parentScope.numberOfArguments;
			aScopeData.numberOfVariables = parentScope.numberOfVariables;
		}
		
		this._scopesData.push(aScopeData);
		
	};
	
	/**
	 * Creates a new scope and adds it to this compilation.
	 *
	 * @return	CompileScopeData	The newly created scope data.
	 */
	objectFunctions.createScope = function() {
		
		var newScope = CompileScopeData.create();
		this.addScope(newScope);
		
		return newScope;
	};
	
	/**
	 * Removes the last scope on the stack.
	 */
	objectFunctions.removeLastScope = function() {
		//console.log("com.developedbyme.compiler.compiledata.CompileData::removeLastScope");
		
		var lastScope = this._scopesData.pop();
		
		if(this._scopesData.length > 0) {
			this._scopesData[this._scopesData.length-1].numberOfVariables = lastScope.numberOfVariables;
		}
	};
	
	/**
	 * Adds a class that is imported in this compilation.
	 *
	 * @param	 aClassName		String	The full path name to the class that is imported.
	 *
	 * @return	String	The compiled name of the reference to this class.
	 */
	objectFunctions.addImport = function(aClassName) {
		
		if(this._imports.select(aClassName)) {
			return this._imports.currentSelectedItem;
		}
		var newId = this._importsIdGroup.getNewId();
		this._imports.addObject(aClassName, newId);
		
		var stringsVariable = this.addString(aClassName, "\"");
		
		if(this._importsCode === null) {
			this._importsCode = "var " + newId + "=dbm.importClass(" + stringsVariable + ")";
		}
		else {
			this._importsCode += "," + newId + "=dbm.importClass(" + stringsVariable + ")";
		}
		
		return newId;
	};
	
	/**
	 * Adds an import reference to the current scope.
	 *
	 * @param	aName			String	The original name of the reference.
	 * @param	aCompiledName	String	The compiled name of the reference.
	 */
	objectFunctions.addImportReference = function(aName, aCompiledName) {
		//METODO: some error messages for overdeclaration
		var currentScope = this._scopesData[this._scopesData.length-1];
		currentScope.addVariableReference(aName, aCompiledName);
		
	};
	
	/**
	 * Adds a string to this compilation. If a string already exists it's using the same reference.
	 *
	 * @param	aString		String	The string to add.
	 * @param	aScope		String	The scope containing the string (single or double quote).
	 *
	 * @param	String	The compiled reference to this string.
	 */
	objectFunctions.addString = function(aString, aScope) {
		
		//METODO: split up strings
		
		if(this._strings.select(aString)) {
			return this._strings.currentSelectedItem;
		}
		var newId = this._stringIdGroup.getNewId();
		this._strings.addObject(aString, newId);
		
		if(this._stringsCode === null) {
			this._stringsCode = "var " + newId + "=" + aScope + aString + aScope;
		}
		else {
			this._stringsCode += "," + newId + "=" + aScope + aString + aScope;
		}
		
		return newId;
	};
	
	/**
	 * Gets the code for all strings.
	 *
	 * @return	String	The code string containing all the strings that is used in this compilation.
	 */
	objectFunctions.getCompiledStringsCode = function() {
		if(this._stringsCode !== null) {
			return this._stringsCode + ";";
		}
		return "";
	}; //End function getCompiledStringsCode
	
	/**
	 * Gets the code for the imports.
	 *
	 * @return	String	The code string for all the class imports used in this compilation.
	 */
	objectFunctions.getCompiledImportsCode = function() {
		if(this._importsCode !== null) {
			return this._importsCode + ";";
		}
		return "";
	}; //End function getCompiledImportsCode
	
	/**
	 * Gets the compiled name of a variable that has been registrated in this compilation.
	 * A new global variable is created if the reference doesn't exist.
	 *
	 * @param	aName	String	The original name of the variable.
	 *
	 * @return	String	The compiled named of the variable.
	 */
	objectFunctions.getVariableReference = function(aName) {
		
		if(this._shortVariables.select(aName)) {
			return this._shortVariables.currentSelectedItem;
		}
		
		var currentArray = this._scopesData;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentScope = currentArray[currentArrayLength-1-i];
			if(currentScope.hasVariableReference(aName)) {
				return currentScope.getVariableReference(aName);
			}
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getVariableReference", "Variable " + aName + " isn't declared, declaring it global.");
		return this._performCreateVariableReference(aName, "globalVariable", this._scopesData[0]);
	};
	
	/**
	 * Creates a new compiled name for a variable name.
	 *
	 * @param	aName	String	The name of the original variable.
	 * @param	aType	String	The type of variable. Used for naming the compiled name.
	 *
	 * @todo	Change aType from String to Enum.
	 *
	 * @return	String	The compiled named of the variable.
	 */
	objectFunctions.createVariableReference = function(aName, aType) {
		
		if(this._shortVariables.select(aName)) {
			return this._shortVariables.currentSelectedItem;
		}
		
		var currentArray = this._scopesData;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentScope = currentArray[currentArrayLength-1-i];
			if(currentScope.hasVariableReference(aName)) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "createVariableReference", "Variable " + aName + " already exists.");
				return currentScope.getVariableReference(aName);
			}
		}
		return this._performCreateVariableReference(aName, aType, this._scopesData[this._scopesData.length-1]);
	};
	
	/**
	 * Perfomes the creation of a new comipled name for a variable name.
	 *
	 * @param	aName		String				The name of the original variable.
	 * @param	aType		String				The type of variable. Used for naming the compiled name.
	 * @param	aScopeData	CompileScopeData	The scope to add the variable reference to.
	 *
	 * @todo	Change aType from String to Enum.
	 *
	 * @return	String	The compiled named of the variable.
	 */
	objectFunctions._performCreateVariableReference = function(aName, aType, aScopeData) {
		
		var compiledName;
		switch(aType) {
			case "argument":
				compiledName = this._argumentsIdGroup.getId(aScopeData.numberOfArguments);
				aScopeData.numberOfArguments++;
				break;
			case "variable":
				compiledName = this._variablesIdGroup.getId(aScopeData.numberOfVariables);
				aScopeData.numberOfVariables++;
				break;
			case "globalVariable":
				compiledName = this._globalVariablesIdGroup.getNewId();
				break;
			case "error":
				compiledName = this._errorIdGroup.getNewId();
				break;
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_performCreateVariableReference", "Unknown variable type " + aType + ".");
				compiledName = dbm.singletons.dbmIdManager.getNewId(aType);
				break;
		}
		
		aScopeData.addVariableReference(aName, compiledName);
		
		return compiledName;
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._scopesData = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @return	CompileData	The newly created instance.
	 */
	staticFunctions.create = function() {
		var newCompileData = (new ClassReference()).init();
		var globalScope = ClassReference.getJavascriptDefaultScopeData();
		globalScope.addVariableReference("dbm", "dbm");
		globalScope.addVariableReference("_gaq", "_gaq");
		globalScope.addVariableReference("google", "google");
		newCompileData.addScope(globalScope);
		return newCompileData;
	};
	
	/**
	 * Gets a scope data with all the global varaibles in javascript.
	 *
	 * @return	CompileScopeData	The global javascript scope data.
	 */
	staticFunctions.getJavascriptDefaultScopeData = function() {
		var newScopeData = CompileScopeData.create();
		
		var currentArray = JavascriptLanguageFunctions.GLOBAL_OBJECTS;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			newScopeData.addVariableReference(currentArray[i], currentArray[i]);
		}
		
		return newScopeData;
	};
});