/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.ExportMetaDataEncoder", "dbm.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.ExportMetaDataEncoder");
	
	//Self reference
	var ExportMetaDataEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encoders.data.ExportMetaDataEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var EncodingDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.EncodingDataObject");
	
	//Utils
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("dbm.utils.xml.XmlModifier");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.ExportMetaDataEncoder::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.encoders.data.ExportMetaDataEncoder::_encodeValue");
		
		this.superCall(aValue, aNode);
		
		var namespaces = aValue.namespaces;
		var currentArray = namespaces.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			EncodingDataObject.createAttribute("xmlns:" + currentName, namespaces.getObject(currentName), aNode);
		}
	};
	
	staticFunctions.create = function() {
		var newExportMetaDataEncoder = ClassReference._createAndInitClass(ClassReference);
		
		newExportMetaDataEncoder.addVariableToEncode("metaData");
		newExportMetaDataEncoder.addVariableToEncode("data");
		
		return newExportMetaDataEncoder;
	};
});