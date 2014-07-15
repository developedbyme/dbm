/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.data.LastValidValueNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.data.LastValidValueNode");
	//"use strict";
	
	//Self reference
	var LastValidValueNode = dbm.importClass("com.developedbyme.flow.nodes.data.LastValidValueNode");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.data.LastValidValueNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", null);
		this._validValues = this.createProperty("validValues", new Array());
		this._outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunction("default", this._update, [this._inputValue, this._validValues], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.data.LastValidValueNode::_update");
		
		var inputValue = this._inputValue.getValueWithoutFlow();
		var validValues = this._validValues.getValueWithoutFlow();
		if(ArrayFunctions.indexOfInArray(validValues, inputValue) !== -1) {
			this._outputValue.setValueWithFlow(inputValue, aFlowUpdateNumber);
		}
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue = null;
		this._validValues = null;
		this._outputValue = null;
		
		this.superCall();
		
	};
	
	staticFunctions.create = function(aInputValue, aValidValues) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInputValue);
		newNode.setPropertyInputWithoutNull("validValues", aValidValues);
		return newNode;
	};
});