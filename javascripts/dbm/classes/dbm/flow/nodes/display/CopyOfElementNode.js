/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.display.CopyOfElementNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.display.CopyOfElementNode");
	
	var CopyOfElementNode = dbm.importClass("dbm.flow.nodes.display.CopyOfElementNode");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.display.CopyOfElementNode::_init");
		
		this.superCall();
		
		this._inputElement = this.createProperty("inputElement", null);
		this._outputElement = this.createProperty("outputElement", null);
		
		this.createUpdateFunction("default", this._update, [this._inputElement], [this._outputElement]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.display.CopyOfElementNode::_update");
		
		var htmlElement = this._inputElement.getValueWithoutFlow();
		this._outputElement.setValueWithFlow(htmlElement.cloneNode(true), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputElement = null;
		this._outputElement = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputElement", aElement);
		return newNode;
	};
});