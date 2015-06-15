/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for other objects. Implementes the interface for destroy() and dynamic data.
 */
dbm.registerClass("dbm.core.BaseObject", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	//"use strict";
	
	//Self reference
	var BaseObject = dbm.importClass("dbm.core.BaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	
	/**
	 * Consructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.BaseObject::_init");
		
		this._isDestroyed = false;
		this._destroyableObjects = null;
		this._dynamicVariables = null;
		
		//if(dbm.singletons.dbmDebugManager) {
		//	dbm.singletons.dbmDebugManager.objectCreated(this.__fullClassName);
		//}
		
		return this;
	};
	
	/**
	 * Seals the object as part of the init function.
	 */
	objectFunctions._initSeal = function() {
		//MENOTE: sealing the object gets much lower perfomance
		//if(Object.seal !== undefined) {
		//	Object.seal(this);
		//}
	};
	
	/**
	 * Public constructor
	 *
	 * @return	self
	 */
	objectFunctions.init = function() {
		//console.log("dbm.core.BaseObject::init");
		
		this._init();
		this._initSeal();
		
		return this;
	};
	
	/**
	 * Public constructor that doesn't seal the object.
	 *
	 * @return	self
	 */
	objectFunctions.initWithoutSeal = function() {
		this._init();
		
		return this;
	};
	
	/**
	 * Adds an object that should be destroyed when this object is destroyed.
	 *
	 * @param	aObject		BaseObject	The object that should be owned by this object.
	 *
	 * @return	BaseObject	The object that is passed in.
	 */
	objectFunctions.addDestroyableObject = function(aObject) {
		//console.log("dbm.core.BaseObject::addDestroyableObject");
		
		if(!(aObject instanceof BaseObject)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addDestroyableObject", "Object " + aObject + " is not a base object so it can't be destroyed by " + this + ".");
			return aObject;
		}
		
		if(this._destroyableObjects === null) {
			this._destroyableObjects = ClassReference._createArray();
		}
		this._destroyableObjects.push(aObject);
		
		return aObject;
	};
	
	/**
	 * Removes an object that has been previously been marked for deletion with this object.
	 *
	 * @param	aObject		BaseObject	The object that should no longer be owned by this object.
	 *
	 * @return	BaseObject	The object that is passed in.
	 */
	objectFunctions.removeDestroyableObject = function(aObject) {
		if(this._destroyableObjects !== null) {
			var objectIndex = ArrayFunctions.indexOfInArray(this._destroyableObjects, aObject);
			if(objectIndex !== -1) {
				this._destroyableObjects.splice(objectIndex, 1);
			}
			else {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "removeDestroyableObject", "Object " + aObject + " is not targeted for destruction.");
			}
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "removeDestroyableObject", "Object has no removable objects, can't remove " + aObject + ".");
		}
		
		return aObject;
	};
	
	/**
	 * Gets the array of destroyable objects.
	 *
	 * @return	Array<BaseObject>	The array of objects that are marked for destruction.
	 */
	objectFunctions.getDestroyableObjectsArray = function() {
		if(this._destroyableObjects === null) {
			this._destroyableObjects = new Array();
		}
		return this._destroyableObjects;
	};
	
	/**
	 * Adds a dynamic meta data to this object.
	 *
	 * @param	aName	String	The name of the data.
	 * @param	aData	*		The data to store.
	 *
	 * @return	*	The data that is passed in.
	 */
	objectFunctions.setDynamicVariable = function(aName, aData) {
		if(this._dynamicVariables === null) {
			this._dynamicVariables = ClassReference._createObject();
		}
		this._dynamicVariables[aName] = aData;
		
		return aData;
	};
	
	/**
	 * Removes a dynamic meta data from this object.
	 *
	 * @param	aName	String	The name of the data.
	 *
	 * @return	self
	 */
	objectFunctions.removeDynamicVariable = function(aName) {
		if(this._dynamicVariables === null) return;
		delete this._dynamicVariables[aName];
		
		return this;
	};
	
	/**
	 * Gets a dynamic meta data from this object.
	 *
	 * @param	aName	String	The name of the data.
	 *
	 * @return	*	The stored data that corresponds to the name. Null if not found.
	 */
	objectFunctions.getDynamicVariable = function(aName) {
		if(this._dynamicVariables === null || this._dynamicVariables[aName] === undefined) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getDynamicVariable", "Object " + this + " doesn't have dynamic variable " + aName + ".");
			return null;
		}
		return this._dynamicVariables[aName];
	};
	
	/**
	 * Checks if this object has a dynamic meta data
	 *
	 * @param	aName	String	The name of the data.
	 *
	 * @return	Boolean		True if it exists.
	 */
	objectFunctions.hasDynamicVariable = function(aName) {
		return (this._dynamicVariables !== null && this._dynamicVariables[aName] !== undefined);
	};
	
	/**
	 * Function that calls the super function of the function that called this function.
	 *
	 * @return	*	The return value of the super function.
	 */
	objectFunctions.superCall = function() {
		//console.log("dbm.core.BaseObject::superCall");
		
		var callerFunction = arguments.callee.caller;
		
		var superFunction = callerFunction["superFunction"];
		
		if(superFunction !== undefined) {
			return superFunction.apply(this, arguments);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "superCall", "Function " + callerFunction + " doesn't have a super function.");
		}
	};
	
	/**
	 * Checks if the object is destroyed.
	 *
	 * @return	Boolean		True if the object is destroyed.
	 */
	objectFunctions.isDestroyed = function() {
		//console.log("dbm.core.BaseObject::isDestroyed");
		return this._isDestroyed;
	};
	
	/**
	 * Destroys the object
	 */
	objectFunctions.destroy = function() {
		//console.log("dbm.core.BaseObject::destroy");
		//console.log(this.toString());
		this._isDestroyed = true;
		
		try {
			this.performDestroy();
			if(dbm.singletons.dbmDebugManager) {
				dbm.singletons.dbmDebugManager.checkThatObjectIsDestroyed(this);
			}
			this.setAllReferencesToNull();
			if(dbm.singletons.dbmDebugManager) {
				dbm.singletons.dbmDebugManager.checkThatObjectHasNoReferences(this);
			}
			if(this.__objectPool) {
				this.__objectPool.reuseObject(this);
			}
			
			//if(dbm.singletons.dbmDebugManager) {
			//	dbm.singletons.dbmDebugManager.objectDestroyed(this.__fullClassName);
			//}
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "destroy", "Un error occured while destroying.");
			ErrorManager.getInstance().reportError(this, "destroy", theError);
		}
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		//this._setFunctionSavedThis(null); MENOTE: not implemented yet
		ClassReference.softDestroyArrayIfExists(this._destroyableObjects);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		ClassReference._reuseArray(this._destroyableObjects);
		this._destroyableObjects = null;
		
		ClassReference._reuseObject(this._dynamicVariables);
		this._dynamicVariables = null;
	};
	
	/**
	 * Checks if a variable is owned by this object. Part of the destroy function.
	 *
	 * @param	aName	The name of the variable.
	 *
	 * @return	Boolean	True if this object is the owner of a variable.
	 */
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		return true;
	};
	
	/**
	 * Override of native function toString.
	 *
	 * @return	String	Information about this object.
	 */
	objectFunctions.toString = function() {
		var attributesArray = new Array();
		this._toString_getAttributes(attributesArray);
		var attributesString = "";
		if(attributesArray.length > 0) {
			attributesString = " (" + attributesArray.join(", ") + ")";
		}
		var destroyedString = (this._isDestroyed) ? "*** Destroyed *** " : "";
		return "[" + destroyedString + this.__className + attributesString + "]";
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with the parameters description.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		//MENOTE: should be overridden
	};
	
	/**
	 * Releases an object from this ownership and detroys the object if it doesn't have any other retains.
	 *
	 * @param	aObject		The object to release/destroy.
	 */
	staticFunctions.softDestroyIfExists = function(aObject) {
		if(aObject !== null) {
			if(aObject.releaseAndDestroy !== undefined) {
				aObject.releaseAndDestroy();
			}
			else if(aObject.destroy !== undefined) {
				aObject.destroy();
			}
		}
	};
	
	/**
	 * Destroys an object if it exists.
	 *
	 * @param	aObject		BaseObject	The object to destroy or null/undefined.
	 */
	staticFunctions.destroyIfExists = function(aObject) {
		if(aObject !== null && aObject !== undefined) {
			aObject.destroy();
		}
	};
	
	/**
	 * Releases a retainable object and destroys if it doesn't have any other retainers.
	 *
	 * @param	aObject		The object to release or null/undefined.
	 */
	staticFunctions.releaseAndDestroyIfExists = function(aObject) {
		if(aObject !== null && aObject !== undefined) {
			aObject.releaseAndDestroy();
		}
	};
	
	/**
	 * Goes through an array and soft destroys every object.
	 *
	 * @param	aArray	Array	The array of objects to soft destroy.
	 */
	staticFunctions.softDestroyArrayIfExists = function(aArray) {
		if(aArray !== null) {
			var currentArray = aArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				ClassReference.softDestroyIfExists(currentObject);
				currentArray[i] = null;
			}
		}
	};
	
	/**
	 * Goes through an array and destroys every object.
	 *
	 * @param	aArray	Array	The array of objects to destroy.
	 */
	staticFunctions.destroyArrayIfExists = function(aArray) {
		if(aArray !== null) {
			var currentArray = aArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				if(currentObject && currentObject.destroy !== undefined) {
					currentObject.destroy();
				}
				currentArray[i] = null;
			}
		}
	};
	
	/**
	 * Goes through an array and releases every object.
	 *
	 * @param	aArray	Array	The array of objects to release and destroy.
	 */
	staticFunctions.releaseAndDestroyArrayIfExists = function(aArray) {
		if(aArray !== null) {
			var currentArray = aArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				if(currentObject.destroy !== undefined) {
					currentObject.releaseAndDestroy();
				}
				currentArray[i] = null;
			}
		}
	};
	
	/**
	 * Creates an instance of a class and calls the init function.
	 * Object pool is used if it is set up for the class.
	 *
	 * @param	aClass	Function	The constructor function.
	 *
	 * @return	*	The newly created object.
	 */
	staticFunctions._createAndInitClass = function(aClass) {
		//console.log("dbm.core.BaseObject::_createAndInitClass");
		//console.log(aClass);
		if(aClass.__objectPool) {
			return aClass.__objectPool.createAndInitObject();
		}
		var newClass = (new aClass());
		newClass.init();
		return newClass;
	};
	
	/**
	 * Creates a new array or reusing one if object pool is used.
	 *
	 * @return	Array	An empty array.
	 */
	staticFunctions._createArray = function() {
		if(dbm.singletons.dbmObjectPoolManager) {
			return dbm.singletons.dbmObjectPoolManager.createArray();
		}
		return new Array();
	};
	
	/**
	 * Creates a new object or reusing one if object pool is used.
	 *
	 * @return	Object	An empty object.
	 */
	staticFunctions._createObject = function() {
		if(dbm.singletons.dbmObjectPoolManager) {
			return dbm.singletons.dbmObjectPoolManager.createObject();
		}
		return new Object();
	};
	
	/**
	 * Marks an array to be reused by the object pool.
	 *
	 * @param	aArray	The array to reuse.
	 */
	staticFunctions._reuseArray = function(aArray) {
		if(dbm.singletons.dbmObjectPoolManager) {
			dbm.singletons.dbmObjectPoolManager.reuseArray(aArray);
		}
	};
	
	/**
	 * Marks an object to be reused by the object pool.
	 *
	 * @param	aObject	The object to reuse.
	 */
	staticFunctions._reuseObject = function(aObject) {
		if(dbm.singletons.dbmObjectPoolManager) {
			dbm.singletons.dbmObjectPoolManager.reuseObject(aObject);
		}
	};
});