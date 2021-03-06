/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.curves.CreateMultiSegmentBezierCurveNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.curves.CreateMultiSegmentBezierCurveNode");
	
	var CreateMultiSegmentBezierCurveNode = dbm.importClass("dbm.flow.nodes.curves.CreateMultiSegmentBezierCurveNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.curves.CreateMultiSegmentBezierCurveNode::_init");
		
		this.superCall();
		
		this._inputPoints = this.createProperty("inputPoints", null);
		this._isRound = this.createProperty("isRound", false);
		this._outputCurve = this.createProperty("outputCurve", null);
		
		this.createUpdateFunction("default", this._update, [this._inputPoints, this._isRound], [this._outputCurve]);
		
		return this;
	};
	
	objectFunctions.setOutputCurve = function(aCurve) {
		this._outputCurve.setValue(aCurve);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.curves.CreateMultiSegmentBezierCurveNode::_update");
		
		var inputPoints = this._inputPoints.getValueWithoutFlow();
		var isRound = this._isRound.getValueWithoutFlow();
		var outputCurve = this._outputCurve.getValueWithoutFlow();
		//console.log(this, inputPoints, isRound, outputCurve);
		
		dbm.singletons.dbmCurveEvaluator.createMultiSegmentBezierCurveFromPoints2d(inputPoints.pointsArray, outputCurve, isRound);
		
		this._outputCurve.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputPoints = null;
		this._isRound = null;
		this._outputCurve = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInputPoints, aIsRound) {
		//console.log("dbm.flow.nodes.curves.CreateMultiSegmentBezierCurveNode::create");
		//console.log(aInputPoints, aIsRound);
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputPoints", aInputPoints);
		newNode.setPropertyInputWithoutNull("isRound", aIsRound);
		return newNode;
	};
});