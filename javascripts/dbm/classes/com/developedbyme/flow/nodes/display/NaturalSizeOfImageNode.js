/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.display.NaturalSizeOfImageNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.NaturalSizeOfImageNode");
	//"use strict";
	
	var NaturalSizeOfImageNode = dbm.importClass("com.developedbyme.flow.nodes.display.NaturalSizeOfImageNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.display.NaturalSizeOfImageNode::_init");
		
		this.superCall();
		
		this._width = this.createProperty("width", 0);
		this._height = this.createProperty("height", 0);
		this._element = this.createProperty("element", null);
		
		this.createUpdateFunction("default", this._update, [this._element], [this._width, this._height]);
		
		return this;
	};
	
	objectFunctions.setDocumentInput = function(aProperty) {
		
		this._windowForElementNode.setPropertyInput("document", aProperty);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.NaturalSizeOfImageNode::_update");
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		if(htmlElement !== null) {
			this._width.setValueWithFlow(htmlElement.naturalWidth, aFlowUpdateNumber);
			this._height.setValueWithFlow(htmlElement.naturalHeight, aFlowUpdateNumber);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._width = null;
		this._height = null;
		this._element = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		return newNode;
	};
});