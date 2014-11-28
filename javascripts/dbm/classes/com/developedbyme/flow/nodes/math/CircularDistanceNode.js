/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.math.CircularDistanceNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.CircularDistanceNode");
	
	//Self reference
	var CircularDistanceNode = dbm.importClass("com.developedbyme.flow.nodes.math.CircularDistanceNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var NumberFunctions = dbm.importClass("com.developedbyme.utils.native.number.NumberFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.CircularDistanceNode::_init");
		
		this.superCall();
		
		var inputValue = this.createProperty("inputValue", 0);
		var baseValue = this.createProperty("baseValue", 0);
		var length = this.createProperty("length", 2*Math.PI);
		var outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [inputValue, baseValue, length], [outputValue]);
		
		return this;
	};
	
	staticFunctions._update = function(aInputValue, aBaseValue, aLength) {
		//console.log("com.developedbyme.flow.nodes.math.CircularDistanceNode::_update");
		
		var inputValue = NumberFunctions.floatModulus(aInputValue, aLength);
		var baseValue = NumberFunctions.floatModulus(aBaseValue, aLength);
		
		if(inputValue > baseValue) {
			if(inputValue-baseValue < 0.5*aLength) {
				return inputValue-baseValue;
			}
			else {
				return inputValue-(baseValue+aLength);
			}
		}
		else {
			if(baseValue-inputValue < 0.5*aLength) {
				return inputValue-baseValue;
			}
			else {
				return inputValue-(baseValue-aLength);
			}
		}
	};
	
	staticFunctions.create = function(aInput, aBase, aLength) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		newNode.setPropertyInputWithoutNull("baseValue", aBase);
		newNode.setPropertyInputWithoutNull("length", aLength);
		return newNode;
	};
});