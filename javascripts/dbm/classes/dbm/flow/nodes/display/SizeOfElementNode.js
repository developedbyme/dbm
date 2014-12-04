/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.display.SizeOfElementNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.display.SizeOfElementNode");
	//"use strict";
	
	//Self reference
	var SizeOfElementNode = dbm.importClass("dbm.flow.nodes.display.SizeOfElementNode");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var LayoutChangeNode = dbm.importClass("dbm.flow.nodes.browser.LayoutChangeNode");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.display.SizeOfElementNode::_init");
		
		this.superCall();
		
		this._width = this.createProperty("width", 0);
		this._height = this.createProperty("height", 0);
		this._element = this.createProperty("element", null);
		this._inDom = this.createProperty("inDom", true);
		this._domChange = this.createGhostProperty("domChange");
		
		this.createUpdateFunction("default", this._update, [this._element, this._inDom, this._domChange], [this._width, this._height]);
		
		return this;
	};
	
	objectFunctions.checkForLayoutChange = function() {
		//console.log("dbm.flow.nodes.display.SizeOfElementNode::checkForLayoutChange");
		//console.log(this);
		
		var layoutChangeNode = this.addDestroyableObject(LayoutChangeNode.create(this._element));
		
		this._domChange.connectInput(layoutChangeNode.getProperty("change"));
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.display.SizeOfElementNode::_update");
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		if(htmlElement !== null) {
			this._width.setValueWithFlow(htmlElement.clientWidth, aFlowUpdateNumber);
			this._height.setValueWithFlow(htmlElement.clientHeight, aFlowUpdateNumber);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._width = null;
		this._height = null;
		this._element = null;
		this._inDom = null;
		this._domChange = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aInDom) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("inDom", aInDom);
		return newNode;
	};
});