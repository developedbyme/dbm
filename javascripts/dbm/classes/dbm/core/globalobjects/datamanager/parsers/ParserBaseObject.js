/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.parsers.ParserBaseObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.parsers.ParserBaseObject");
	
	var ParserBaseObject = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.ParserBaseObject");
	
	var ParserResultDataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.parsers.ParserBaseObject::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseXml = function(aXml, aPathReference, aType) {
		var parseResult = dbm.singletons.dbmDataManager.parseNodeValue(aXml, aPathReference, aType);
		if(parseResult === null) {
			parseResult = dbm.singletons.dbmDataManager.parseFirstChild(aXml, aPathReference);
			if(parseResult === null) {
				//METODO: error message
				return this._createNullResult(aXml, aPathReference);
			}
		}
		if(parseResult.isLinked) {
			return this._createInputLink(parseResult.result, aXml, aPathReference);
		}
		else {
			return this._createResult(parseResult.result, aXml, aPathReference);
		}
	};
	
	objectFunctions._createNullResult = function(aXml, aPathReference) {
		//MENOTE: should be overridden
		return ParserResultDataObject.create(null);
	};
	
	objectFunctions._createInputLink = function(aInputProperty, aXml, aPathReference) {
		//MENOTE: should be overridden
		return ParserResultDataObject.create(null);
	};
	
	objectFunctions._createResult = function(aValue, aXml, aPathReference) {
		//MENOTE: should be overridden
		return ParserResultDataObject.create(aValue);
	};
});