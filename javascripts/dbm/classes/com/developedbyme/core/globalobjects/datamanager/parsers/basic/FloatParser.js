dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.FloatParser", "com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.FloatParser");
	
	var FloatParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.FloatParser");
	
	var ParseFloatNode = dbm.importClass("com.developedbyme.flow.nodes.parse.ParseFloatNode");
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.FloatParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createInputLink = function(aInputProperty) {
		var parseNode = ParseFloatNode.create(aInputProperty);
		return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
	};
	
	objectFunctions._createResult = function(aValue) {
		return ParserResultDataObject.create(parseFloat(aValue));
	};
	
	staticFunctions.create = function() {
		var newFloatParser = (new ClassReference()).init();
		return newFloatParser;
	};
});