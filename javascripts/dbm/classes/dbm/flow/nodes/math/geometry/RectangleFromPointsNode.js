/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.geometry.RectangleFromPointsNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.geometry.RectangleFromPointsNode");
	
	var RectangleFromPointsNode = dbm.importClass("dbm.flow.nodes.math.geometry.RectangleFromPointsNode");
	
	var Rectangle = dbm.importClass("dbm.core.data.geometry.Rectangle");
	
	var RectangleFunctions = dbm.importClass("dbm.utils.math.geometry.RectangleFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.geometry.RectangleFromPointsNode::_init");
		
		this.superCall();
		
		this._topLeftPoint = this.createProperty("topLeftPoint", null);
		this._bottomRightPoint = this.createProperty("bottomRightPoint", null);
		this._outputRectangle = this.createProperty("outputRectangle", Rectangle.create());
		
		this.createUpdateFunction("default", this._update, [this._topLeftPoint, this._bottomRightPoint], [this._outputRectangle]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.geometry.RectangleFromPointsNode::_update");
		
		var outputRectangle = this._outputRectangle.getValueWithoutFlow();
		
		RectangleFunctions.getRectangleFromPoints(this._topLeftPoint.getValueWithoutFlow(), this._bottomRightPoint.getValueWithoutFlow(), outputRectangle);
		
		this._outputRectangle.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._topLeftPoint = null;
		this._bottomRightPoint = null;
		this._outputRectangle = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aTopLeftPoint, aBottomRightPoint) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("topLeftPoint", aTopLeftPoint);
		newNode.setPropertyInputWithoutNull("bottomRightPoint", aBottomRightPoint);
		return newNode;
	};
});