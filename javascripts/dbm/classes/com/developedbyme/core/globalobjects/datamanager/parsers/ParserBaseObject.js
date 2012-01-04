dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject");
	
	var ParserBaseObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject");
	
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject::init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseXml = function(aXml, aPathReference, aType) {
		var parseResult = dbm.singletons.dbmDataManager.parseNodeValue(aXml, aPathReference, aType);
		if(parseResult == null) {
			parseResult = dbm.singletons.dbmDataManager.parseFirstChild(aXml, aPathReference);
			if(parseResult == null) {
				//METODO: error message
				return this._createNullResult();
			}
		}
		if(parseResult.isLinked) {
			return this._createInputLink(parseResult.result);
		}
		else {
			return this._createResult(parseResult.result);
		}
	}
	
	objectFunctions._createNullResult = function() {
		//MENOTE: should be overridden
		return ParserResultDataObject.create(null);
	};
	
	objectFunctions._createInputLink = function(aInputProperty) {
		//MENOTE: should be overridden
		return ParserResultDataObject.create(null);
	};
	
	objectFunctions._createResult = function(aValue) {
		//MENOTE: should be overridden
		return ParserResultDataObject.create(aValue);
	};
});