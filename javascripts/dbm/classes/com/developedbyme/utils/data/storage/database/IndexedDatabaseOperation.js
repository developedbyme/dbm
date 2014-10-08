/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.data.storage.database.IndexedDatabaseOperation", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.storage.database.IndexedDatabaseOperation");
	//"use strict";
	
	var IndexedDatabaseOperation = dbm.importClass("com.developedbyme.utils.data.storage.database.IndexedDatabaseOperation");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var IndexedDatabaseEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.IndexedDatabaseEventIds");
	
	staticFunctions.TRANSACTION_GROUP = "transaction";
	staticFunctions.REQUEST_GROUP = "request";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.storage.database.IndexedDatabaseOperation::_init");
		
		this.superCall();
		
		this._transaction = null;
		this._request = null;
		this._result = null;
		this._status = 0;
		this._hasMultipleResults = false;
		
		this.getExtendedEvent().addCommandToEvent(IndexedDatabaseEventIds.COMPLETE, CallFunctionCommand.createCommand(this, this._completeCallback, [GetVariableObject.createSelectDataCommand()]));
		
		this.getExtendedEvent().addCommandToEvent(IndexedDatabaseEventIds.SUCCESS, CallFunctionCommand.createCommand(this, this._successCallback, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(IndexedDatabaseEventIds.ERROR, CallFunctionCommand.createCommand(this, this._errorCallback, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.setTransaction = function(aTransaction) {
		
		this._transaction = aTransaction;
		
		this.getExtendedEvent().linkJavascriptEvent(this._transaction, IndexedDatabaseEventIds.COMPLETE, IndexedDatabaseEventIds.COMPLETE, ClassReference.TRANSACTION_GROUP, true).activate();
		
		return this;
	};
	
	objectFunctions._successCallback = function(aEvent) {
		console.log("com.developedbyme.utils.data.storage.database.IndexedDatabaseOperation::_successCallback");
		
		if(this._hasMultipleResults) {
			var result = this._request.result;
			console.log(result);
			if(result === null) {
				this._status = 1;
				return;
			}
			this._result.push(result.value);
			result.continue();
		}
		else {
			this._status = 1;
			this._result = this._request.result;
		}
	};
	
	objectFunctions._errorCallback = function(aEvent) {
		console.log("com.developedbyme.utils.data.storage.database.IndexedDatabaseOperation::_errorCallback");
		
		this._status = -1;
	};
	
	objectFunctions._completeCallback = function(aEvent) {
		console.log("com.developedbyme.utils.data.storage.database.IndexedDatabaseOperation::_completeCallback");
		
		//MENOTE: should this set the
	};
	
	objectFunctions.insert = function(aTableName, aData) {
		
		this._status = 2;
		
		var objectStore = this._transaction.objectStore(aTableName);
		this._request = objectStore.put(aData);
		this.getExtendedEvent().linkJavascriptEvent(this._request, IndexedDatabaseEventIds.SUCCESS, IndexedDatabaseEventIds.SUCCESS, ClassReference.REQUEST_GROUP, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._request, IndexedDatabaseEventIds.ERROR, IndexedDatabaseEventIds.ERROR, ClassReference.REQUEST_GROUP, true).activate();
		
		return this;
	};
	
	objectFunctions.count = function(aTableName) {
		
		this._status = 2;
		
		var objectStore = this._transaction.objectStore(aTableName);
		this._request = objectStore.count();
		this.getExtendedEvent().linkJavascriptEvent(this._request, IndexedDatabaseEventIds.SUCCESS, IndexedDatabaseEventIds.SUCCESS, ClassReference.REQUEST_GROUP, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._request, IndexedDatabaseEventIds.ERROR, IndexedDatabaseEventIds.ERROR, ClassReference.REQUEST_GROUP, true).activate();
		
		return this;
	};
	
	objectFunctions.select = function(aTableName, aKey) {
		
		this._status = 2;
		
		var objectStore = this._transaction.objectStore(aTableName);
		this._request = objectStore.get(aKey);
		this.getExtendedEvent().linkJavascriptEvent(this._request, IndexedDatabaseEventIds.SUCCESS, IndexedDatabaseEventIds.SUCCESS, ClassReference.REQUEST_GROUP, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._request, IndexedDatabaseEventIds.ERROR, IndexedDatabaseEventIds.ERROR, ClassReference.REQUEST_GROUP, true).activate();
		
		return this;
	};
	
	objectFunctions.selectRange = function(aTableName, aRange) {
		console.log("com.developedbyme.utils.data.storage.database.IndexedDatabaseOperation::_errorCallback");
		console.log(aTableName, aRange);
		
		this._status = 2;
		this._hasMultipleResults = true;
		this._result = new Array();
		
		var objectStore = this._transaction.objectStore(aTableName);
		this._request = objectStore.openCursor(aRange);
		this.getExtendedEvent().linkJavascriptEvent(this._request, IndexedDatabaseEventIds.SUCCESS, IndexedDatabaseEventIds.SUCCESS, ClassReference.REQUEST_GROUP, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._request, IndexedDatabaseEventIds.ERROR, IndexedDatabaseEventIds.ERROR, ClassReference.REQUEST_GROUP, true).activate();
		
		return this;
	};
	
	objectFunctions.delete = function(aTableName, aKey) {
		
		this._status = 2;
		
		var objectStore = this._transaction.objectStore(aTableName);
		this._request = objectStore.delete(aKey);
		this.getExtendedEvent().linkJavascriptEvent(this._request, IndexedDatabaseEventIds.SUCCESS, IndexedDatabaseEventIds.SUCCESS, ClassReference.REQUEST_GROUP, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._request, IndexedDatabaseEventIds.ERROR, IndexedDatabaseEventIds.ERROR, ClassReference.REQUEST_GROUP, true).activate();
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case IndexedDatabaseEventIds.SUCCESS:
			case IndexedDatabaseEventIds.ERROR:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._transaction = null;
		this._request = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new local storage
	 */
	staticFunctions.create = function(aTransaction) {
		//console.log("com.developedbyme.utils.data.IndexedDatabaseOperation.create");
		
		var newIndexedDatabaseOperation  = (new IndexedDatabaseOperation()).init();
		
		newIndexedDatabaseOperation.setTransaction(aTransaction);
		
		return newIndexedDatabaseOperation;
	}; //End function create
});