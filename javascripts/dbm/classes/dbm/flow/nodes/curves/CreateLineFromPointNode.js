/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.curves.CreateLineFromPointNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.curves.CreateLineFromPointNode");
	
	//Self reference
	var CreateLineFromPointNode = dbm.importClass("dbm.flow.nodes.curves.CreateLineFromPointNode");
	
	//Error report
	
	//Dependencies
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.curves.CreateLineFromPointNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._length = this.createProperty("length", 1);
		this._angle = this.createProperty("angle", 0);
		this._outputCurve = this.createProperty("outputCurve", BezierCurve.createWithLength(1, true, 2)).setAlwaysUpdateFlow(true);
		
		this.createUpdateFunction("default", this._update, [this._x, this._y, this._length, this._angle], [this._outputCurve]);
		
		return this;
	};
	
	objectFunctions.setOutputCurve = function(aCurve) {
		this._outputCurve.setValue(aCurve);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.curves.CreateLineFromPointNode::_update");
		//console.log(this);
		
		var x = this._x.getValueWithoutFlow();
		var y = this._y.getValueWithoutFlow();
		var fullLength = this._length.getValueWithoutFlow();
		var angle = this._angle.getValueWithoutFlow();
		var sinValue = Math.sin(angle);
		var cosValue = Math.cos(angle);
		
		var outputCurve = this._outputCurve.getValueWithoutFlow();
		var startPoint = outputCurve.pointsArray[0];
		var endPoint = outputCurve.pointsArray[1];
		
		startPoint.x = x;
		startPoint.y = y;
		endPoint.x = x+fullLength*cosValue;
		endPoint.y = y+fullLength*sinValue;
		
		this._outputCurve.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._length = null;
		this._angle = null;
		this._outputCurve = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aX, aY, aLength, aAngle) {
		//console.log("dbm.flow.nodes.curves.CreateLineFromPointNode::create");
		//console.log(aInputPoints, aIsRound);
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("length", aLength);
		newNode.setPropertyInputWithoutNull("angle", aAngle);
		return newNode;
	};
});