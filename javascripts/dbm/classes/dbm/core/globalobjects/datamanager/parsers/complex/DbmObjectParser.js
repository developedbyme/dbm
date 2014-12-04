/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.parsers.complex.DbmObjectParser", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.parsers.complex.DbmObjectParser");
	
	//Self reference
	var DbmObjectParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.complex.DbmObjectParser");
	
	//Error report
	
	//Dependencies
	var ParserResultDataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.parsers.complex.DbmObjectParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseXml = function(aXml, aPathReference, aType) {
		//console.log("dbm.core.globalobjects.datamanager.parsers.complex.DbmObjectParser::parseXml");
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
		//console.log("dbm.core.globalobjects.datamanager.parsers.complex.DbmObjectParser::create");
		var newDbmObjectParser = (new ClassReference()).init();
		return newDbmObjectParser;
	};
});