/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.curves.GetMaxParameterOnCurveNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.curves.GetMaxParameterOnCurveNode");
	
	//Self reference
	var GetMaxParameterOnCurveNode = dbm.importClass("dbm.flow.nodes.curves.GetMaxParameterOnCurveNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.curves.GetMaxParameterOnCurveNode::_init");
		
		this.superCall();
		
		this._curve = this.createProperty("curve", null).setAlwaysUpdateFlow(true);
		this._outputParameter = this.createProperty("outputParameter", 0);
		
		this.createUpdateFunction("default", this._update, [this._curve], [this._outputParameter]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.curves.GetMaxParameterOnCurveNode::_update");
		
		var curve = this._curve.getValueWithoutFlow();
		
		this._outputParameter.setValueWithFlow(curve.getMaxParameter(), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._curve = null;
		this._outputParameter = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aCurve) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("curve", aCurve);
		return newNode;
	};
});