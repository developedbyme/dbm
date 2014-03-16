/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.math.round.RoundNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.round.RoundNode");
	
	var RoundNode = dbm.importClass("com.developedbyme.flow.nodes.math.round.RoundNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.round.RoundNode::_init");
		
		this.superCall();
		
		var inputValue = this.createProperty("inputValue", 0);
		var outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunctionWithArguments("default", Math.round, [inputValue], [outputValue]);
		
		return this;
	};
	
	staticFunctions.create = function(aInput) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		return newNode;
	};
});