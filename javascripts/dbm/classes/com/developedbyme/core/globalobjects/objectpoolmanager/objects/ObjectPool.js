/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Object pool, that reuses objects after they have been destroyed instead of creating new ones.
 */
dbm.registerClass("com.developedbyme.core.globalobjects.objectpoolmanager.objects.ObjectPool", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.objectpoolmanager.objects.ObjectPool");
	
	//Self reference
	var ObjectPool = dbm.importClass("com.developedbyme.core.globalobjects.objectpoolmanager.objects.ObjectPool");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	staticFunctions.DEFAULT_MAX_NUMBER_OF_OBJECTS = 512;
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.objectpoolmanager.objects.ObjectPool::_init");
		
		this.superCall();
		
		this._class = null;
		this._objects = new Array();
		this._numberOfObjects = 0;
		this._maxNumberOfObjects = ClassReference.DEFAULT_MAX_NUMBER_OF_OBJECTS;
		
		return this;
	};
	
	objectFunctions.setClass = function(aClass) {
		this._class = aClass;
		
		return this;
	};
	
	objectFunctions.setMaxNumberOfObjects = function(aMaxNumberOfObjects) {
		this._maxNumberOfObjects = aMaxNumberOfObjects;
		
		//METODO: cut down array if it's too long
		
		return this;
	};
	
	objectFunctions.createObject = function() {
		//console.log("com.developedbyme.core.globalobjects.objectpoolmanager.objects.ObjectPool::createObject");
		//console.log(this._numberOfObjects);
		
		if(this._numberOfObjects === 0) {
			var theClass = this._class;
			return (new theClass());
		}
		
		this._numberOfObjects--;
		var newObject = this._objects[this._numberOfObjects];
		this._objects[this._numberOfObjects] = null;
		return newObject;
	};
	
	objectFunctions.createAndInitObject = function() {
		//console.log("com.developedbyme.core.globalobjects.objectpoolmanager.objects.ObjectPool::createAndInitObject");
		//console.log(this._numberOfObjects);
		
		return this.createObject().init();
	};
	
	objectFunctions.reuseObject = function(aObject) {
		//console.log("com.developedbyme.core.globalobjects.objectpoolmanager.objects.ObjectPool::reuseObject");
		
		if(this._maxNumberOfObjects !== -1 && this._numberOfObjects >= this._maxNumberOfObjects) {
			//MENOTE: The object is already destroyed, so just ignore it.
			return;
		}
		
		this._objects[this._numberOfObjects] = aObject;
		this._numberOfObjects++;
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._class = null;
		this._objects = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object.
	 *
	 * @param	aClass				The class that the pool will be creating.
	 * @param	aMaxNumberOfObjects	The max number of items to store before destroying the rest.
	 *
	 * @return	ObjectPool	The newly created object pool.
	 */
	staticFunctions.create = function(aClass, aMaxNumberOfObjects) {
		//console.log("com.developedbyme.core.globalobjects.objectpoolmanager.objects.ObjectPool::create");
		
		aMaxNumberOfObjects = VariableAliases.valueWithDefault(aMaxNumberOfObjects, ClassReference.DEFAULT_MAX_NUMBER_OF_OBJECTS);
		
		var returnObject = ClassReference._createAndInitClass(ClassReference);
		returnObject.setClass(aClass);
		returnObject.setMaxNumberOfObjects(aMaxNumberOfObjects);
		
		return returnObject;
	};
});