/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.geometry.ScaleRectangleNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.geometry.ScaleRectangleNode");
	//"use strict";
	
	var ScaleRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.ScaleRectangleNode");
	
	var Rectangle = dbm.importClass("dbm.core.data.geometry.Rectangle");
	var Point = dbm.importClass("dbm.core.data.points.Point");
	
	var RectangleFunctions = dbm.importClass("dbm.utils.math.geometry.RectangleFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.geometry.ScaleRectangleNode::_init");
		
		this.superCall();
		
		this._outerRectangle = this.createProperty("outerRectangle", null).setAlwaysUpdateFlow();
		this._scaleX = this.createProperty("scaleX", 1);
		this._scaleY = this.createProperty("scaleY", 1);
		this._scaleOffsetX = this.createProperty("scaleOffsetX", 0);
		this._scaleOffsetY = this.createProperty("scaleOffsetY", 0);
		this._outputRectangle = this.createProperty("outputRectangle", Rectangle.create());
		
		this._tempPoint = Point.create();
		
		this.createUpdateFunction("default", this._update, [this._outerRectangle, this._scaleX, this._scaleY, this._scaleOffsetX, this._scaleOffsetY], [this._outputRectangle]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.geometry.ScaleRectangleNode::_update");
		//console.log(this);
		
		var outputRectangle = this._outputRectangle.getValueWithoutFlow();
		
		RectangleFunctions.getScaledRectangle(this._outerRectangle.getValueWithoutFlow(), this._scaleX.getValueWithoutFlow(), this._scaleY.getValueWithoutFlow(), this._scaleOffsetX.getValueWithoutFlow(), this._scaleOffsetY.getValueWithoutFlow(), outputRectangle);
		
		this._outputRectangle.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._outerRectangle = null;
		this._scaleX = null;
		this._scaleY = null;
		this._scaleOffsetX = null;
		this._scaleOffsetY = null;
		this._outputRectangle = null;
		
		this._tempPoint = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aOuterRectangle, aScaleX, aScaleY, aScaleOffsetX, aScaleOffsetY) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("outerRectangle", aOuterRectangle);
		newNode.setPropertyInputWithoutNull("scaleX", aScaleX);
		newNode.setPropertyInputWithoutNull("scaleY", aScaleY);
		newNode.setPropertyInputWithoutNull("scaleOffsetX", aScaleOffsetX);
		newNode.setPropertyInputWithoutNull("scaleOffsetY", aScaleOffsetY);
		return newNode;
	};
});