/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.math.geometry.ValuesFromRectangleNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.geometry.ValuesFromRectangleNode");
	//"use strict";
	
	var ValuesFromRectangleNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.ValuesFromRectangleNode");
	
	var Rectangle = dbm.importClass("com.developedbyme.core.data.geometry.Rectangle");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.geometry.ValuesFromRectangleNode::_init");
		
		this.superCall();
		
		this._inputRectangle = this.createProperty("inputRectangle", null).setAlwaysUpdateFlow();
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._width = this.createProperty("width", 0);
		this._height = this.createProperty("height", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputRectangle], [this._x, this._y, this._width, this._height]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.geometry.ValuesFromRectangleNode::_update");
		
		var inputRectangle = this._inputRectangle.getValueWithoutFlow();
		
		this._x.setValueWithFlow(inputRectangle.x, aFlowUpdateNumber);
		this._y.setValueWithFlow(inputRectangle.y, aFlowUpdateNumber);
		this._width.setValueWithFlow(inputRectangle.width, aFlowUpdateNumber);
		this._height.setValueWithFlow(inputRectangle.height, aFlowUpdateNumber);
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._width = null;
		this._height = null;
		this._inputRectangle = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInputRectangle) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputRectangle", aInputRectangle);
		return newNode;
	};
});