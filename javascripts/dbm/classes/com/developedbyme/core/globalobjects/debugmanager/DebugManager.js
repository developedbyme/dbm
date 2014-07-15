/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.debugmanager.DebugManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.debugmanager.DebugManager");
	
	//Self reference
	var DebugManager = dbm.importClass("com.developedbyme.core.globalobjects.debugmanager.DebugManager");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var BaseObject = dbm.importClass("com.developedbyme.core.BaseObject");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	//Utils
	
	//Constants
	
	dbm.setClassAsSingleton("dbmDebugManager");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.debugmanager.DebugManager::_init");
		
		this.superCall();
		
		this._isCheckingForDeletion = false;
		this._tempArray = new Array();
		this._objectCount = NamedArray.create(true);
		
		return this;
	};
	
	objectFunctions.objectCreated = function(aType) {
		//console.log("com.developedbyme.core.globalobjects.debugmanager.DebugManager::objectCreated");
		if(!this._objectCount.hasObject(aType)) {
			this._objectCount.addObject(aType, 0);
		}
		this._objectCount.replaceObject(aType, this._objectCount.getObject(aType)+1);
	};
	
	objectFunctions.objectDestroyed = function(aType) {
		//console.log("com.developedbyme.core.globalobjects.debugmanager.DebugManager::objectDestroyed");
		if(!this._objectCount.hasObject(aType)) {
			this._objectCount.addObject(aType, 0);
		}
		this._objectCount.replaceObject(aType, this._objectCount.getObject(aType)-1);
	};
	
	objectFunctions.printNumberOfCreatedObjects = function() {
		console.log("com.developedbyme.core.globalobjects.debugmanager.DebugManager::printNumberOfCreatedObjects");
		
		var totalNumberOfItems = 0;
		var itemsString = "";
		var currentArray = this._objectCount.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentNumberOfItems = this._objectCount.getObject(currentArray[i]);
			itemsString += currentArray[i] + ": " + currentNumberOfItems + "\n";
			totalNumberOfItems += currentNumberOfItems;
		}
		
		var returnString = "Total: " + totalNumberOfItems + "\n" + itemsString;
		console.log(returnString);
	};
	
	objectFunctions.setCheckForDeletion = function(aCheck) {
		//console.log("com.developedbyme.core.globalobjects.debugmanager.DebugManager::setCheckForDeletion");
		
		this._isCheckingForDeletion = aCheck;
	};
	
	objectFunctions.checkThatObjectIsDestroyed = function(aObject) {
		//console.log("com.developedbyme.core.globalobjects.debugmanager.DebugManager::checkThatObjectIsDestroyed");
		//console.log(aObject)
		
		if(this._isCheckingForDeletion) {
			for(var objectName in aObject) {
				if(aObject[objectName] !== null && objectName !== "__objectPool") {
					var currentType = typeof(aObject[objectName]);
					if(currentType === "object" && aObject[objectName] instanceof BaseObject && !aObject[objectName].isDestroyed() && aObject._internalFunctionality_ownsVariable(objectName)) {
						this._tempArray.push(objectName + ": " + aObject[objectName]);
					}
					else if(currentType === "object" && aObject[objectName] instanceof Array && aObject._internalFunctionality_ownsVariable(objectName)) {
						var currentArray = aObject[objectName];
						var currentArrayLength = currentArray.length;
						for(var i = 0; i < currentArrayLength; i++) {
							if(aObject[objectName] instanceof BaseObject && !aObject[objectName].isDestroyed()) {
								this._tempArray.push(objectName + "["+ i + "]: " + aObject[objectName]);
							}
						}
					}
				}
			}
			if(this._tempArray.length > 0) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "checkThatObjectIsDestroyed", "Object " + aObject + " still have undestroyed properties (" + this._tempArray.join("; ") + ").");
				this._tempArray.splice(0, this._tempArray.length);
			}
		}
	};
	
	objectFunctions.checkThatObjectHasNoReferences = function(aObject) {
		//console.log("com.developedbyme.core.globalobjects.debugmanager.DebugManager::checkThatObjectHasNoReferences");
		
		if(this._isCheckingForDeletion) {
			for(var objectName in aObject) {
				if(aObject[objectName] !== null && objectName !== "__objectPool") {
					var currentType = typeof(aObject[objectName]);
					if(currentType === "object") {
						this._tempArray.push(objectName + ": " + aObject[objectName]);
					}
				}
			}
			if(this._tempArray.length > 0) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "checkThatObjectHasNoReferences", "Object " + aObject + " still have references (" + this._tempArray.join("; ") + ").");
				this._tempArray.splice(0, this._tempArray.length);
			}
		}
	};
});