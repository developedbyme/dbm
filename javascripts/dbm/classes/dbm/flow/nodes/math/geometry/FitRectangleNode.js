/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.geometry.FitRectangleNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.geometry.FitRectangleNode");
	
	var FitRectangleNode = dbm.importClass("dbm.flow.nodes.math.geometry.FitRectangleNode");
	
	var Rectangle = dbm.importClass("dbm.core.data.geometry.Rectangle");
	
	var RectangleFunctions = dbm.importClass("dbm.utils.math.geometry.RectangleFunctions");
	
	var FitTypes = dbm.importClass("dbm.constants.generic.FitTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.geometry.FitRectangleNode::_init");
		
		this.superCall();
		
		this._outerRectangle = this.createProperty("outerRectangle", null).setAlwaysUpdateFlow();
		this._innerRectangle = this.createProperty("innerRectangle", null).setAlwaysUpdateFlow();
		this._fitType = this.createProperty("fitType", FitTypes.NONE);
		this._outputRectangle = this.createProperty("outputRectangle", Rectangle.create());
		
		this.createUpdateFunction("default", this._update, [this._outerRectangle, this._innerRectangle, this._fitType], [this._outputRectangle]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.geometry.FitRectangleNode::_update");
		
		var outputRectangle = this._outputRectangle.getValueWithoutFlow();
		
		RectangleFunctions.fitRectangle(this._fitType.getvalueWithoutFlow(), this._outerRectangle.getvalueWithoutFlow(), this._innerRectangle.getvalueWithoutFlow(), outputRectangle);
		
		this._outputRectangle.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._outerRectangle = null;
		this._innerRectangle = null;
		this._fitType = null;
		this._outputRectangle = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aFitType, aOuterRectangle, aInnerRectangle) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("fitType", aFitType);
		newNode.setPropertyInputWithoutNull("outerRectangle", aOuterRectangle);
		newNode.setPropertyInputWithoutNull("innerRectangle", aInnerRectangle);
		return newNode;
	};
});