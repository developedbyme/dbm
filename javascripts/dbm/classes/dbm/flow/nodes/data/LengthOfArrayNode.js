/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.data.LengthOfArrayNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.data.LengthOfArrayNode");

	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var LengthOfArrayNode = dbm.importClass("dbm.flow.nodes.data.LengthOfArrayNode");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.data.LengthOfArrayNode::_init");
		
		this.superCall();
		
		this._array = this.createProperty("array", null).setAlwaysUpdateFlow(true);
		this._length = this.createProperty("length", 0);
		
		this.createUpdateFunction("default", this._update, [this._array], [this._length]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.AdditionNode::_update");
		this._length.setValueWithFlow(this._array.getValueWithoutFlow().length, aFlowUpdateNumber);
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._array = null;
		this._length = null;
		
		this.superCall();
		
	};
	
	staticFunctions.create = function(aArray) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("array", aArray);
		return newNode;
	};
});