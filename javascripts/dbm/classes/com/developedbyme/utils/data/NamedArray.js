dbm.registerClass("com.developedbyme.utils.data.NamedArray", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.NamedArray");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.data.NamedArray::init");
		
		this.superCall();
		
		this._objectsObject = new Object();
		this._objectsArray = new Array();
		this._namesArray = new Array();
		
		this.ownsObjects = false;
		
		this.currentSelectedItem = null;
		
		return this;
	};
	
	objectFunctions.getObjectsArray = function() {
		return this._objectsArray;
	};
	
	objectFunctions.getObjectsObject = function() {
		return this._objectsObject;
	};
	
	objectFunctions.getNamesArray = function() {
		return this._namesArray;
	};
	
	objectFunctions.addObject = function(aName, aObject) {
		if(aName == null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addObject", "Name is null.");
			return;
		}
		if(this._objectsObject[aName] != undefined) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "addObject", "Object " + aName + " already exists, replacing.");
			this.removeObject(aName);
		}
		this._objectsObject[aName] = aObject;
		this._objectsArray.push(aObject);
		this._namesArray.push(aName);
	};
	
	objectFunctions.select = function(aName) {
		if(this._objectsObject[aName] == undefined) {
			this.currentSelectedItem = null;
			return false;
		}
		this.currentSelectedItem = this._objectsObject[aName];
		return true;
	};
	
	objectFunctions.hasObject = function(aName) {
		return (this._objectsObject[aName] != undefined);
	};
	
	objectFunctions.getObject = function(aName) {
		//console.log("com.developedbyme.utils.data.NamedArray::getObject");
		if(this._objectsObject[aName] == undefined) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MINOR, this, "getObject", "Object " + aName + " doesn't exist.");
			return null;
		}
		return this._objectsObject[aName];
	};
	
	objectFunctions.removeObject = function(aName) {
		if(this._objectsObject[aName] == undefined) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MAJOR, this, "removeObject", "Object " + aName + " doesn't exist.");
			return;
		}
		var currentObject = this._objectsObject[aName];
		var currentArray = this._objectsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			if(currentArray[i] == currentObject) {
				currentArray.splice(i, 1);
				delete this._objectsObject[aName];
				break;
			}
		}
		var nameIndex = this._namesArray.indexOf(aName);
		if(nameIndex != -1) {
			this._namesArray.splice(nameIndex, 1);
		}

		if(this.currentSelectedItem == currentObject) {
			this.currentSelectedItem = null;
		}
	};
	
	objectFunctions.copy = function() {
		var copiedNamedArray = new NamedArray();
		
		var currentArray = this._objectsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			copiedNamedArray.addObject(this.identifyObject(currentArray[i]), currentArray[i]);
		}
		return copiedNamedArray;
	};
	
	objectFunctions.identifyObject = function(aObject) {
		for(var objectName in this._objectsObject) {
			if(this._objectsObject[objectName] == aObject) {
				return objectName;
			}
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "identifyObject", "Object " + aName + " doesn't exist.");
		return null;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("ownsObjects: " + this.ownsObjects);
		if(this._namesArray != null) {
			aReturnArray.push("properties: [" + this._namesArray + "]");
		}
	}
	
	objectFunctions.performDestroy = function() {
		
		if(this.ownsObjects) {
			ClassReference.softDestroyArrayIfExists(this._objectsArray);
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._objectsObject = null;
		this._objectsArray = null;
		this._namesArray = null;
		
		this.currentSelectedItem = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aOwnsObjects) {
		var newReaction = (new ClassReference()).init();
		newReaction.ownsObjects = VariableAliases.isTrue(aOwnsObjects);
		return newReaction;
	};
});