/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.data.storage.database.IndexedDatabaseStructure", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.storage.database.IndexedDatabaseStructure");
	//"use strict";
	
	var IndexedDatabaseStructure = dbm.importClass("dbm.utils.data.storage.database.IndexedDatabaseStructure");
	
	var IndexedDatabaseTableStructure = dbm.importClass("dbm.utils.data.storage.database.IndexedDatabaseTableStructure");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.storage.database.IndexedDatabaseStructure::_init");
		
		this.superCall();
		
		this._tables = new Array();
		
		return this;
	};
	
	objectFunctions.addTable = function(aTable) {
		this._tables.push(aTable);
		
		return this;
	};
	
	objectFunctions.createTable = function(aName, aPrimaryKey, aAutoIncrement) {
		
		var newTable = IndexedDatabaseTableStructure.create(aName, aPrimaryKey, aAutoIncrement);
		this.addTable(newTable);
		
		return this;
	};
	
	objectFunctions.getTables = function() {
		return this._tables;
	};
	
	/**
	 * Creates a new local storage
	 */
	staticFunctions.create = function() {
		//console.log("dbm.utils.data.IndexedDatabaseStructure.create");
		var newIndexedDatabaseStructure = (new IndexedDatabaseStructure()).init();
		
		return newIndexedDatabaseStructure;
	}; //End function create
});