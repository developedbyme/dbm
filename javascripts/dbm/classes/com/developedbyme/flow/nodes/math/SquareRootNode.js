dbm.registerClass("com.developedbyme.flow.nodes.math.SquareRootNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.SquareRootNode");
	//"use strict";
	
	var SquareRootNode = dbm.importClass("com.developedbyme.flow.nodes.math.SquareRootNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.SquareRootNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunctionWithArguments("default", Math.sqrt, [this._inputValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInputValue) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInputValue);
		return newNode;
	};
});