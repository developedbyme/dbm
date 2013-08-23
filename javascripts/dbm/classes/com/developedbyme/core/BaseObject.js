dbm.registerClass("com.developedbyme.core.BaseObject", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	//"use strict";
	
	var BaseObject = dbm.importClass("com.developedbyme.core.BaseObject");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function _init() {
		//console.log("com.developedbyme.core.BaseObject::_init");
		
		//this._setFunctionSavedThis(this); MENOTE: not implemented yet
		this._isDestroyed = false;
		this._destroyableObjects = null;
		
		//if(dbm.singletons.dbmDebugManager) {
		//	dbm.singletons.dbmDebugManager.objectCreated(this.__fullClassName);
		//}
		
		return this;
	};
	
	objectFunctions._initSeal = function _initSeal() {
		Object.seal(this);
	};
	
	objectFunctions.init = function init() {
		this._init();
		this._initSeal();
		return this;
	};
	
	objectFunctions.addDestroyableObject = function addDestroyableObject(aObject) {
		if(!(aObject instanceof BaseObject)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addDestroyableObject", "Object " + aObject + " is not a base object so it can't be destroyed by " + this + ".");
			return aObject;
		}
		
		if(this._destroyableObjects === null) {
			this._destroyableObjects = new Array();
		}
		this._destroyableObjects.push(aObject);
		
		return aObject;
	};
	
	objectFunctions.removeDestroyableObject = function removeDestroyableObject(aObject) {
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
	
	objectFunctions.getDestroyableObjectsArray = function getDestroyableObjectsArray() {
		if(this._destroyableObjects === null) {
			this._destroyableObjects = new Array();
		}
		return this._destroyableObjects;
	}
	
	objectFunctions.isDestroyed = function isDestroyed() {
		//console.log("com.developedbyme.core.BaseObject::isDestroyed");
		return this._isDestroyed;
	};
	
	objectFunctions.destroy = function destroy() {
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
			
			//if(dbm.singletons.dbmDebugManager) {
			//	dbm.singletons.dbmDebugManager.objectDestroyed(this.__fullClassName);
			//}
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "destroy", "Un error occured while destroying.");
			ErrorManager.getInstance().reportError(this, "destroy", theError);
		}
	};
	
	objectFunctions.performDestroy = function performDestroy() {
		//this._setFunctionSavedThis(null); MENOTE: not implemented yet
		ClassReference.softDestroyArrayIfExists(this._destroyableObjects);
	};
	
	objectFunctions.setAllReferencesToNull = function setAllReferencesToNull() {
		this._destroyableObjects = null;
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function _internalFunctionality_ownsVariable(aName) {
		return true;
	};
	
	objectFunctions.toString = function toString() {
		var attributesArray = new Array();
		this._toString_getAttributes(attributesArray);
		var attributesString = "";
		if(attributesArray.length > 0) {
			attributesString = " (" + attributesArray.join(", ") + ")";
		}
		var destroyedString = (this._isDestroyed) ? "*** Destroyed *** " : "";
		return "[" + destroyedString + this.__className + attributesString + "]";
	}
	
	objectFunctions._toString_getAttributes = function _toString_getAttributes(aReturnArray) {
		//MENOTE: should be overridden
	}
	
	staticFunctions.softDestroyIfExists = function softDestroyIfExists(aObject) {
		if(aObject !== null) {
			if(aObject.releaseAndDestroy !== undefined) {
				aObject.releaseAndDestroy();
			}
			else if(aObject.destroy !== undefined) {
				aObject.destroy();
			}
		}
	};
	
	staticFunctions.destroyIfExists = function destroyIfExists(aObject) {
		if(aObject !== null && aObject !== undefined) {
			aObject.destroy();
		}
	};
	
	staticFunctions.releaseAndDestroyIfExists = function releaseAndDestroyIfExists(aObject) {
		if(aObject !== null && aObject !== undefined) {
			aObject.releaseAndDestroy();
		}
	};
	
	staticFunctions.softDestroyArrayIfExists = function softDestroyArrayIfExists(aArray) {
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
	
	staticFunctions.destroyArrayIfExists = function destroyArrayIfExists(aArray) {
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
	
	staticFunctions.releaseAndDestroyArrayIfExists = function releaseAndDestroyArrayIfExists(aArray) {
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
});

dbm.extendClass("com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//MENOTE: this can't be strict since arguments.callee is not available then
	//MENOTE: no other function can be strict since arguments.callee.caller is not available then
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions.superCall = function superCall() {
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