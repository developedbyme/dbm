/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.data.ObjectVariableWithDefaultValueNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.data.ObjectVariableWithDefaultValueNode");
	//"use strict";
	
	//Self reference
	var ObjectVariableWithDefaultValueNode = dbm.importClass("dbm.flow.nodes.data.ObjectVariableWithDefaultValueNode");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.data.ObjectVariableWithDefaultValueNode::_init");
		
		this.superCall();
		
		this._variableName = this.createProperty("variableName", null);
		this._object = this.createProperty("object", null).setAlwaysUpdateFlow(true);
		this._defaultValue = this.createProperty("defaultValue", null);
		this._outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunction("default", this._update, [this._object, this._variableName, this._defaultValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.data.ObjectVariableWithDefaultValueNode::_update");
		
		var theObject = this._object.getValueWithoutFlow();
		var variableName = this._variableName.getValueWithoutFlow();
		var newValue = this._defaultValue.getValueWithoutFlow();
		if(VariableAliases.isSet(theObject) && VariableAliases.isSet(variableName) && VariableAliases.isSet(theObject[variableName])) {
			newValue = theObject[variableName];
		}
		
		this._outputValue.setValueWithFlow(newValue, aFlowUpdateNumber);
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._variableName = null;
		this._object = null;
		this._defaultValue = null;
		this._outputValue = null;
		
		this.superCall();
		
	};
	
	staticFunctions.create = function(aObject, aVariableName, aDefaultValue) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("object", aObject);
		newNode.setPropertyInputWithoutNull("variableName", aVariableName);
		newNode.setPropertyInputWithoutNull("defaultValue", aDefaultValue);
		return newNode;
	};
});