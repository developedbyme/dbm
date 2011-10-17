dbm.registerClass("com.developedbyme.core.FlowBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.FlowBaseObject");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	var GhostProperty = dbm.importClass("com.developedbyme.core.objectparts.GhostProperty");
	var UpdateFunction = dbm.importClass("com.developedbyme.core.objectparts.UpdateFunction");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var ObjectProperty = dbm.importClass("com.developedbyme.core.objectparts.ObjectProperty");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.FlowBaseObject::init");
		
		this.superCall();
		
		this._objectProperty = ObjectProperty.create(this, false);
		this._objectProperty = this.__className + "::object(o)";
		this.addDestroyableObject(this._objectProperty);
		this._properties = (new NamedArray()).init();
		this._properties.ownsObjects = true;
		this.addDestroyableObject(this._properties);
		this._updateFunctions = (new NamedArray()).init();
		this._updateFunctions.ownsObjects = true;
		this.addDestroyableObject(this._updateFunctions);
		
		return this;
	};
	
	objectFunctions.createUpdateFunction = function(aName, aUpdateFunction, aInputsArray, aOutputsArray) {
		var newUpdateFunction = UpdateFunction.create(this, aUpdateFunction, aInputsArray, aOutputsArray);
		newUpdateFunction.name = this.__className + "::" + aName + "(f)";
		this._updateFunctions.addObject(aName, newUpdateFunction);
		return newUpdateFunction;
	}
	
	objectFunctions.createGhostUpdateFunction = function(aName, aInputsArray, aOutputsArray) {
		var newUpdateFunction = UpdateFunction.createGhostFunction(aInputsArray, aOutputsArray);
		newUpdateFunction.name = this.__className + "::" + aName + "(gf)";
		this._updateFunctions.addObject(aName, newUpdateFunction);
		return newUpdateFunction;
	}
	
	objectFunctions.createProperty = function(aName, aValue) {
		//console.log("com.developedbyme.core.FlowBaseObject::createProperty");
		//console.log(aName, aValue);
		var newProperty = Property.create(this._objectProperty, aValue);
		newProperty.name = this.__className + "::" + aName;
		this._properties.addObject(aName, newProperty);
		return newProperty;
	};
	
	objectFunctions.addProperty = function(aName, aProperty) {
		//console.log("com.developedbyme.core.FlowBaseObject::addProperty");
		//console.log(aName, aProperty);
		aProperty.name = this.__className + "::" + aName;
		this._properties.addObject(aName, aProperty);
		//console.log("//com.developedbyme.core.FlowBaseObject::addProperty");
		return aProperty;
	};
	
	objectFunctions.createGhostProperty = function(aName) {
		//console.log("com.developedbyme.core.FlowBaseObject::createGhostProperty");
		var newProperty = GhostProperty.create(this._objectProperty);
		newProperty.name = this.__className + "::" + aName + "(g)";
		this._properties.addObject(aName, newProperty);
		return newProperty;
	};
	
	objectFunctions.getProperty = function(aName) {
		//console.log("com.developedbyme.core.FlowBaseObject::getProperty");
		//console.log(this, aName);
		if(this._properties.select(aName)) {
			return this._properties.currentSelectedItem;
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getProperty", "Property " + aName + " doesn't exist on " + this + ".");
		return null;
	};
	
	objectFunctions.setPropertyInput = function(aName, aInput) {
		if(!this._properties.select(aName)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setPropertyInput", "Property " + aName + " doesn't exist.");
			return this;
		}
		if(aInput instanceof Property) {
			dbm.singletons.dbmFlowManager.connectProperties(aInput, this._properties.currentSelectedItem);
		}
		else {
			this._properties.currentSelectedItem.setValue(aInput);
		}
		return this;
	};
	
	objectFunctions.setPropertyInputWithoutNull = function(aName, aInput) {
		if(aInput != null) {
			this.setPropertyInput(aName, aInput);
		}
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		if(this._properties != null) {
			aReturnArray.push("properties: [" + this._properties.getNamesArray() + "]");
		}
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._objectProperty = null;
		this._properties = null;
		this._updateFunctions = null;
		
		this.superCall();
	};
});