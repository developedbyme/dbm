/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.text.PadNumberNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.text.PadNumberNode");
	
	//Self reference
	var PadNumberNode = dbm.importClass("dbm.flow.nodes.text.PadNumberNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var NumberFunctions = dbm.importClass("dbm.utils.native.number.NumberFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.text.PadNumberNode::_init");
		
		this.superCall();
		
		var inputValue = this.createProperty("inputValue", "");
		var paddingLength = this.createProperty("paddingLength", 0);
		var outputValue = this.createProperty("outputValue", "");
		
		this.createUpdateFunctionWithArguments("default", NumberFunctions.getPaddedNumber, [inputValue, paddingLength], [outputValue]);
		
		return this;
	};
	
	staticFunctions.create = function(aInput, aPaddingLength) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		newNode.setPropertyInputWithoutNull("paddingLength", aPaddingLength);
		return newNode;
	};
});