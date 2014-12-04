/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart", "dbm.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart");
	
	//Self reference
	var SpatialCurveTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart");
	
	//Error report
	
	//Dependencies
	var GetMaxParameterOnCurveNode = dbm.importClass("dbm.flow.nodes.curves.GetMaxParameterOnCurveNode");
	var ParameterFromValueNode = dbm.importClass("dbm.flow.nodes.curves.ParameterFromValueNode");
	var CreateArcLengthCurveNode = dbm.importClass("dbm.flow.nodes.curves.CreateArcLengthCurveNode");
	var GetPointOnCurveNode = dbm.importClass("dbm.flow.nodes.curves.GetPointOnCurveNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var DivisionNode = dbm.importClass("dbm.flow.nodes.math.DivisionNode");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var ExtrapolationTypes = dbm.importClass("dbm.constants.ExtrapolationTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart::_init");
		
		this.superCall();
		
		this.curve = null;
		this.pointProperty = "outputValueX";
		this.startParameter = 0;
		this.endParameter = 1;
		
		this._curveMaxNode = null;
		this._arcLengthCurveNode = null;
		this._arcLengthMaxNode = null;
		this._arcLengthMaxValueNode = null;
		this._parameterLengthMultiplierNode = null;
		this._distanceEvaluationNode = null;
		this._parameterDivisionNode = null;
		this._parameterMultiplierNode = null;
		this._pointNode = null;
		
		return this;
	};
	
	objectFunctions.setCurve = function(aCurve, aPointProperty) {
		
		this.curve = aCurve;
		this.pointProperty = aPointProperty;
		
		return this;
	};
	
	objectFunctions._createArcLengthEvaluator = function() {
		
		this._curveMaxNode = this.addDestroyableObject(GetMaxParameterOnCurveNode.create(this.curve));
		this._arcLengthCurveNode = this.addDestroyableObject(CreateArcLengthCurveNode.create(this.curve, 0, this._curveMaxNode.getProperty("outputParameter")));
		this._arcLengthMaxNode = this.addDestroyableObject(GetMaxParameterOnCurveNode.create(this._arcLengthCurveNode.getProperty("outputCurve")));
		
		this._arcLengthMaxValueNode = this.addDestroyableObject(GetPointOnCurveNode.create(this._arcLengthCurveNode.getProperty("outputCurve"), this._arcLengthMaxNode.getProperty("outputParameter")));
		this._parameterLengthMultiplierNode = this.addDestroyableObject(MultiplicationNode.create(0, this._arcLengthMaxValueNode.getProperty("outputValueY")));
		
		this._distanceEvaluationNode = this.addDestroyableObject(ParameterFromValueNode.create(this._arcLengthCurveNode.getProperty("outputCurve"), this._parameterLengthMultiplierNode.getProperty("outputValue"), "y", 0.001, 0, this._arcLengthMaxNode.getProperty("outputParameter")));
		
		this._parameterDivisionNode = this.addDestroyableObject(DivisionNode.create(this._curveMaxNode.getProperty("outputParameter"), this._arcLengthMaxNode.getProperty("outputParameter")));
		this._parameterMultiplierNode = this.addDestroyableObject(MultiplicationNode.create(this._distanceEvaluationNode.getProperty("outputParameter"), this._parameterDivisionNode.getProperty("outputValue")));
		
		this._pointNode = this.addDestroyableObject(GetPointOnCurveNode.create(this.curve, this._parameterMultiplierNode.getProperty("outputValue")));
		
	};
	
	objectFunctions.getValueByParameter = function(aParameter) {
		//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart::getValueByParameter");
		
		var parameter = (aParameter-this.startParameter)/(this.endParameter-this.startParameter);  //METODO: this doesn't seem to be the correct calculation
		//console.log(parameter, this.curve);
		
		if(this._pointNode === null) {
			this._createArcLengthEvaluator();
		}
		
		this._parameterLengthMultiplierNode.getProperty("inputValue1").setValue(parameter);
		var returnValue = this._pointNode.getProperty(this.pointProperty).getValue();
		
		return returnValue;
		
	};
	
	staticFunctions.create = function(aCurve, aStartTime, aLength) {
		var newPart = (new ClassReference()).init();
		
		newPart.curve = aCurve;
		newPart.setTimes(aStartTime, aStartTime+aLength);
		
		return newPart;
	};
});