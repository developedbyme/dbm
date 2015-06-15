/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.NamedArrayEncoder", "dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.NamedArrayEncoder");
	
	//Self reference
	var NamedArrayEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.NamedArrayEncoder");
	
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
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.NamedArrayEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.NamedArrayEncoder::_encodeValue");
		
		this.superCall(aValue, aNode);
		
		var currentArray = aValue.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			var currentObject = aValue.getObject(currentName);
			
			var newNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(currentObject, aNode);
			newNode.name = currentName;
			newNode.parentApplyType = "namedArray/addObject";
		}
	};
	
	staticFunctions.create = function() {
		var newNamedArrayEncoder = ClassReference._createAndInitClass(ClassReference);
		
		newNamedArrayEncoder.addVariableToEncode("ownsObjects");
		
		return newNamedArrayEncoder;
	};
});