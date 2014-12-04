/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.parsers.complex.KeyValueParser", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.parsers.complex.KeyValueParser");
	
	var KeyValueParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.complex.KeyValueParser");
	
	var KeyValuePropertyPair = dbm.importClass("dbm.flow.data.KeyValuePropertyPair");
	var ParserResultDataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.parsers.complex.KeyValueParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseXml = function(aXml, aPathReference, aType) {
		//console.log("dbm.core.globalobjects.datamanager.parsers.complex.KeyValueParser::parseXml");
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var keyParserResult = dbm.singletons.dbmDataManager.getAttribute(aXml, dataNamespace, "keyValue", aPathReference);
		var dataParserResult = dbm.singletons.dbmDataManager.getAttribute(aXml, dataNamespace, "dataValue", aPathReference);
		
		var keyValuePair = KeyValuePropertyPair.create(keyParserResult.result, dataParserResult.result);
		
		//METODO: fix this since getObjectProperty() doesn't exist anymore
		keyValuePair.getObjectProperty().setAsDirty();
		return ParserResultDataObject.createLinked(keyValuePair.getObjectProperty(), []);
	};
	
	staticFunctions.create = function() {
		//console.log("dbm.core.globalobjects.datamanager.parsers.complex.KeyValueParser::create");
		var newKeyValueParser = (new ClassReference()).init();
		return newKeyValueParser;
	};
});