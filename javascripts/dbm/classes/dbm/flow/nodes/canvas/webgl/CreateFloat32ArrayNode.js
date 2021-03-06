/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.canvas.webgl.CreateFloat32ArrayNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.canvas.webgl.CreateFloat32ArrayNode");
	
	var CreateFloat32ArrayNode = dbm.importClass("dbm.flow.nodes.canvas.webgl.CreateFloat32ArrayNode");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.canvas.webgl.CreateFloat32ArrayNode::_init");
		
		this.superCall();
		
		this._inputArray = this.createProperty("inputArray", null);
		this._inputArray.setAlwaysUpdateFlow(true);
		this._outputArray = this.createProperty("outputArray", null);
		
		this.createUpdateFunction("default", this._update, [this._inputArray], [this._outputArray]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.canvas.webgl.CreateFloat32ArrayNode::_update");
		
		this._inputArray.setValueWithFlow(new Float32Array(this._outputArray.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputArray = null;
		this._outputArray = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInputArray) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputArray", aInputArray);
		return newNode;
	};
});