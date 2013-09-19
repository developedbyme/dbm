dbm.registerClass("com.developedbyme.flow.nodes.math.PowerNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.PowerNode");
	//"use strict";
	
	var PowerNode = dbm.importClass("com.developedbyme.flow.nodes.math.PowerNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.PowerNode::_init");
		
		this.superCall();
		
		this._base = this.createProperty("base", 0);
		this._exponent = this.createProperty("exponent", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunctionWithArguments("default", Math.pow, [this._base, this._exponent], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._base = null;
		this._exponent = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aBase, aExponent) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("base", aBase);
		newNode.setPropertyInputWithoutNull("exponent", aExponent);
		return newNode;
	};
});