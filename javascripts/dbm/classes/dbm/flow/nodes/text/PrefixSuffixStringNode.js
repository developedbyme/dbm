/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.text.PrefixSuffixStringNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.text.PrefixSuffixStringNode");
	
	//Self reference
	var PrefixSuffixStringNode = dbm.importClass("dbm.flow.nodes.text.PrefixSuffixStringNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.text.PrefixSuffixStringNode::_init");
		
		this.superCall();
		
		var inputValue = this.createProperty("inputValue", "");
		var prefix = this.createProperty("prefix", "");
		var suffix = this.createProperty("suffix", "");
		var outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [prefix, inputValue, suffix], [outputValue]);
		
		return this;
	};
	
	staticFunctions.create = function(aPrefix, aInputValue, aSuffix) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("prefix", aPrefix);
		newNode.setPropertyInputWithoutNull("inputValue", aInputValue);
		newNode.setPropertyInputWithoutNull("suffix", aSuffix);
		return newNode;
	};
	
	staticFunctions._update = function(aPrefix, aString, aSuffix) {
		return aPrefix+""+aString+""+aSuffix;
	};
});