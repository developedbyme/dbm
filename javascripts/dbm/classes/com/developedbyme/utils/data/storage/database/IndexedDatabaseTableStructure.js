dbm.registerClass("com.developedbyme.utils.data.storage.database.IndexedDatabaseTableStructure", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.storage.database.IndexedDatabaseTableStructure");
	//"use strict";
	
	var IndexedDatabaseTableStructure = dbm.importClass("com.developedbyme.utils.data.storage.database.IndexedDatabaseTableStructure");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.storage.database.IndexedDatabaseTableStructure::_init");
		
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
		//trace("com.developedbyme.utils.data.IndexedDatabaseTableStructure.create");
		
		aAutoIncrement = VariableAliases.valueWithDefault(aAutoIncrement, false);
		
		var newIndexedDatabaseTableStructure = (new IndexedDatabaseTableStructure()).init();
		
		newIndexedDatabaseTableStructure.setup(aName, aPrimaryKey, aAutoIncrement);
		
		return newIndexedDatabaseTableStructure;
	}; //End function create
});