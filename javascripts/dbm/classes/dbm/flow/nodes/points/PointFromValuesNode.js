/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.points.PointFromValuesNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.points.PointFromValuesNode");
	//"use strict";
	
	var PointFromValuesNode = dbm.importClass("dbm.flow.nodes.points.PointFromValuesNode");
	
	var Point = dbm.importClass("dbm.core.data.points.Point");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.points.PointFromValuesNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._z = this.createProperty("z", 0);
		this._w = this.createProperty("w", 0);
		this._outputPoint = this.createProperty("outputPoint", Point.create());
		
		this.createUpdateFunction("default", this._update, [this._x, this._y, this._z, this._w], [this._outputPoint]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.points.PointFromValuesNode::_update");
		
		var outputPoint = this._outputPoint.getValueWithoutFlow();
		
		outputPoint.x = this._x.getValueWithoutFlow();
		outputPoint.y = this._y.getValueWithoutFlow();
		outputPoint.z = this._z.getValueWithoutFlow();
		outputPoint.w = this._w.getValueWithoutFlow();
		
		this._outputPoint.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._z = null;
		this._w = null;
		this._outputPoint = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aX, aY, aZ, aW) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("z", aZ);
		newNode.setPropertyInputWithoutNull("w", aW);
		return newNode;
	};
});