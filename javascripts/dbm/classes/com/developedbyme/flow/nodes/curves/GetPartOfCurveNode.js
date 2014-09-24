/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.curves.GetPartOfCurveNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.curves.GetPartOfCurveNode");
	
	//Self reference
	var GetPartOfCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.GetPartOfCurveNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.curves.GetPartOfCurveNode::_init");
		
		this.superCall();
		
		this._curve = this.createProperty("curve", null).setAlwaysUpdateFlow(true);
		this._startParameter = this.createProperty("startParameter", 0);
		this._endParameter = this.createProperty("endParameter", 0);
		this._exactness = this.createProperty("exactness", 0.01);
		this._createdCurve = this.createProperty("createdCurve", null);
		this._outputCurve = this.createProperty("outputCurve", null).setAlwaysUpdateFlow(true);
		
		this.createUpdateFunction("createCurve", this._updateCreateCurve, [this._curve], [this._createdCurve]);
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [this._curve, this._createdCurve, this._startParameter, this._endParameter, this._exactness], [this._outputCurve]);
		
		return this;
	};
	
	objectFunctions._updateCreateCurve = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.curves.GetPartOfCurveNode::_updateCreateCurve");
		
		var curve = this._curve.getValueWithoutFlow();
		var createdCurve = this._createdCurve.getValueWithoutFlow();
		
		if(createdCurve === null) {
			this._createdCurve.setValueWithFlow(curve.createSameTypeOfCurve(), aFlowUpdateNumber);
		}
		else if(curve.getCurveDegree() !== createdCurve.getCurveDegree()) {
			createdCurve.destroy();
			this._createdCurve.setValueWithFlow(curve.createSameTypeOfCurve(), aFlowUpdateNumber);
		}
		else {
			this._createdCurve.status = FlowStatusTypes.UPDATED;
		}
	};
	
	staticFunctions._update = function(aCurve, aCreatedCurve, aStartParameter, aEndParameter, aExactness) {
		//console.log("com.developedbyme.flow.nodes.curves.GetPartOfCurveNode::_update");
		
		if(aStartParameter > aEndParameter) {
			var tempParameter = aEndParameter;
			aEndParameter = aStartParameter;
			aStartParameter = tempParameter;
		}
		
		if(aStartParameter === 0 && aEndParameter >= aCurve.getMaxParameter()) {
			return aCurve;
		}
		
		dbm.singletons.dbmCurveEvaluator.getPartOfCurve(aCurve, aStartParameter, aEndParameter, aExactness, aCreatedCurve);
		return aCreatedCurve;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._curve = null;
		this._createdCurve = null;
		this._startParameter = null;
		this._endParameter = null;
		this._exactness = null;
		this._outputCurve = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aCurve, aStartParameter, aEndParameter, aExactness) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("curve", aCurve);
		newNode.setPropertyInputWithoutNull("startParameter", aStartParameter);
		newNode.setPropertyInputWithoutNull("endParameter", aEndParameter);
		newNode.setPropertyInputWithoutNull("exactness", aExactness);
		return newNode;
	};
});