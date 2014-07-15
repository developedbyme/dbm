/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.text.GetDataFromDataUrlNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.text.GetDataFromDataUrlNode");
	
	//Self reference
	var GetDataFromDataUrlNode = dbm.importClass("com.developedbyme.flow.nodes.text.GetDataFromDataUrlNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var UrlFunctions = dbm.importClass("com.developedbyme.utils.native.string.UrlFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.text.GetDataFromDataUrlNode::_init");
		
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