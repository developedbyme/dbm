/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.encoders.flow.PropertiesHolderEncoder", "dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.flow.PropertiesHolderEncoder");
	
	//Self reference
	var PropertiesHolderEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.flow.PropertiesHolderEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("dbm.utils.xml.XmlModifier");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.flow.PropertiesHolderEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.flow.PropertiesHolderEncoder::_encodeValue");
		
		this.superCall(aValue, aNode);
		
		var currentArray = aValue.getPropertyNames();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPropertyName = currentArray[i];
			var newNode = this._encodeProperty(aValue.getProperty(currentPropertyName), aNode);
			newNode.name = currentPropertyName;
		}
	};
	
	staticFunctions.create = function() {
		var newPropertiesHolderEncoder = ClassReference._createAndInitClass(ClassReference);
		
		return newPropertiesHolderEncoder;
	};
});