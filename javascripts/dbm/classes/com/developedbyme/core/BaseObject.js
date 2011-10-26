dbm.registerClass("com.developedbyme.core.BaseObject", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	var BaseObject = dbm.importClass("com.developedbyme.core.BaseObject");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.BaseObject::init");
		
		//this._setFunctionSavedThis(this); MENOTE: not implemented yet
		this._isDestroyed = false;
		this._destroyableObjects = null;
		
		return this;
	};
	
	objectFunctions.addDestroyableObject = function(aObject) {
		if(!(aObject instanceof BaseObject)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addDestroyableObject", "Object " + aObject + " is not a base object so it can't be destroyed by " + this + ".");
			return aObject;
		}
		
		if(this._destroyableObjects == null) {
			this._destroyableObjects = new Array();
		}
		this._destroyableObjects.push(aObject);
		
		return aObject;
	};
	
	objectFunctions.removeDestroyableObject = function(aObject) {
		if(this._destroyableObjects != null) {
			var objectIndex = ArrayFunctions.indexOfInArray(this._destroyableObjects, aObject);
			if(objectIndex != -1) {
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
	
	objectFunctions.isDestroyed = function() {
		//console.log("com.developedbyme.core.BaseObject::isDestroyed");
		return this._isDestroyed;
	};
	
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
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "destroy", "Un error occured while destroying.");
			ErrorManager.getInstance().reportError(this, "destroy", theError);
		}
	};
	
	objectFunctions.performDestroy = function() {
		//this._setFunctionSavedThis(null); MENOTE: not implemented yet
		ClassReference.softDestroyArrayIfExists(this._destroyableObjects);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this._destroyableObjects = null;
	};
	
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
	}
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		//MENOTE: should be overridden
	}
	
	objectFunctions.superCall = function() {
		//console.log("com.developedbyme.core.BaseObject::superCall");
		
		var callerFunction = arguments.callee.caller;
		
		var superFunction = callerFunction["superFunction"];
		
		if(superFunction != undefined) {
			return superFunction.apply(this, arguments);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "superCall", "Function " + callerFunction + " doesn't have a super function.");
		}
	};
	
	staticFunctions.softDestroyIfExists = function(aObject) {
		if(aObject != null) {
			if(aObject.releaseAndDestroy != undefined) {
				aObject.releaseAndDestroy();
			}
			else if(aObject.destroy != undefined) {
				aObject.destroy();
			}
		}
	};
	
	staticFunctions.destroyIfExists = function(aObject) {
		if(aObject != null) {
			aObject.destroy();
		}
	};
	
	staticFunctions.releaseAndDestroyIfExists = function(aObject) {
		if(aObject != null) {
			aObject.releaseAndDestroy();
		}
	};
	
	staticFunctions.softDestroyArrayIfExists = function(aArray) {
		if(aArray != null) {
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
		if(aArray != null) {
			var currentArray = aArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				if(currentObject && currentObject.destroy != undefined) {
					currentObject.destroy();
				}
				currentArray[i] = null;
			}
		}
	};
	
	staticFunctions.releaseAndDestroyArrayIfExists = function(aArray) {
		if(aArray != null) {
			var currentArray = aArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				if(currentObject.destroy != undefined) {
					currentObject.releaseAndDestroy();
				}
				currentArray[i] = null;
			}
		}
	};
});