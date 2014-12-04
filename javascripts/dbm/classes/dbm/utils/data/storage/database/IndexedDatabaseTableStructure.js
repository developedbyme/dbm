/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.data.storage.database.IndexedDatabaseTableStructure", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.storage.database.IndexedDatabaseTableStructure");
	//"use strict";
	
	var IndexedDatabaseTableStructure = dbm.importClass("dbm.utils.data.storage.database.IndexedDatabaseTableStructure");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.storage.database.IndexedDatabaseTableStructure::_init");
		
		this.superCall();
		
		this.name = null;
		this.primaryKey = null;
		this.autoIncrement = false;
		this._fields = new Array();
		this._indexes = new Array();
		
		return this;
	};
	
	objectFunctions.setup = function(aName, aPrimaryKey, aAutoIncrement) {
		this.name = aName;
		this.primaryKey = aPrimaryKey;
		this.autoIncrement = aAutoIncrement;
		
		return this;
	};
	
	objectFunctions.createField = function(aName, aType, aIsIndex) {
		//METODO
		
		return this;
	};
	
	objectFunctions.verifyData = function(aData) {
		//METODO
		
		return true; //MEDEBUG
	};
	
	/**
	 * Creates a new local storage
	 */
	staticFunctions.create = function(aName, aPrimaryKey, aAutoIncrement) {
		//console.log("dbm.utils.data.IndexedDatabaseTableStructure.create");
		
		aAutoIncrement = VariableAliases.valueWithDefault(aAutoIncrement, false);
		
		var newIndexedDatabaseTableStructure = (new IndexedDatabaseTableStructure()).init();
		
		newIndexedDatabaseTableStructure.setup(aName, aPrimaryKey, aAutoIncrement);
		
		return newIndexedDatabaseTableStructure;
	}; //End function create
});