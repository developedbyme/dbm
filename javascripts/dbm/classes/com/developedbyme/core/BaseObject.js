/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.BaseObject", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	//"use strict";
	
	//Self reference
	var BaseObject = dbm.importClass("com.developedbyme.core.BaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	
	/**
	 * Consructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.BaseObject::_init");
		
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
		Object.seal(this);
	};
	
	/**
	 * Public constructor
	 *
	 * @return	self
	 */
	objectFunctions.init = function() {
		this._init();
		this._initSeal();
		return this;
	};
	
	objectFunctions.addDestroyableObject = function(aObject) {
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
	
	objectFunctions.getDestroyableObjectsArray = function() {
		if(this._destroyableObjects === null) {
			this._destroyableObjects = new Array();
		}
		return this._destroyableObjects;
	};
	
	objectFunctions.setDynamicVariable = function(aName, aData) {
		if(this._dynamicVariables === null) {
			this._dynamicVariables = ClassReference._createObject();
		}
		this._dynamicVariables[aName] = aData;
		
		return aData;
	};
	
	objectFunctions.removeDynamicVariable = function(aName) {
		if(this._dynamicVariables === null) return;
		delete this._dynamicVariables[aName];
		
		return this;
	};
	
	objectFunctions.getDynamicVariable = function(aName) {
		if(this._dynamicVariables === null || this._dynamicVariables[aName] === undefined) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getDynamicVariable", "Object " + this + " doesn't have dynamic variable " + aName + ".");
			return null;
		}
		return this._dynamicVariables[aName];
	};
	
	objectFunctions.hasDynamicVariable = function(aName) {
		return (this._dynamicVariables !== null && this._dynamicVariables[aName] !== undefined);
	};
	
	objectFunctions.isDestroyed = function() {
		//console.log("com.developedbyme.core.BaseObject::isDestroyed");
		return this._isDestroyed;
	};
	
	/**
	 * Destroys the object
	 */
	objectFunctions.destroy = function() {
		//console.log("com.developedbyme.core.BaseObject::destroy");
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
	
	staticFunctions.destroyIfExists = function(aObject) {
		if(aObject !== null && aObject !== undefined) {
			aObject.destroy();
		}
	};
	
	staticFunctions.releaseAndDestroyIfExists = function(aObject) {
		if(aObject !== null && aObject !== undefined) {
			aObject.releaseAndDestroy();
		}
	};
	
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
	
	staticFunctions._createAndInitClass = function(aClass) {
		//console.log("com.developedbyme.core.BaseObject::_createAndInitClass");
		//console.log(aClass);
		if(aClass.__objectPool) {
			return aClass.__objectPool.createAndInitObject();
		}
		return (new aClass()).init();
	};
	
	staticFunctions._createArray = function() {
		if(dbm.singletons.dbmObjectPoolManager) {
			return dbm.singletons.dbmObjectPoolManager.createArray();
		}
		return new Array();
	};
	
	staticFunctions._createObject = function() {
		if(dbm.singletons.dbmObjectPoolManager) {
			return dbm.singletons.dbmObjectPoolManager.createObject();
		}
		return new Object();
	};
	
	staticFunctions._reuseArray = function(aArray) {
		if(dbm.singletons.dbmObjectPoolManager) {
			dbm.singletons.dbmObjectPoolManager.reuseArray(aArray);
		}
	};
	
	staticFunctions._reuseObject = function(aObject) {
		if(dbm.singletons.dbmObjectPoolManager) {
			dbm.singletons.dbmObjectPoolManager.reuseObject(aObject);
		}
	};
});

dbm.extendClass("com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//MENOTE: this can't be strict since arguments.callee is not available then
	//MENOTE: no other function can be strict since arguments.callee.caller is not available then
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions.superCall = function() {
		//console.log("com.developedbyme.core.BaseObject::superCall");
		
		var callerFunction = arguments.callee.caller;
		
		var superFunction = callerFunction["superFunction"];
		
		if(superFunction !== undefined) {
			return superFunction.apply(this, arguments);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "superCall", "Function " + callerFunction + " doesn't have a super function.");
		}
	};
});