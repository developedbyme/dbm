/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.curves.GetPointOnCurveNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.curves.GetPointOnCurveNode");
	
	var GetPointOnCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.GetPointOnCurveNode");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.curves.GetPointOnCurveNode::_init");
		
		this.superCall();
		
		this._curve = this.createProperty("curve", null);
		this._parameter = this.createProperty("parameter", 0);
		this._outputValueX = this.createProperty("outputValueX", 0);
		this._outputValueY = this.createProperty("outputValueY", 0);
		this._outputValueZ = this.createProperty("outputValueZ", 0);
		
		this._tempPoint = Point.create();
		
		this.createUpdateFunction("default", this._update, [this._curve, this._parameter], [this._outputValueX, this._outputValueY, this._outputValueZ]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.curves.GetPointOnCurveNode::_update");
		
		var curve = this._curve.getValueWithoutFlow();
		var parameter = this._parameter.getValueWithoutFlow();
		curve.getPointOnCurve(parameter, this._tempPoint);
		
		this._outputValueX.setValueWithFlow(this._tempPoint.x, aFlowUpdateNumber);
		this._outputValueY.setValueWithFlow(this._tempPoint.y, aFlowUpdateNumber);
		this._outputValueZ.setValueWithFlow(this._tempPoint.z, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._curve = null;
		this._parameter = null;
		this._outputValueX = null;
		this._outputValueY = null;
		this._outputValueZ = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aCurve, aParameter) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("curve", aCurve);
		newNode.setPropertyInputWithoutNull("parameter", aParameter);
		return newNode;
	};
});