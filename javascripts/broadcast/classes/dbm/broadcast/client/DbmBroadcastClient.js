/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.broadcast.client.DbmBroadcastClient", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.broadcast.client.DbmBroadcastClient");
	
	var DbmBroadcastClient = dbm.importClass("dbm.broadcast.client.DbmBroadcastClient");
	
	var LocalStorage = dbm.importClass("dbm.utils.data.storage.LocalStorage");
	
	objectFunctions._init = function() {
		//console.log("dbm.broadcast.client.DbmBroadcastClient::_init");
		
		this.superCall();
		
		this._lastUpdateCall = 0;
		this._updateOffset = 0;
		this._updateInterval = 5;
		
		
		this._serverName = null;
		this._localName = null;
		
		this._initialUrl = null;
		this._localStorage = LocalStorage.createLocalStorage();
		
		return this;
	};
	
	objectFunctions.setNames = function(aServerName, aLocalName) {
		
		this._serverName = aServerName;
		this._localName = aLocalName;
		this._localStorage.setPrefix("dbm/broadcast" + "/" + this._serverName + "/" + this._localName + "/");
		
		return this;
	};
	
	objectFunctions.setInitialUrl = function(aInitialUrl) {
		
		this._initialUrl = aInitialUrl;
		
		return this;
	};
	
	objectFunctions.start = function() {
		
		dbm.singletons.dbmUpdateManager.addUpdater(this, "default");
		
		return this;
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		console.log("dbm.broadcast.client.DbmBroadcastClient::updateTime");
		
		
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("serverName: " + this._serverName);
		aReturnArray.push("localName: " + this._localName);
	}
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._serverName = null;
		this._localName = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aServerName, aLocalName, aInitialUrl) {
		var newDbmBroadcastClient = (new ClassReference()).init();
		newDbmBroadcastClient.setNames(aServerName, aLocalName);
		newDbmBroadcastClient.setInitialUrl(aInitialUrl);
		return newDbmBroadcastClient;
	};
});