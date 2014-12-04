/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.display.PrintFieldNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.display.PrintFieldNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.display.PrintFieldNode::_init");
		
		this.superCall();
		
		this._text = this.createProperty("text", "");
		this._element = this.createProperty("element", null);
		this._display = this.createProperty("display", null);
		
		this.createUpdateFunction("default", this._update, [this._text, this._element], [this._display]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.display.PrintFieldNode::_update");
		this._element.getValueWithoutFlow().value = this._text.getValueWithoutFlow();
		this._display.setValueWithFlow(null, aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aText) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("text", aText);
		return newNode;
	};
});