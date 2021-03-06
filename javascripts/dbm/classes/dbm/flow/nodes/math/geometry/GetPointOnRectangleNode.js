/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.geometry.GetPointOnRectangleNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.geometry.GetPointOnRectangleNode");
	
	var GetPointOnRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.GetPointOnRectangleNode");
	
	var Point = dbm.importClass("dbm.core.data.points.Point");
	
	var RectangleFunctions = dbm.importClass("dbm.utils.math.geometry.RectangleFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.geometry.GetPointOnRectangleNode::_init");
		
		this.superCall();
		
		this._inputRectangle = this.createProperty("inputRectangle", null).setAlwaysUpdateFlow();
		this._parameterX = this.createProperty("parameterX", 0);
		this._parameterY = this.createProperty("parameterY", 0);
		this._outputPoint = this.createProperty("outputPoint", Point.create());
		
		this.createUpdateFunction("default", this._update, [this._inputRectangle, this._parameterX, this._parameterY], [this._outputPoint]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.geometry.GetPointOnRectangleNode::_update");
		
		var outputPoint = this._outputPoint.getValueWithoutFlow();
		
		RectangleFunctions.getPointOnRectangle(this._inputRectangle.getvalueWithoutFlow(), this._parameterX.getvalueWithoutFlow(), this._parameterY.getvalueWithoutFlow(), outputPoint);
		
		this._outputPoint.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputRectangle = null;
		this._parameterX = null;
		this._parameterY = null;
		this._outputPoint = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInputRectangle, aParameterX, aParameterY) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputRectangle", aInputRectangle);
		newNode.setPropertyInputWithoutNull("parameterX", aParameterX);
		newNode.setPropertyInputWithoutNull("parameterY", aParameterY);
		return newNode;
	};
});