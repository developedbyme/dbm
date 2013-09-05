dbm.registerClass("com.developedbyme.compiler.compiledata.CompileData", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.compiledata.CompileData");
	
	var CompileData = dbm.importClass("com.developedbyme.compiler.compiledata.CompileData");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var CompileScopeData = dbm.importClass("com.developedbyme.compiler.compiledata.CompileScopeData");
	var CustomBaseIdGroup = dbm.importClass("com.developedbyme.core.globalobjects.idmanager.objects.CustomBaseIdGroup");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	
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
	 * Adds a short variable
	 */
	objectFunctions.addShortVariable = function(aVariableName, aShortName) {
		this._shortVariables.addObject(aVariableName, aShortName);
	}; //End function addShortVariable
	
	
	objectFunctions.addScope = function(aScopeData) {
		
		if(this._scopesData.length > 0) {
			var parentScope = this._scopesData[this._scopesData.length-1];
			aScopeData.numberOfArguments = parentScope.numberOfArguments;
			aScopeData.numberOfVariables = parentScope.numberOfVariables;
		}
		
		this._scopesData.push(aScopeData);
		
	};
	
	objectFunctions.createScope = function() {
		
		var newScope = CompileScopeData.create();
		this.addScope(newScope);
		
		return newScope;
	};
	
	objectFunctions.removeLastScope = function() {
		//console.log("com.developedbyme.compiler.compiledata.CompileData::removeLastScope");
		
		var lastScope = this._scopesData.pop();
		
		if(this._scopesData.length > 0) {
			this._scopesData[this._scopesData.length-1].numberOfVariables = lastScope.numberOfVariables;
		}
	};
	
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
	
	objectFunctions.addImportReference = function(aName, aCompiledName) {
		//METODO: some error messages for overdeclaration
		var currentScope = this._scopesData[this._scopesData.length-1];
		currentScope.addVariableReference(aName, aCompiledName);
		
	};
	
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
	 * Gets the code for all strings
	 */
	objectFunctions.getCompiledStringsCode = function() {
		if(this._stringsCode !== null) {
			return this._stringsCode + ";";
		}
		return "";
	}; //End function getCompiledStringsCode
	
	/**
	 * Gets the code for the imports.
	 */
	objectFunctions.getCompiledImportsCode = function() {
		if(this._importsCode !== null) {
			return this._importsCode + ";";
		}
		return "";
	}; //End function getCompiledImportsCode
	
	
	
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
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._scopesData = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newCompileData = (new ClassReference()).init();
		var globalScope = ClassReference.getJavascriptDefaultScopeData();
		globalScope.addVariableReference("dbm", "dbm");
		globalScope.addVariableReference("_gaq", "_gaq");
		newCompileData.addScope(globalScope);
		return newCompileData;
	};
	
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