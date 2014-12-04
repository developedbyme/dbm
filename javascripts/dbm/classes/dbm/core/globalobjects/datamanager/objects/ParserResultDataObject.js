/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	var ParserResultDataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	var ArrayHolder = dbm.importClass("dbm.utils.data.ArrayHolder");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	
	var AssetStatusTypes = dbm.importClass("dbm.constants.AssetStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject::_init");
		
		this.superCall();
		
		this.result = null;
		this.isLinked = false;
		this.childrenIsProperties = 0;
		this.parentApplyType = null;
		this.nodes = null;
		
		return this;
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.result = null;
		this.nodes = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aResult) {
		var newParserResultDataObject = (new ClassReference()).init();
		newParserResultDataObject.result = aResult;
		return newParserResultDataObject;
	};
	
	staticFunctions.createLinked = function(aResultLink, aNodes) {
		var newParserResultDataObject = (new ClassReference()).init();
		newParserResultDataObject.result = aResultLink;
		newParserResultDataObject.isLinked = true;
		newParserResultDataObject.nodes = aNodes;
		return newParserResultDataObject;
	};
});