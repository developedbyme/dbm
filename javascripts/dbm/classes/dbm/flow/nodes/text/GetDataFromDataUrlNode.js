/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.text.GetDataFromDataUrlNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.text.GetDataFromDataUrlNode");
	
	//Self reference
	var GetDataFromDataUrlNode = dbm.importClass("dbm.flow.nodes.text.GetDataFromDataUrlNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var UrlFunctions = dbm.importClass("dbm.utils.native.string.UrlFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.text.GetDataFromDataUrlNode::_init");
		
		this.superCall();
		
		var inputValue = this.createProperty("inputValue", "");
		var outputValue = this.createProperty("outputValue", "");
		
		this.createUpdateFunctionWithArguments("default", UrlFunctions.getDataFromDataUrl, [inputValue], [outputValue]);
		
		return this;
	};
	
	staticFunctions.create = function(aInput, aPaddingLength) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		return newNode;
	};
});