dbm.registerClass("com.developedbyme.core.globalobjects.debugmanager.DebugManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.debugmanager.DebugManager");
	
	var DebugManager = dbm.importClass("com.developedbyme.core.globalobjects.debugmanager.DebugManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var BaseObject = dbm.importClass("com.developedbyme.core.BaseObject");
	
	dbm.setClassAsSingleton("dbmDebugManager");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.debugmanager.DebugManager::init");
		
		this.superCall();
		
		this._isCheckingForDeletion = false;
		this._tempArray = new Array();
		
		return this;
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
				if(aObject[objectName] != null) {
					var currentType = typeof(aObject[objectName]);
					if(currentType == "object" && aObject[objectName] instanceof BaseObject && !aObject[objectName].isDestroyed() && aObject._internalFunctionality_ownsVariable(objectName)) {
						this._tempArray.push(objectName + ": " + aObject[objectName]);
					}
					else if(currentType == "object" && aObject[objectName] instanceof Array && aObject._internalFunctionality_ownsVariable(objectName)) {
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
				if(aObject[objectName] != null) {
					var currentType = typeof(aObject[objectName]);
					if(currentType == "object") {
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