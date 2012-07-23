dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.complex.KeyValueParser", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.complex.KeyValueParser");
	
	var KeyValueParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.complex.KeyValueParser");
	
	var KeyValuePropertyPair = dbm.importClass("com.developedbyme.flow.data.KeyValuePropertyPair");
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.complex.KeyValueParser::init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseXml = function(aXml, aPathReference, aType) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.complex.KeyValueParser::parseXml");
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var keyParserResult = dbm.singletons.dbmDataManager.getAttribute(aXml, dataNamespace, "keyValue", aPathReference);
		var dataParserResult = dbm.singletons.dbmDataManager.getAttribute(aXml, dataNamespace, "dataValue", aPathReference);
		
		var keyValuePair = KeyValuePropertyPair.create(keyParserResult.result, dataParserResult.result);
		
		keyValuePair.getObjectProperty().setAsDirty();
		return ParserResultDataObject.createLinked(keyValuePair.getObjectProperty(), []);
	}
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.complex.KeyValueParser::create");
		var newKeyValueParser = (new ClassReference()).init();
		return newKeyValueParser;
	};
});