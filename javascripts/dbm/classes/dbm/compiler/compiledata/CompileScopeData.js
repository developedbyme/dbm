/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.compiler.compiledata.CompileScopeData", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.compiler.compiledata.CompileScopeData");
	
	var CompileScopeData = dbm.importClass("dbm.compiler.compiledata.CompileScopeData");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.compiler.compiledata.CompileScopeData::_init");
		
		this.superCall();
		
		this._variableReferences = NamedArray.create(true);
		this.addDestroyableObject(this._variableReferences);
		
		this.numberOfArguments = 0;
		this.numberOfVariables = 0;
		
		return this;
	};
	
	objectFunctions.addVariableReference = function(aName, aCompiledName) {
		//console.log("dbm.compiler.compiledata.CompileScopeData::addVariableReference");
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