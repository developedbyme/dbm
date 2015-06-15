/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder");
	
	//Self reference
	var XmlObjectEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var BaseObject = dbm.importClass("dbm.core.BaseObject");
	var EncodingDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.EncodingDataObject");
	var XmlStringFormatEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.formatencoders.XmlStringFormatEncoder");
	var ExportMetaDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.ExportMetaDataObject");
	
	//Utils
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("dbm.utils.xml.XmlModifier");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ObjectFunctions = dbm.importClass("dbm.utils.native.object.ObjectFunctions");
	var IsoDate = dbm.importClass("dbm.utils.native.date.IsoDate");
	
	//Constants
	var XmlNodeTypes = dbm.importClass("dbm.constants.xml.XmlNodeTypes");
	var JavascriptObjectTypes = dbm.importClass("dbm.constants.JavascriptObjectTypes");
	
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::_init");
		
		this.superCall();
		
		this._encodeSimpleValuesAsAttributes = true;
		this._useCdata = true;
		this._classEncoders = this.addDestroyableObject(NamedArray.create(true));
		this._classCustomTypeEncoders = this.addDestroyableObject(NamedArray.create(true));
		this._customTypeEncoders = this.addDestroyableObject(NamedArray.create(true));
		
		return this;
	};
	
	objectFunctions.addClassEncoder = function(aClassName, aEncoder) {
		this._classEncoders.addObject(aClassName, aEncoder);
	};
	
	objectFunctions.addClassCustomType = function(aClassName, aType, aEncoder) {
		this._classCustomTypeEncoders.addObject(aClassName, aType);
		
		if(VariableAliases.isSet(aEncoder)) {
			this.addCustomTypeEncoder(aType, aEncoder);
		}
	};
	
	objectFunctions.addCustomTypeEncoder = function(aType, aEncoder) {
		this._customTypeEncoders.addObject(aType, aEncoder);
	};
	
	objectFunctions.createExportDataObject = function(aType) {
		var returnObject = ExportMetaDataObject.create();
		
		var currentDate = new Date();
		
		returnObject.metaData.addObject("exportDate", IsoDate.getIsoDateAndTime(currentDate));
		returnObject.metaData.addObject("exportType", aType);
		returnObject.metaData.addObject("environment", dbm.getEnvironmentName());
		
		returnObject.namespaces.addObject("data", dbm.xmlNamespaces.dbmData);
		
		return returnObject;
	};
	
	objectFunctions.encodeXmlFromObject = function(aObject) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::encodeXmlFromObject");
		
		var rootObject = EncodingDataObject.create();
		rootObject.type = "root";
		rootObject.dataType = "root";
		rootObject.nodeValue = new Array();
		
		this.encodeValue(aObject, rootObject);
		
		var xmlEncoder = XmlStringFormatEncoder.create();
		var returnString = xmlEncoder.encode(rootObject);
		
		return returnString;
	};
	
	objectFunctions.encodeValue = function(aValue, aParentNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::encodeValue");
		//console.log(aValue, aParentNode);
		
		var valueType = ObjectFunctions.typeOfValue(aValue);
		
		return this.encodeValueWithType(aValue, valueType, aParentNode);
	};
	
	objectFunctions.encodeValueWithType = function(aValue, aType, aParentNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::encodeValueWithType");
		//console.log(aValue, aType, aParentNode);
		
		switch(aType) {
			case JavascriptObjectTypes.TYPE_UNDEFINED:
			case JavascriptObjectTypes.NON_REAL_TYPE_NULL:
				return this.encodeNullValue(aParentNode);
			case JavascriptObjectTypes.NON_REAL_TYPE_ARRAY:
				return this.encodeArray(aValue, aParentNode);
			case JavascriptObjectTypes.TYPE_OBJECT:
				return this.encodeObject(aValue, aParentNode);
			case JavascriptObjectTypes.TYPE_BOOLEAN:
			case JavascriptObjectTypes.TYPE_NUMBER:
			case JavascriptObjectTypes.TYPE_STRING:
				return this.encodeSimpleValue(aValue, aType, aParentNode);
			case JavascriptObjectTypes.TYPE_FUNCTION:
				//MENOTE: i'm not sure that this is what is intended when you send a function
				return this.encodeFunction(aValue, aParentNode);
			case JavascriptObjectTypes.TYPE_XML:
				return this.encodeXml(aValue, aParentNode);
			default:
				return this.encodeCustomValue(aValue, aType, aParentNode);
		}
	};
	
	objectFunctions.encodeSimpleValue = function(aValue, aType, aParentNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::encodeSimpleValue");
		
		var newNode = EncodingDataObject.createSimpleValue(aType, aValue, aParentNode);
		
		return newNode;
	};
	
	objectFunctions.encodeNullValue = function(aParentNode) {
		var newNode = EncodingDataObject.createSimpleValue(JavascriptObjectTypes.NON_REAL_TYPE_NULL, null, aParentNode);
		return newNode;
	};
	
	objectFunctions.encodeArray = function(aValue, aParentNode) {
		var newNode = EncodingDataObject.createComplexValue(JavascriptObjectTypes.NON_REAL_TYPE_ARRAY, aParentNode);
		var currentArray = aValue;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this.encodeValue(currentArray[i], newNode);
		}
		return newNode;
	};
	
	objectFunctions.encodeObject = function(aValue, aParentNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::encodeObject");
		if(aValue instanceof BaseObject) {
			var className = aValue.__fullClassName;
			if(this._classEncoders.select(className)) {
				return this._classEncoders.currentSelectedItem.encodeClass(aValue, className, aParentNode);
			}
			if(this._classCustomTypeEncoders.select(className)) {
				return this.encodeValueWithType(aValue, this._classCustomTypeEncoders.currentSelectedItem, aParentNode);
			}
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "encodeObject", "Object " + className + " has no encoder.");
			return this.encodeUnknownValue(aValue, aParentNode);
		}
		
		var newNode = EncodingDataObject.createComplexValue(JavascriptObjectTypes.TYPE_OBJECT, aParentNode);
		//var newNode = this._createDataNode(JavascriptObjectTypes.TYPE_OBJECT, aParentNode);
		for(var objectName in aValue) {
			switch(objectName) {
				case "constructor":
				case "prototype":
				case "__proto__":
					//MENOTE: do nothing
					break;
				default:
					var currentChild = this.encodeValue(aValue[objectName], newNode);
					currentChild.name = objectName;
					break;
			}
		}
		return newNode;
	};
	
	objectFunctions.encodeFunction = function(aValue, aParentNode) {
		var newNode = EncodingDataObject.createSimpleValue(JavascriptObjectTypes.TYPE_FUNCTION, aValue.toString(), aParentNode);
		return newNode;
	};
	
	objectFunctions.encodeXml = function(aValue, aParentNode) {
		var newNode = EncodingDataObject.createSimpleValue(JavascriptObjectTypes.TYPE_XML, null, aParentNode);
		//METODO: add value
		return newNode;
	};
	
	objectFunctions.encodeCustomValue = function(aValue, aType, aParentNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::encodeCustomValue");
		//console.log(aValue, aType, aParentNode);
		
		if(this._customTypeEncoders.select(aType)) {
			var newNode = EncodingDataObject.createComplexValue(aType, aParentNode);
			return this._customTypeEncoders.currentSelectedItem.encode(aValue, newNode);
		}
		//METODO: error message
		return this.encodeUnknownValue(aValue, aParentNode);
	};
	
	objectFunctions.encodeUnknownValue = function(aValue, aParentNode) {
		//console.log("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::encodeUnknownValue");
		var newNode = EncodingDataObject.createSimpleValue(JavascriptObjectTypes.NON_REAL_TYPE_UNKNOWN, aValue.toString(), aParentNode);
		return newNode;
	};
});