/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.data.ValueInArrayNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.data.ValueInArrayNode");
	//"use strict";
	
	//Self reference
	var ValueInArrayNode = dbm.importClass("dbm.flow.nodes.data.ValueInArrayNode");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.data.ValueInArrayNode::_init");
		
		this.superCall();
		
		this._index = this.createProperty("index", -1);
		this._array = this.createProperty("array", null).setAlwaysUpdateFlow(true);
		this._outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunction("default", this._update, [this._array, this._index], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.data.ValueInArrayNode::_update");
		
		var currentIndex = this._index.getValueWithoutFlow();
		var newValue = null;
		if(currentIndex !== -1) {
			newValue = this._array.getValueWithoutFlow()[currentIndex];
		}
		
		this._outputValue.setValueWithFlow(newValue, aFlowUpdateNumber);
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._index = null;
		this._array = null;
		this._outputValue = null;
		
		this.superCall();
		
	};
	
	staticFunctions.create = function(aArray, aIndex) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("array", aArray);
		newNode.setPropertyInputWithoutNull("index", aIndex);
		return newNode;
	};
});