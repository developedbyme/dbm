/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.complex.DbmObjectParser", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.complex.DbmObjectParser");
	
	//Self reference
	var DbmObjectParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.complex.DbmObjectParser");
	
	//Error report
	
	//Dependencies
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.complex.DbmObjectParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseXml = function(aXml, aPathReference, aType) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.complex.DbmObjectParser::parseXml");
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var classResult = dbm.singletons.dbmDataManager.getAttribute(aXml, dataNamespace, "class", aPathReference);
		
		var className = classResult.result;
		var theClass = dbm.getClass(className);
		if(theClass === null) {
			//METODO: error message
			return ParserResultDataObject.create(null);;
		}
		var returnObject = new theClass();
		returnObject.init();
		
		var result = ParserResultDataObject.create(returnObject, []);
		result.childrenIsProperties = 1;
		
		return result;
	};
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.complex.DbmObjectParser::create");
		var newDbmObjectParser = (new ClassReference()).init();
		return newDbmObjectParser;
	};
});