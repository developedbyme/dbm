dbm.registerClass("com.developedbyme.utils.data.storage.database.IndexedDatabaseStructure", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.storage.database.IndexedDatabaseStructure");
	//"use strict";
	
	var IndexedDatabaseStructure = dbm.importClass("com.developedbyme.utils.data.storage.database.IndexedDatabaseStructure");
	
	var IndexedDatabaseTableStructure = dbm.importClass("com.developedbyme.utils.data.storage.database.IndexedDatabaseTableStructure");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.storage.database.IndexedDatabaseStructure::_init");
		
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
		//trace("com.developedbyme.utils.data.IndexedDatabaseStructure.create");
		var newIndexedDatabaseStructure = (new IndexedDatabaseStructure()).init();
		
		return newIndexedDatabaseStructure;
	}; //End function create
});