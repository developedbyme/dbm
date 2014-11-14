/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.curves.CreateRectangleCurveNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.curves.CreateRectangleCurveNode");
	
	//Self reference
	var CreateRectangleCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.CreateRectangleCurveNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.curves.CreateRectangleCurveNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._width = this.createProperty("width", 1);
		this._height = this.createProperty("height", 1);
		this._outputCurve = this.createProperty("outputCurve", null).setAlwaysUpdateFlow(true);
		
		this.createUpdateFunction("default", this._update, [this._x, this._y, this._width, this._height], [this._outputCurve]);
		
		return this;
	};
	
	objectFunctions.setOutputCurve = function(aCurve) {
		this._outputCurve.setValue(aCurve);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.curves.CreateRectangleCurveNode::_update");
		//console.log(this);
		
		this._outputCurve.setValueWithFlow(
			dbm.singletons.dbmCurveCreator.createRectangle(
				this._x.getValueWithoutFlow(),
				this._y.getValueWithoutFlow(),
				this._width.getValueWithoutFlow(),
				this._height.getValueWithoutFlow()
			),
			aFlowUpdateNumber
		);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._width = null;
		this._height = null;
		this._outputCurve = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aX, aY, aWidth, aHeight) {
		//console.log("com.developedbyme.flow.nodes.curves.CreateRectangleCurveNode::create");
		//console.log(aInputPoints, aIsRound);
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("width", aWidth);
		newNode.setPropertyInputWithoutNull("height", aHeight);
		return newNode;
	};
});