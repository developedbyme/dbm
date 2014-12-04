/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.geometry.PositionRectangleNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.geometry.PositionRectangleNode");
	//"use strict";
	
	var PositionRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.PositionRectangleNode");
	
	var Rectangle = dbm.importClass("dbm.core.data.geometry.Rectangle");
	var Point = dbm.importClass("dbm.core.data.points.Point");
	
	var RectangleFunctions = dbm.importClass("dbm.utils.math.geometry.RectangleFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.geometry.PositionRectangleNode::_init");
		
		this.superCall();
		
		this._outerRectangle = this.createProperty("outerRectangle", null).setAlwaysUpdateFlow();
		this._innerRectangle = this.createProperty("innerRectangle", null).setAlwaysUpdateFlow();
		this._outerParameterX = this.createProperty("outerParameterX", 0);
		this._outerParameterY = this.createProperty("outerParameterY", 0);
		this._innerParameterX = this.createProperty("innerParameterX", 0);
		this._innerParameterY = this.createProperty("innerParameterY", 0);
		this._offsetX = this.createProperty("offsetX", 0);
		this._offsetY = this.createProperty("offsetY", 0);
		this._outputRectangle = this.createProperty("outputRectangle", Rectangle.create());
		
		this._tempPoint = Point.create();
		
		this.createUpdateFunction("default", this._update, [this._outerRectangle, this._innerRectangle, this._outerParameterX, this._outerParameterY, this._innerParameterX, this._innerParameterY, this._offsetX, this._offsetY], [this._outputRectangle]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.geometry.PositionRectangleNode::_update");
		
		var outputRectangle = this._outputRectangle.getValueWithoutFlow();
		
		RectangleFunctions.getPositionedRectanglePosition(this._outerRectangle.getValueWithoutFlow(), this._innerRectangle.getValueWithoutFlow(), this._outerParameterX.getValueWithoutFlow(), this._outerParameterY.getValueWithoutFlow(), this._innerParameterX.getValueWithoutFlow(), this._innerParameterY.getValueWithoutFlow(), this._offsetX.getValueWithoutFlow(), this._offsetY.getValueWithoutFlow(), this._tempPoint);
		
		outputRectangle.x = this._tempPoint.x;
		outputRectangle.y = this._tempPoint.y;
		
		this._outputRectangle.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._outerRectangle = null;
		this._innerRectangle = null;
		this._outerParameterX = null;
		this._outerParameterY = null;
		this._innerParameterX = null;
		this._innerParameterY = null;
		this._offsetX = null;
		this._offsetY = null;
		this._outputRectangle = null;
		
		this._tempPoint = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aOuterRectangle, aInnerRectangle, aOuterParameterX, aOuterParameterY, aInnerParameterX, aInnerParameterY, aOffsetX, aOffsetY) {
		//console.log("dbm.flow.nodes.math.geometry.PositionRectangleNode::create");
		//console.log(aOuterRectangle, aInnerRectangle, aOuterParameterX, aOuterParameterY, aInnerParameterX, aInnerParameterY, aOffsetX, aOffsetY);
		
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("outerRectangle", aOuterRectangle);
		newNode.setPropertyInputWithoutNull("innerRectangle", aInnerRectangle);
		newNode.setPropertyInputWithoutNull("outerParameterX", aOuterParameterX);
		newNode.setPropertyInputWithoutNull("outerParameterY", aOuterParameterY);
		newNode.setPropertyInputWithoutNull("innerParameterX", aInnerParameterX);
		newNode.setPropertyInputWithoutNull("innerParameterY", aInnerParameterY);
		newNode.setPropertyInputWithoutNull("offsetX", aOffsetX);
		newNode.setPropertyInputWithoutNull("offsetY", aOffsetY);
		return newNode;
	};
});