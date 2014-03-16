/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.math.geometry.RectangleFromValuesNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.geometry.RectangleFromValuesNode");
	//"use strict";
	
	var RectangleFromValuesNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.RectangleFromValuesNode");
	
	var Rectangle = dbm.importClass("com.developedbyme.core.data.geometry.Rectangle");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.geometry.RectangleFromValuesNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._width = this.createProperty("width", 0);
		this._height = this.createProperty("height", 0);
		this._outputRectangle = this.createProperty("outputRectangle", Rectangle.create());
		
		this.createUpdateFunction("default", this._update, [this._x, this._y, this._width, this._height], [this._outputRectangle]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.geometry.RectangleFromValuesNode::_update");
		
		var outputRectangle = this._outputRectangle.getValueWithoutFlow();
		
		outputRectangle.x = this._x.getValueWithoutFlow();
		outputRectangle.y = this._y.getValueWithoutFlow();
		outputRectangle.width = this._width.getValueWithoutFlow();
		outputRectangle.height = this._height.getValueWithoutFlow();
		
		this._outputRectangle.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._width = null;
		this._height = null;
		this._outputRectangle = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aX, aY, aWidth, aHeight) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("width", aWidth);
		newNode.setPropertyInputWithoutNull("height", aHeight);
		return newNode;
	};
});