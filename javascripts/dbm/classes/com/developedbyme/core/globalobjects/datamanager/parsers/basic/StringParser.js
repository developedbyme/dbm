dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.StringParser", "com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.StringParser");
	
	var StringParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.StringParser");
	
	var ParseStringNode = dbm.importClass("com.developedbyme.flow.nodes.parse.ParseStringNode");
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.StringParser::init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createInputLink = function(aInputProperty) {
		var parseNode = ParseStringNode.create(aInputProperty);
		return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
	};
	
	objectFunctions._createResult = function(aValue) {
		return ParserResultDataObject.create(aValue.toString());
	};
	
	staticFunctions.create = function() {
		var newStringParser = (new ClassReference()).init();
		return newStringParser;
	};
});