/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.data.storage.LocalStorage", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.storage.LocalStorage");
	//"use strict";
	
	var LocalStorage = dbm.importClass("com.developedbyme.utils.data.storage.LocalStorage");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.storage.LocalStorage::_init");
		
		this.superCall();
		
		this._dataHolder = null;
		
		this._prefix = "";
		this._suffix = "";
		
		return this;
	};
	
	objectFunctions.setup = function(aDataHolder, aPrefix, aSuffix) {
		this._dataHolder = aDataHolder;
		this._prefix = aPrefix;
		this._suffix = aSuffix;
		
		return this;
	};
	
	objectFunctions.setPrefix = function(aPrefix) {
		this._prefix = aPrefix;
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._dataHolder = null;
		this._prefix = null;
		this._suffix = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new local storage
	 */
	staticFunctions.createLocalStorage = function(aPrefix, aSuffix) {
		//trace("com.developedbyme.utils.data.LocalStorage.createLocalStorage");
		var newLocalStorage = (new LocalStorage()).init();
		
		aPrefix = VariableAliases.valueWithDefault(aPrefix, "");
		aSuffix = VariableAliases.valueWithDefault(aSuffix, "");
		
		newLocalStorage.setup(dbm.getWindow().localStorage, aPrefix, aSuffix);
		
		return newLocalStorage;
	}; //End function createLocalStorage
	
	/**
	 * Creates a new session storage
	 */
	staticFunctions.createSessionStorage = function(aPrefix, aSuffix) {
		//trace("com.developedbyme.utils.data.LocalStorage.createSessionStorage");
		var newLocalStorage = (new LocalStorage()).init();
		
		aPrefix = VariableAliases.valueWithDefault(aPrefix, "");
		aSuffix = VariableAliases.valueWithDefault(aSuffix, "");
		
		newLocalStorage.setup(dbm.getWindow().sessionStorage, aPrefix, aSuffix);
		
		return newLocalStorage;
	}; //End function createSessionStorage
	
	/**
	 * Gets local data
	 */
	staticFunctions.getLocalStorageData = function(aPath) {
		//trace("com.developedbyme.utils.data.LocalStorage.getLocalStorageData");
		return dbm.getWindow().localStorage.getItem(aPath);
	}; //End function getLocalStorageData
});