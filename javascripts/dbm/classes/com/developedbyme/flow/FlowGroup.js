dbm.registerClass("com.developedbyme.flow.FlowGroup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.FlowGroup");
	//"use strict";
	
	var FlowGroup = dbm.importClass("com.developedbyme.flow.FlowGroup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var ObjectProperty = dbm.importClass("com.developedbyme.core.objectparts.ObjectProperty");
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.FlowGroup::_init");
		
		this.superCall();
		
		this._objectProperty = ObjectProperty.create(this);
		this._objectProperty.name = this.__className + "::object(o)";
		this.addDestroyableObject(this._objectProperty);
		this._inputProperties = NamedArray.create(true);
		this.addDestroyableObject(this._inputProperties);
		this._outputProperties = NamedArray.create(true);
		this.addDestroyableObject(this._outputProperties);
		
		//console.log("//com.developedbyme.flow.FlowGroup::_init");
		return this;
	};
	
	objectFunctions.createInputProperty = function(aName, aValue) {
		var newProperty = Property.create(this._objectProperty, aValue);
		newProperty.name = "input::" + aName;
		this._inputProperties.addObject(aName, newProperty);
		return newProperty;
	};
	
	objectFunctions.createOutputProperty = function(aName, aValue) {
		var newProperty = Property.create(this._objectProperty, aValue);
		newProperty.name = "output::" + aName;
		this._outputProperties.addObject(aName, newProperty);
		return newProperty;
	};
	
	objectFunctions.getInputProperty = function(aName) {
		if(this._inputProperties.select(aName)) {
			return this._inputProperties.currentSelectedItem;
		}
		ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "getInputProperty", "Input property " + aName + " doesn't exist. Creating.");
		return this.createInputProperty(aName, null);
	};
	
	objectFunctions.getOutputProperty = function(aName) {
		if(this._outputProperties.select(aName)) {
			return this._outputProperties.currentSelectedItem;
		}
		ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "getOutputProperty", "Output property " + aName + " doesn't exist. Creating.");
		return this.createOutputProperty(aName, null);
	};
	
	objectFunctions.setInputPropertyInput = function(aName, aInput) {
		if(!this._inputProperties.select(aName)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setPropertyInput", "Property " + aName + " doesn't exist.");
			return this;
		}
		if(aInput instanceof Property) {
			dbm.singletons.dbmFlowManager.connectProperties(aInput, this._inputProperties.currentSelectedItem);
		}
		else {
			this._inputProperties.currentSelectedItem.setValue(aInput);
		}
		return this;
	};
	
	objectFunctions.setInputPropertyInputWithoutNull = function(aName, aInput) {
		if(aInput != null) {
			this.setInputPropertyInput(aName, aInput);
		}
		return this;
	};
	
	objectFunctions.setOutputPropertyInput = function(aName, aInput) {
		if(!this._outputProperties.select(aName)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setOutputPropertyInput", "Property " + aName + " doesn't exist.");
			return this;
		}
		if(aInput instanceof Property) {
			dbm.singletons.dbmFlowManager.connectProperties(aInput, this._outputProperties.currentSelectedItem);
		}
		else {
			this._outputProperties.currentSelectedItem.setValue(aInput);
		}
		return this;
	};
	
	objectFunctions.setOutputPropertyInputWithoutNull = function(aName, aInput) {
		if(aInput != null) {
			this.setOutputPropertyInput(aName, aInput);
		}
		return this;
	};
	
	objectFunctions.getInputPropertiesNamedArray = function() {
		return this._inputProperties;
	};
	
	objectFunctions.getOutputPropertiesNamedArray = function() {
		return this._outputProperties;
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._objectProperty = null;
		this._inputProperties = null;
		this._outputProperties = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInputProperties, aOutputProperties) {
		//console.log("com.developedbyme.flow.FlowGroup::create (static)");
		var newGroup = (new ClassReference()).init();
		for(var objectName in aInputProperties) {
			newGroup.createInputProperty(objectName, null);
			newGroup.setInputPropertyInputWithoutNull(objectName, aInputProperties[objectName]);
		}
		for(var objectName in aOutputProperties) {
			newGroup.createOutputProperty(objectName, null);
			newGroup.setOutputPropertyInputWithoutNull(objectName, aOutputProperties[objectName]);
		}
		return newGroup;
	}
});