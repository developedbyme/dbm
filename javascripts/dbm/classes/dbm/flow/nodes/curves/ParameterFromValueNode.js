/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.curves.ParameterFromValueNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.curves.ParameterFromValueNode");
	
	//Self reference
	var ParameterFromValueNode = dbm.importClass("dbm.flow.nodes.curves.ParameterFromValueNode");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var Point = dbm.importClass("dbm.core.data.points.Point");
	
	//Utils
	
	//Error report
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.curves.ParameterFromValueNode::_init");
		
		this.superCall();
		
		this._curve = this.createProperty("curve", null).setAlwaysUpdateFlow(true);
		this._inputValue = this.createProperty("inputValue", 0);
		this._pointProperty = this.createProperty("pointProperty", "x");
		this._exactness = this.createProperty("exactness", 0.001);
		this._startSearchParameter = this.createProperty("startSearchParameter", 0);
		this._endSearchParameter = this.createProperty("endSearchParameter", 1);
		this._outputParameter = this.createProperty("outputParameter", 0);
		
		this._tempPoint = this.addDestroyableObject(Point.create());
		
		this.createUpdateFunction("default", this._update, [this._curve, this._inputValue, this._exactness, this._startSearchParameter, this._endSearchParameter, this._pointProperty], [this._outputParameter]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.curves.ParameterFromValueNode::_update");
		
		var curve = this._curve.getValueWithoutFlow();
		var inputValue = this._inputValue.getValueWithoutFlow();
		var pointProperty = this._pointProperty.getValueWithoutFlow();
		var exactness = this._exactness.getValueWithoutFlow();
		var startSearchParameter = this._startSearchParameter.getValueWithoutFlow();
		var endSearchParameter = this._endSearchParameter.getValueWithoutFlow();
		
		var lowParameter = startSearchParameter;
		curve.getPointOnCurve(lowParameter, this._tempPoint);
		var lowValue = this._tempPoint[pointProperty];
		
		var highParameter = endSearchParameter;
		curve.getPointOnCurve(highParameter, this._tempPoint);
		var highValue = this._tempPoint[pointProperty];
		
		var debugLoopCounter = 0;
		var currentParameter;
		while(true) {
			//console.log(lowParameter, highParameter, lowValue, inputValue, highValue);
			
			var expandParameter = 0.02;
			var expectedParameter = expandParameter*0.5+(1-expandParameter)*(inputValue-lowValue)/(highValue-lowValue);
			currentParameter = (1-expectedParameter)*lowParameter+(expectedParameter)*highParameter;
			
			if(debugLoopCounter++ > 200) {
				//METODO: error message
				break;
			}
			
			curve.getPointOnCurve(currentParameter, this._tempPoint);
			var currentValue = this._tempPoint[pointProperty];
			if(Math.abs(currentValue-inputValue) <= exactness) {
				break;
			}
			
			if(currentValue < inputValue) {
				lowParameter = currentParameter;
				lowValue = currentValue;
			}
			else {
				highParameter = currentParameter;
				highValue = currentValue;
			}
		}
		this._outputParameter.setValueWithFlow(currentParameter, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._curve = null;
		this._inputValue = null;
		this._pointProperty = null;
		this._exactness = null;
		this._startSearchParameter = null;
		this._endSearchParameter = null;
		this._outputParameter = null;
		
		this._tempPoint = this.addDestroyableObject(Point.create());
		
		this.superCall();
	};
	
	staticFunctions.create = function(aCurve, aInputValue, aPointProperty, aExactness, aStartSearchParameter, aEndSearchParmeter) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("curve", aCurve);
		newNode.setPropertyInputWithoutNull("inputValue", aInputValue);
		newNode.setPropertyInputWithoutNull("pointProperty", aPointProperty);
		newNode.setPropertyInputWithoutNull("exactness", aExactness);
		newNode.setPropertyInputWithoutNull("startSearchParameter", aStartSearchParameter);
		newNode.setPropertyInputWithoutNull("endSearchParameter", aEndSearchParmeter);
		return newNode;
	};
});