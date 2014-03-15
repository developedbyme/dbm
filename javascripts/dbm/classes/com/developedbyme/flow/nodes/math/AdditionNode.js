dbm.registerClass("com.developedbyme.flow.nodes.math.AdditionNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.AdditionNode");
	//"use strict";
	
	//Self reference
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.AdditionNode::_init");
		
		this.superCall();
		
		var inputValue1 = this.createProperty("inputValue1", 0);
		var inputValue2 = this.createProperty("inputValue2", 0);
		var outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [inputValue1, inputValue2], [outputValue]);
		
		return this;
	};
	
	staticFunctions._update = function(aInputValue1, aInputValue2) {
		//console.log("com.developedbyme.flow.nodes.math.AdditionNode::_update");
		return aInputValue1+aInputValue2;
	};
	
	staticFunctions.create = function(aInput1, aInput2) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue1", aInput1);
		newNode.setPropertyInputWithoutNull("inputValue2", aInput2);
		return newNode;
	};
});