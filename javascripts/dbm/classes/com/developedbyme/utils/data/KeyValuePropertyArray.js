dbm.registerClass("com.developedbyme.utils.data.KeyValuePropertyArray", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.KeyValuePropertyArray");
	//"use strict";
	
	var KeyValuePropertyArray = dbm.importClass("com.developedbyme.utils.data.KeyValuePropertyArray");
	
	var KeyValuePropertyPair = dbm.importClass("com.developedbyme.flow.data.KeyValuePropertyPair");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.KeyValuePropertyArray::_init");
		
		this.superCall();
		
		this._objectsArray = new Array();
		this._namesArray = this.createProperty("namesArray", new Array());
		
		this._nameChangeProperty = this.addProperty("nameChange", AnyChangeMultipleInputProperty.create(this._objectProperty));
		this._anyChangeProperty = this.addProperty("anyChange", AnyChangeMultipleInputProperty.create(this._objectProperty));
		
		this.createUpdateFunction("updateNamesArray", this._updateNamesArray, [this._nameChangeProperty], [this._namesArray]);
		
		this.ownsObjects = false;
		
		this.currentSelectedItem = null;
		
		return this;
	};
	
	objectFunctions.getObjectsArray = function() {
		return this._objectsArray;
	};
	
	objectFunctions.getObjectsObject = function() {
		//MENOTE: should this be implemented
		return null;
	};
	
	objectFunctions.getNamesArray = function() {
		return this._namesArray.getValue();
	};
	
	objectFunctions.addObject = function(aName, aObject) {
		if(aName == null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addObject", "Name is null for object" + aObject + ".");
			return;
		}
		if(false) { //METODO: check if object already exists
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "addObject", "Object " + aName + " (" + this._objectsObject[aName] + ") already exists, replacing with " + aObject + ".");
			this.removeObject(aName);
		}
		
		var newKeyValuePair = KeyValuePropertyPair.create(aName, aObject);
		
		this._objectsArray.push(newKeyValuePair);
		
		this._anyChangeProperty.connectInput(newKeyValuePair.keyValue);
		this._anyChangeProperty.connectInput(newKeyValuePair.dataValue);
		
		this._nameChangeProperty.connectInput(newKeyValuePair.keyValue);
	};
	
	objectFunctions.replaceObject = function(aName, aObject) {
		if(aName == null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "replaceObject", "Name is null for object" + aObject + ".");
			return;
		}
		if(true) {  //METODO: check if object already exists
			this.removeObject(aName);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "replaceObject", "Object " + aName + " (" + this._objectsObject[aName] + ") doesn't exist.");
		}
		
		var newKeyValuePair = KeyValuePropertyPair.create(aName, aObject);
		
		this._objectsArray.push(newKeyValuePair);
		
		this._anyChangeProperty.connectInput(newKeyValuePair.keyValue);
		this._anyChangeProperty.connectInput(newKeyValuePair.dataValue);
		
		this._nameChangeProperty.connectInput(newKeyValuePair.keyValue);
		
	};

	objectFunctions.addObjectToBeginning = function(aName, aObject) {
		if(aName == null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addObject", "Name is null for object" + aObject + ".");
			return;
		}
		if(false) { //METODO: check if object already exists
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "addObject", "Object " + aName + " (" + this._objectsObject[aName] + ") already exists, replacing with " + aObject + ".");
			this.removeObject(aName);
		}
		
		var newKeyValuePair = KeyValuePropertyPair.create(aName, aObject);
		
		this._objectsArray.unshift(newKeyValuePair);
		
		this._anyChangeProperty.connectInput(newKeyValuePair.keyValue);
		this._anyChangeProperty.connectInput(newKeyValuePair.dataValue);
		
		this._nameChangeProperty.connectInput(newKeyValuePair.keyValue);
		
	};
	
	objectFucntion._getObjectIndexByName = function(aName) {
		return ArrayFunctions.indexOfInArray(this._namesArray.getValue(), aName);
	};
	
	objectFunctions.select = function(aName) {
		var currentIndex = this._getObjectIndexByName(aName);
		if(currentIndex == -1) {
			this.currentSelectedItem = null;
			return false;
		}
		this.currentSelectedItem = this._objectsArray[currentIndex];
		return true;
	};
	
	objectFunctions.hasObject = function(aName) {
		var currentIndex = this._getObjectIndexByName(aName);
		return (currentIndex != -1);
	};
	
	objectFunctions.getObject = function(aName) {
		//console.log("com.developedbyme.utils.data.KeyValuePropertyArray::getObject");
		var currentIndex = this._getObjectIndexByName(aName);
		if(currentIndex == -1) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MINOR, this, "getObject", "Object " + aName + " doesn't exist.");
			return null;
		}
		return this._objectsArray[currentIndex];
	};
	
	objectFunctions.removeObject = function(aName) {
		var currentIndex = this._getObjectIndexByName(aName);
		if(currentIndex == -1) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.MAJOR, this, "removeObject", "Object " + aName + " doesn't exist.");
			return;
		}
		var currentObject = this._objectsArray[currentIndex];
		this._objectsArray.splice(currentIndex, 1);
		
		this._anyChangeProperty.disconnectInput(currentObject.keyValue);
		this._anyChangeProperty.disconnectInput(currentObject.dataValue);
		
		this._nameChangeProperty.disconnectInput(currentObject.keyValue);
		this._nameChangeProperty.setAsDirty();
		
		if(this.currentSelectedItem == currentObject) {
			this.currentSelectedItem = null;
		}
	};
	
	objectFunctions.copy = function() {
		//MENOTE: this doesn't copy input connections
		var copiedKeyValuePropertyArray = new KeyValuePropertyArray();
		
		var currentArray = this._objectsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			var currentObject = currentArray[i];
			copiedKeyValuePropertyArray.addObject(currentObject.keyValue.getValue(), currentObject.dataValue.getValue());
		}
		return copiedKeyValuePropertyArray;
	};
	
	objectFunctions.identifyObject = function(aObject) {
		
		var curentArray = this._objectsArray;
		var currentArrayLength = curentArray.length;
		
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.dataValue.getValue() == aObject) {
				return currentObject.keyValue.getValue()
			}
		};
		
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "identifyObject", "Object " + aObject + " doesn't exist.");
		return null;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("ownsObjects: " + this.ownsObjects);
		if(this._namesArray != null) {
			aReturnArray.push("properties: [" + this._namesArray.getValue() + "]");
		}
	}
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "currentSelectedItem":
				return false;
			case "_objectsObject":
			case "_objectsObject":
				return this.ownsObjects;
		}
		return this.superCall(aName);
	};
	
	objectFunctions.performDestroy = function() {
		
		if(this.ownsObjects) {
			ClassReference.softDestroyArrayIfExists(this._objectsArray);
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
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