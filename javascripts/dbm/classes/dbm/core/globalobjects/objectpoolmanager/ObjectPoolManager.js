/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.objectpoolmanager.ObjectPoolManager", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.objectpoolmanager.ObjectPoolManager");
	
	//Self reference
	var ObjectPoolManager = dbm.importClass("dbm.core.globalobjects.objectpoolmanager.ObjectPoolManager");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var ObjectPool = dbm.importClass("dbm.core.globalobjects.objectpoolmanager.objects.ObjectPool");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.objectpoolmanager.ObjectPoolManager::_init");
		
		this.superCall();
		
		this._objectPools = NamedArray.create(true);
		this._arrayObjectPool = ObjectPool.create(Array, 100);
		this._objectObjectPool = ObjectPool.create(Object, 100);
		
		return this;
	};
	
	objectFunctions.createArray = function() {
		return this._arrayObjectPool.createObject();
	};
	
	objectFunctions.reuseArray = function(aArray) {
		if(VariableAliases.isSet(aArray)) {
			aArray.length = 0;
			this._arrayObjectPool.reuseObject(aArray);
		}
		else {
			//METODO: error report
		}
	};
	
	objectFunctions.createObject = function() {
		return this._objectObjectPool.createObject();
	};
	
	objectFunctions.reuseObject = function(aObject) {
		if(VariableAliases.isSet(aObject)) {
			for(var objectName in aObject) {
				delete aObject[objectName];
			}
			this._objectObjectPool.reuseObject(aObject);
		}
		else {
			//METODO: error report
		}
	};
	
	objectFunctions.setupObjectPoolIfClassExists = function(aClassPath, aMaxNumberOfObjects) {
		//console.log("dbm.core.globalobjects.objectpoolmanager.ObjectPoolManager::setupObjectPoolIfClassExists");
		
		var theClass = dbm.singletons.dbmClassManager.getClassIfExists(aClassPath);
		if(theClass) {
			return this.setupObjectPoolForClass(theClass, aMaxNumberOfObjects);
		}
		
		return this;
	};
	
	objectFunctions.setupObjectPoolForClass = function(aClass, aMaxNumberOfObjects) {
		//console.log("dbm.core.globalobjects.objectpoolmanager.ObjectPoolManager::setupObjectPoolForClass");
		
		var newObjectPool = ObjectPool.create(aClass, aMaxNumberOfObjects);
		
		dbm.singletons.dbmClassManager.setObjectPoolForClass(aClass.__fullClassName, newObjectPool);
		this._objectPools.addObject(aClass.__fullClassName, newObjectPool);
		
		return newObjectPool;
	};
});