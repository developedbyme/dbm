/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.data.storage.database.IndexedDatabase", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.storage.database.IndexedDatabase");
	//"use strict";
	
	var IndexedDatabase = dbm.importClass("com.developedbyme.utils.data.storage.database.IndexedDatabase");
	
	var IndexedDatabaseOperation = dbm.importClass("com.developedbyme.utils.data.storage.database.IndexedDatabaseOperation");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var IndexedDatabaseEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.IndexedDatabaseEventIds");
	
	staticFunctions.OPEN_REQUEST_GROUP = "openRequest";
	staticFunctions.DATABASE_GROUP = "database";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.storage.database.IndexedDatabase::_init");
		
		this.superCall();
		
		this._name = null;
		this._version = 0;
		
		this._openRequest = null;
		this._database = null;
		this._structure = null;
		
		this.getExtendedEvent().addCommandToEvent(IndexedDatabaseEventIds.BLOCKED, CallFunctionCommand.createCommand(this, this._openRequestBlocked, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(IndexedDatabaseEventIds.UPGRADE_NEEDED, CallFunctionCommand.createCommand(this, this._openRequestNeedsUpgrade, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(IndexedDatabaseEventIds.SUCCESS, CallFunctionCommand.createCommand(this, this._openRequestSuccess, [GetVariableObject.createSelectDataCommand()]));
		
		this.getExtendedEvent().addCommandToEvent(IndexedDatabaseEventIds.ABORT, CallFunctionCommand.createCommand(this, this._databaseAbort, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(IndexedDatabaseEventIds.ERROR, CallFunctionCommand.createCommand(this, this._databaseError, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(IndexedDatabaseEventIds.VERSION_CHANGE, CallFunctionCommand.createCommand(this, this._databaseVersionChange, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.setup = function(aName, aStructure, aVersion) {
		this._name = aName;
		this._version = aVersion;
		this._structure = aStructure;
		
		return this;
	};
	
	objectFunctions.open = function() {
		this._openRequest = ClassReference.openDatabase(this._name, this._version);
		
		if(this._openRequest !== null) {
			this.getExtendedEvent().linkJavascriptEvent(this._openRequest, IndexedDatabaseEventIds.BLOCKED, IndexedDatabaseEventIds.BLOCKED, ClassReference.OPEN_REQUEST_GROUP, true).activate();
			this.getExtendedEvent().linkJavascriptEvent(this._openRequest, IndexedDatabaseEventIds.UPGRADE_NEEDED, IndexedDatabaseEventIds.UPGRADE_NEEDED, ClassReference.OPEN_REQUEST_GROUP, true).activate();
			this.getExtendedEvent().linkJavascriptEvent(this._openRequest, IndexedDatabaseEventIds.SUCCESS, IndexedDatabaseEventIds.SUCCESS, ClassReference.OPEN_REQUEST_GROUP, true).activate();
		}
	};
	
	objectFunctions._openRequestBlocked = function(aEvent) {
		console.log("com.developedbyme.utils.data.storage.database.IndexedDatabase::_openRequestBlocked");
	};
	
	objectFunctions._openRequestNeedsUpgrade = function(aEvent) {
		console.log("com.developedbyme.utils.data.storage.database.IndexedDatabase::_openRequestNeedsUpgrade");
		
		var database = this._openRequest.result;
		
		var currentArray = this._structure.getTables();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			console.log(currentObject);
			console.log(currentObject.name, {"keyPath": currentObject.primaryKey, "autoIncrement": currentObject.autoIncrement});
			var objectSource = database.createObjectStore(currentObject.name, {"keyPath": currentObject.primaryKey, "autoIncrement": currentObject.autoIncrement});
			console.log(objectSource);
		}
	};
	
	objectFunctions._openRequestSuccess = function(aEvent) {
		console.log("com.developedbyme.utils.data.storage.database.IndexedDatabase::_openRequestSuccess");
		
		this._database = this._openRequest.result;
		console.log(this._database);
		
		this.getExtendedEvent().linkJavascriptEvent(this._database, IndexedDatabaseEventIds.ABORT, IndexedDatabaseEventIds.ABORT, ClassReference.DATABASE_GROUP, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._database, IndexedDatabaseEventIds.ERROR, IndexedDatabaseEventIds.ERROR, ClassReference.DATABASE_GROUP, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._database, IndexedDatabaseEventIds.VERSION_CHANGE, IndexedDatabaseEventIds.VERSION_CHANGE, ClassReference.DATABASE_GROUP, true).activate();
	
	};
	
	objectFunctions._databaseAbort = function(aEvent) {
		console.log("com.developedbyme.utils.data.storage.database.IndexedDatabase::_databaseAbort");
	};
	
	objectFunctions._databaseError = function(aEvent) {
		console.log("com.developedbyme.utils.data.storage.database.IndexedDatabase::_databaseError");
	};
	
	objectFunctions._databaseVersionChange = function(aEvent) {
		console.log("com.developedbyme.utils.data.storage.database.IndexedDatabase::_databaseVersionChange");
	};
	
	objectFunctions._createOperation = function(aTableName, aMode) {
		var transaction = this._database.transaction(aTableName, aMode);
		var operation = IndexedDatabaseOperation.create(transaction);
		return operation;
	};
	
	objectFunctions.insertToTable = function(aTableName, aData) {
		//METODO: verify data
		
		var operation = this._createOperation(aTableName, "readwrite");
		operation.insert(aTableName, aData);
		
		return operation;
	};
	
	objectFunctions.countTable = function(aTableName) {
		
		var operation = this._createOperation(aTableName, "readonly");
		operation.count(aTableName);
		
		return operation;
	};
	
	objectFunctions.selectFromTable = function(aTableName, aKey) {
		
		var operation = this._createOperation(aTableName, "readonly");
		operation.select(aTableName, aKey);
		
		return operation;
	};
	
	objectFunctions.selectRangeFromTable = function(aTableName, aLowerLimit, aUpperLimit, aOpenLower, aOpenUpper) {
		console.log("com.developedbyme.utils.data.storage.database.IndexedDatabase::selectRangeFromTable");
		console.log(aTableName, aLowerLimit, aUpperLimit, aOpenLower, aOpenUpper);
		
		aOpenLower = VariableAliases.valueWithDefault(aOpenLower, true);
		aOpenUpper = VariableAliases.valueWithDefault(aOpenUpper, true);
		
		var rangeClass = ClassReference.getRangeClass();
		var range;
		if(aLowerLimit === -1) {
			range = rangeClass.upperBound(aUpperLimit, aOpenUpper);
		}
		else if(aUpperLimit === -1) {
			range = rangeClass.lowerBound(aLowerLimit, aOpenLower);
		}
		else {
			range = rangeClass.bound(aLowerLimit, aUpperLimit, aOpenLower, aOpenUpper);
		}
		
		var operation = this._createOperation(aTableName, "readonly");
		operation.selectRange(aTableName, range);
		
		return operation;
	};
	
	objectFunctions.deleteFromTable = function(aTableName, aKey) {
		
		var operation = this._createOperation(aTableName, "readonly");
		operation.delete(aTableName, aKey);
		
		return operation;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case IndexedDatabaseEventIds.BLOCKED:
			case IndexedDatabaseEventIds.UPGRADE_NEEDED:
			case IndexedDatabaseEventIds.SUCCESS:
			case IndexedDatabaseEventIds.ABORT:
			case IndexedDatabaseEventIds.ERROR:
			case IndexedDatabaseEventIds.VERSION_CHANGE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._openRequest = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new local storage
	 */
	staticFunctions.create = function(aName, aStructure, aVersion) {
		//console.log("com.developedbyme.utils.data.IndexedDatabase.create");
		
		aVersion = VariableAliases.valueWithDefault(aVersion, 0);
		
		var newIndexedDatabase = (new IndexedDatabase()).init();
		
		newIndexedDatabase.setup(aName, aStructure, aVersion);
		
		return newIndexedDatabase;
	}; //End function create
	
	staticFunctions.openDatabase = function(aName) {
		if(window.indexedDB) return window.indexedDB.open(aName);
		if(window.webkitIndexedDB) return window.webkitIndexedDB.open(aName);
		if(window.mozIndexedDB) return window.mozIndexedDB.open(aName);
		if(window.msIndexedDB) return window.msIndexedDB.open(aName);
		//METODO: error emssage
		return null;
	};
	
	staticFunctions.getRangeClass = function() {
		if(window.IDBKeyRange) return window.IDBKeyRange;
		if(window.webkitIDBKeyRange) return window.webkitIDBKeyRange;
		//METODO: error emssage
		return null;
	};
});