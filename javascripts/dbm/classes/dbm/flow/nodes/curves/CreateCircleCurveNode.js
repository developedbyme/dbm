/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.curves.CreateCircleCurveNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.curves.CreateCircleCurveNode");
	
	//Self reference
	var CreateCircleCurveNode = dbm.importClass("dbm.flow.nodes.curves.CreateCircleCurveNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.curves.CreateCircleCurveNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._radius = this.createProperty("radius", 1);
		this._numberOfSegments = this.createProperty("numberOfSegments", 8);
		this._startAngle = this.createProperty("startAngle", 0);
		this._outputCurve = this.createProperty("outputCurve", null).setAlwaysUpdateFlow(true);
		
		this.createUpdateFunction("default", this._update, [this._x, this._y, this._radius, this._numberOfSegments, this._startAngle], [this._outputCurve]);
		
		return this;
	};
	
	objectFunctions.setOutputCurve = function(aCurve) {
		this._outputCurve.setValue(aCurve);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.curves.CreateCircleCurveNode::_update");
		//console.log(this);
		
		this._outputCurve.setValueWithFlow(
			dbm.singletons.dbmCurveCreator.createCircle(
				this._x.getValueWithoutFlow(),
				this._y.getValueWithoutFlow(),
				this._radius.getValueWithoutFlow(),
				this._numberOfSegments.getValueWithoutFlow(),
				this._startAngle.getValueWithoutFlow()
			),
			aFlowUpdateNumber
		);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._radius = null;
		this._numberOfSegments = null;
		this._outputCurve = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aX, aY, aRadius, aNumberOfSegments, aStartAngle) {
		//console.log("dbm.flow.nodes.curves.CreateCircleCurveNode::create");
		//console.log(aInputPoints, aIsRound);
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("radius", aRadius);
		newNode.setPropertyInputWithoutNull("numberOfSegments", aNumberOfSegments);
		newNode.setPropertyInputWithoutNull("startAngle", aStartAngle);
		return newNode;
	};
});