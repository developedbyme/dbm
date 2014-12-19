/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.range.OvershootRangeNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions) {
	//console.log("dbm.flow.nodes.math.range.OvershootRangeNode");
	
	//Self reference
	var OvershootRangeNode = dbm.importClass("dbm.flow.nodes.math.range.OvershootRangeNode");
	
	//Error report
	
	//Dependnecies
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.range.OvershootRangeNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._minValue = this.createProperty("minValue", 0);
		this._maxValue = this.createProperty("maxValue", 1);
		
		this._rangeValue = this.createProperty("rangeValue", 0);
		this._overshootValue = this.createProperty("overshootValue", 0);
		this._overshootOutput = this.createProperty("overshootOutput", 0);
		
		this.createUpdateFunction("range", this._updateRange, [this._inputValue, this._minValue, this._maxValue], [this._rangeValue, this._overshootValue]);
		
		var additionNode = this.addDestroyableObject(AdditionNode.create(this._rangeValue, this._overshootOutput));
		this._outputValue = this.createProperty("outputValue", additionNode.getProperty("outputValue"));
		
		return this;
	};
	
	objectFunctions._updateRange = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.range.OvershootRangeNode::_updateRange");
		
		var minValue = this._minValue.getValueWithoutFlow();
		var maxValue = this._maxValue.getValueWithoutFlow();
		var inputValue = this._inputValue.getValueWithoutFlow();
		
		if(inputValue >= minValue && inputValue <= maxValue) {
			this._outputValue.setValueWithFlow(inputValue, aFlowUpdateNumber);
			this._overshootValue.setValueWithFlow(0, aFlowUpdateNumber);
		}
		else {
			var newValue = Math.max(minValue, Math.min(maxValue, inputValue));
			this._outputValue.setValueWithFlow(newValue, aFlowUpdateNumber);
			this._overshootValue.setValueWithFlow(inputValue-newValue, aFlowUpdateNumber);
		}
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
		
		this._inputValue = null;
		this._minValue = null;
		this._maxValue = null;
		this._rangeValue = null;
		this._overshootValue = null;
		this._overshootOutput = null;
		this._outputValue = null;
	};
	
	staticFunctions.createScaledOvershoot = function(aInput, aMin, aMax, aScale) {
		var newNode = (new OvershootRangeNode()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		newNode.setPropertyInputWithoutNull("minValue", aMin);
		newNode.setPropertyInputWithoutNull("maxValue", aMax);
		
		var scaleNode = newNode.addDestroyableObject(MultiplicationNode.create(newNode.getProperty("overshootValue", aScale)));
		newNode.setPropertyInput("overshootOutput", scaleNode.getProperty("outputValue"));
		
		return newNode;
	};
	
	//METODO: base scale on timeline
});