/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.objectpoolmanager.ObjectPoolManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.objectpoolmanager.ObjectPoolManager");
	
	//Self reference
	var ObjectPoolManager = dbm.importClass("com.developedbyme.core.globalobjects.objectpoolmanager.ObjectPoolManager");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var ObjectPool = dbm.importClass("com.developedbyme.core.globalobjects.objectpoolmanager.objects.ObjectPool");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	dbm.setClassAsSingleton("dbmObjectPoolManager");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.objectpoolmanager.ObjectPoolManager::_init");
		
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
		//console.log("com.developedbyme.core.globalobjects.objectpoolmanager.ObjectPoolManager::setupObjectPoolIfClassExists");
		
		var theClass = dbm.singletons.dbmClassManager.getClassIfExists(aClassPath);
		if(theClass) {
			return this.setupObjectPoolForClass(theClass, aMaxNumberOfObjects);
		}
		
		return this;
	};
	
	objectFunctions.setupObjectPoolForClass = function(aClass, aMaxNumberOfObjects) {
		//console.log("com.developedbyme.core.globalobjects.objectpoolmanager.ObjectPoolManager::setupObjectPoolForClass");
		
		var newObjectPool = ObjectPool.create(aClass, aMaxNumberOfObjects);
		
		dbm.singletons.dbmClassManager.setObjectPoolForClass(aClass.__fullClassName, newObjectPool);
		this._objectPools.addObject(aClass.__fullClassName, newObjectPool);
		
		return newObjectPool;
	};
});