/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.PowerNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.PowerNode");
	//"use strict";
	
	var PowerNode = dbm.importClass("dbm.flow.nodes.math.PowerNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.PowerNode::_init");
		
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