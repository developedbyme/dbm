/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.compiler.compiledata.CompileScopeData", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.compiledata.CompileScopeData");
	
	var CompileScopeData = dbm.importClass("com.developedbyme.compiler.compiledata.CompileScopeData");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.compiledata.CompileScopeData::_init");
		
		this.superCall();
		
		this._variableReferences = NamedArray.create(true);
		this.addDestroyableObject(this._variableReferences);
		
		this.numberOfArguments = 0;
		this.numberOfVariables = 0;
		
		return this;
	};
	
	objectFunctions.addVariableReference = function(aName, aCompiledName) {
		//console.log("com.developedbyme.compiler.compiledata.CompileScopeData::addVariableReference");
		//console.log(aName, aCompiledName);
		
		if(this._variableReferences.hasObject(aName)) {
			//METODO: error message
		}
		else {
			this._variableReferences.addObject(aName, aCompiledName);
		}
		
		return this;
	};
	
	objectFunctions.hasVariableReference = function(aName) {
		
		return this._variableReferences.hasObject(aName);
		
	};
	
	objectFunctions.getVariableReference = function(aName) {
		
		return this._variableReferences.getObject(aName);
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._variableReferences = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newCompileScopeData = (new ClassReference()).init();
		
		return newCompileScopeData;
	};
});