dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser", "com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser");
	
	var TextReplacementParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser");
	
	var ToLowerCaseNode = dbm.importClass("com.developedbyme.flow.nodes.text.ToLowerCaseNode");
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser::init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createInputLink = function(aInputProperty) {
		var parseNode = ToLowerCaseNode.create(aInputProperty);
		return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
	};
	
	objectFunctions._createResult = function(aValue) {
		return ParserResultDataObject.create(aValue.toString().toLowerCase());
	};
	
	staticFunctions.create = function() {
		var newTextReplacementParser = (new ClassReference()).init();
		return newTextReplacementParser;
	};
});