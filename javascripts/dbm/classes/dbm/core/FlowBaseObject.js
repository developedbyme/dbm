/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for objects that are using properites to flow updates through the application.
 */
dbm.registerClass("dbm.core.FlowBaseObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.FlowBaseObject");
	//"use strict";
	
	//Self reference
	var FlowBaseObject = dbm.importClass("dbm.core.FlowBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var Property = dbm.importClass("dbm.core.objectparts.Property");
	var GhostProperty = dbm.importClass("dbm.core.objectparts.GhostProperty");
	var UpdateFunction = dbm.importClass("dbm.core.objectparts.UpdateFunction");
	var UpdateFunctionWithArguments = dbm.importClass("dbm.core.objectparts.UpdateFunctionWithArguments");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.FlowBaseObject::_init");
		
		this.superCall();
		
		this.__nodeId = (dbm.singletons.dbmIdManager) ? dbm.singletons.dbmIdManager.getNewId(this.__className) : this.__className;
		
		this._properties = this.addDestroyableObject(NamedArray.create(true));
		this._updateFunctions = this.addDestroyableObject(NamedArray.create(true));
		
		return this;
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
	
	/**
	 * Creates (and adds) a property on this object.
	 *
	 * @param	aName	String	The name of the property.
	 * @param	aValue	*		The value that the property should have.
	 *
	 * @return	Property	The newly created property.
	 */
	objectFunctions.createProperty = function(aName, aValue) {
		//console.log("dbm.core.FlowBaseObject::createProperty");
		//console.log(aName, aValue);
		var newProperty = Property.create(aValue);
		newProperty.name = this.__nodeId + "::" + aName;
		this._properties.addObject(aName, newProperty);
		return newProperty;
	};
	
	/**
	 * Adds a property to this object.
	 *
	 * @param	aName		String		The name of the property.
	 * @param	aProperty	Property	The property to add.
	 *
	 * @return	Property	The property that is passed in.
	 */
	objectFunctions.addProperty = function(aName, aProperty) {
		//console.log("dbm.core.FlowBaseObject::addProperty");
		//console.log(aName, aProperty);
		aProperty.name = this.__nodeId + "::" + aName;
		this._properties.addObject(aName, aProperty);
		//console.log("//dbm.core.FlowBaseObject::addProperty");
		return aProperty;
	};
	
	/**
	 * Creates (and adds) a ghost property (a property without value) on this object.
	 *
	 * @param	aName	String	The name of the property.
	 *
	 * @return	GhostProperty	The newly created property.
	 */
	objectFunctions.createGhostProperty = function(aName) {
		//console.log("dbm.core.FlowBaseObject::createGhostProperty");
		var newProperty = GhostProperty.create();
		newProperty.name = this.__nodeId + "::" + aName + "(g)";
		this._properties.addObject(aName, newProperty);
		return newProperty;
	};
	
	/**
	 * Gets a property by name.
	 *
	 * @param	aName	String	The name of the property.
	 *
	 * @return	Property	The property that matches the name. Null if property doesn't exist.
	 */
	objectFunctions.getProperty = function(aName) {
		//console.log("dbm.core.FlowBaseObject::getProperty");
		//console.log(this, aName);
		if(this._properties !== null && this._properties.select(aName)) {
			return this._properties.currentSelectedItem;
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getProperty", "Property " + aName + " doesn't exist on " + this + ".");
		return null;
	};
	
	/**
	 * Checks if a property exists.
	 *
	 * @param	aName	String	The name of the property.
	 *
	 * @return	Boolean	True if property exist.
	 */
	objectFunctions.hasProperty = function(aName) {
		//console.log("dbm.core.FlowBaseObject::hasProperty");
		//console.log(this, aName);
		return (this._properties !== null && this._properties.select(aName));
	};
	
	/**
	 * Gets an update function on this object.
	 *
	 * @param	aName	String	The name of the update function to get.
	 *
	 * @return	UpdateFunction	The update function that matches the name. Null if update function doesn't exist.
	 */
	objectFunctions.getUpdateFunction = function(aName) {
		//console.log("dbm.core.FlowBaseObject::getUpdateFunction");
		//console.log(this, aName);
		if(this._updateFunctions.select(aName)) {
			return this._updateFunctions.currentSelectedItem;
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getUpdateFunction", "Update function " + aName + " doesn't exist on " + this + ".");
		return null;
	};
	
	/**
	 * Set the value to a property, or connects the input if it is a property.
	 *
	 * @param	aName	String		The name of the property to set.
	 * @param	aInput	Property|*	The value to set or the property to connect.
	 *
	 * @return	self
	 */
	objectFunctions.setPropertyInput = function(aName, aInput) {
		var theProperty = this.getProperty(aName);
		if(theProperty === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setPropertyInput", "Property " + aName + " doesn't exist.");
			return this;
		}
		dbm.singletons.dbmFlowManager.setPropertyInput(theProperty, aInput);
		return this;
	};
	
	/**
	 * Set the value to a property, or connects the input if it is a property. Current value is not overridden if input is null/undefined.
	 *
	 * @param	aName	String		The name of the property to set.
	 * @param	aInput	Property|*	The value to set or the property to connect.
	 *
	 * @return	self
	 */
	objectFunctions.setPropertyInputWithoutNull = function(aName, aInput) {
		if(VariableAliases.isSet(aInput)) {
			this.setPropertyInput(aName, aInput);
		}
		return this;
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with the parameters description.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		if(this._properties !== null && this._properties !== undefined) {
			aReturnArray.push("properties: [" + this._properties.getNamesArray().join(", ") + "]");
		}
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._properties = null;
		this._updateFunctions = null;
		
		this.superCall();
	};
});