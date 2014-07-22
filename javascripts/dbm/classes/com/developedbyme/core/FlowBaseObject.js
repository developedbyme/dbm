/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.FlowBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.FlowBaseObject");
	//"use strict";
	
	var FlowBaseObject = dbm.importClass("com.developedbyme.core.FlowBaseObject");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	var GhostProperty = dbm.importClass("com.developedbyme.core.objectparts.GhostProperty");
	var UpdateFunction = dbm.importClass("com.developedbyme.core.objectparts.UpdateFunction");
	var UpdateFunctionWithArguments = dbm.importClass("com.developedbyme.core.objectparts.UpdateFunctionWithArguments");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var ObjectProperty = dbm.importClass("com.developedbyme.core.objectparts.ObjectProperty");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.FlowBaseObject::_init");
		
		this.superCall();
		
		this.__nodeId = (dbm.singletons.dbmIdManager) ? dbm.singletons.dbmIdManager.getNewId(this.__className) : this.__className;
		
		this._objectProperty = null;
		
		this._properties = this.addDestroyableObject(NamedArray.create(true));
		this._updateFunctions = this.addDestroyableObject(NamedArray.create(true));
		
		return this;
	};
	
	objectFunctions._createObjectProperty = function() {
		this._objectProperty = ObjectProperty.create(this);
		this._objectProperty.name = this.__nodeId + "::object(o)";
		this.addDestroyableObject(this._objectProperty);
		this._addObjectPropertyToAllProperties();
		this._objectProperty.setAsDirty();
	};
	
	objectFunctions._addObjectPropertyToAllProperties = function() {
		var currentArray = this._properties.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentProperty = currentArray[i];
			this._objectProperty._linkRegistration_addObjectProperty(currentProperty);
			currentProperty._linkRegistration_setObjectInputConnection(this._objectProperty);
		}
	};
	
	objectFunctions.getObjectProperty = function() {
		if(this._objectProperty === null) {
			this._createObjectProperty();
		}
		return this._objectProperty;
	};
	
	objectFunctions.getObjectPropertyIfExists = function() {
		return this._objectProperty;
	};
	
	objectFunctions.createUpdateFunction = function(aName, aUpdateFunction, aInputsArray, aOutputsArray) {
		var newUpdateFunction = UpdateFunction.create(this, aUpdateFunction, aInputsArray, aOutputsArray);
		newUpdateFunction.name = this.__nodeId + "::" + aName + "(f)";
		this._updateFunctions.addObject(aName, newUpdateFunction);
		return newUpdateFunction;
	};
	
	objectFunctions.createUpdateFunctionWithArguments = function(aName, aUpdateFunction, aInputsArray, aOutputsArray) {
		var newUpdateFunction = UpdateFunctionWithArguments.create(this, aUpdateFunction, aInputsArray, aOutputsArray);
		newUpdateFunction.name = this.__nodeId + "::" + aName + "(f)";
		this._updateFunctions.addObject(aName, newUpdateFunction);
		return newUpdateFunction;
	};
	
	objectFunctions.createGhostUpdateFunction = function(aName, aInputsArray, aOutputsArray) {
		var newUpdateFunction = UpdateFunction.createGhostFunction(aInputsArray, aOutputsArray);
		newUpdateFunction.name = this.__nodeId + "::" + aName + "(gf)";
		this._updateFunctions.addObject(aName, newUpdateFunction);
		return newUpdateFunction;
	};
	
	objectFunctions.createProperty = function(aName, aValue) {
		//console.log("com.developedbyme.core.FlowBaseObject::createProperty");
		//console.log(aName, aValue);
		var newProperty = Property.create(this._objectProperty, aValue);
		newProperty.name = this.__nodeId + "::" + aName;
		this._properties.addObject(aName, newProperty);
		return newProperty;
	};
	
	objectFunctions.addProperty = function(aName, aProperty) {
		//console.log("com.developedbyme.core.FlowBaseObject::addProperty");
		//console.log(aName, aProperty);
		aProperty.name = this.__nodeId + "::" + aName;
		this._properties.addObject(aName, aProperty);
		//console.log("//com.developedbyme.core.FlowBaseObject::addProperty");
		return aProperty;
	};
	
	objectFunctions.createGhostProperty = function(aName) {
		//console.log("com.developedbyme.core.FlowBaseObject::createGhostProperty");
		var newProperty = GhostProperty.create(this._objectProperty);
		newProperty.name = this.__nodeId + "::" + aName + "(g)";
		this._properties.addObject(aName, newProperty);
		return newProperty;
	};
	
	objectFunctions.getProperty = function(aName) {
		//console.log("com.developedbyme.core.FlowBaseObject::getProperty");
		//console.log(this, aName);
		if(this._properties !== null && this._properties.select(aName)) {
			return this._properties.currentSelectedItem;
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getProperty", "Property " + aName + " doesn't exist on " + this + ".");
		return null;
	};
	
	objectFunctions.getUpdateFunction = function(aName) {
		//console.log("com.developedbyme.core.FlowBaseObject::getUpdateFunction");
		//console.log(this, aName);
		if(this._updateFunctions.select(aName)) {
			return this._updateFunctions.currentSelectedItem;
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getUpdateFunction", "Update function " + aName + " doesn't exist on " + this + ".");
		return null;
	};
	
	objectFunctions.setPropertyInput = function(aName, aInput) {
		var theProperty = this.getProperty(aName);
		if(theProperty === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setPropertyInput", "Property " + aName + " doesn't exist.");
			return this;
		}
		dbm.singletons.dbmFlowManager.setPropertyInput(theProperty, aInput);
		return this;
	};
	
	objectFunctions.setPropertyInputWithoutNull = function(aName, aInput) {
		if(VariableAliases.isSet(aInput)) {
			this.setPropertyInput(aName, aInput);
		}
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		if(this._properties !== null && this._properties !== undefined) {
			aReturnArray.push("properties: [" + this._properties.getNamesArray().join(", ") + "]");
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._objectProperty = null;
		this._properties = null;
		this._updateFunctions = null;
		
		this.superCall();
	};
});