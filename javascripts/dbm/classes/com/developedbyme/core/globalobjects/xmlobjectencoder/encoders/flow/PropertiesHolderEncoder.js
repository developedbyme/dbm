/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.flow.PropertiesHolderEncoder", "com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.flow.PropertiesHolderEncoder");
	
	//Self reference
	var PropertiesHolderEncoder = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.flow.PropertiesHolderEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("com.developedbyme.utils.xml.XmlModifier");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.flow.PropertiesHolderEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.flow.PropertiesHolderEncoder::_encodeValue");
		
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