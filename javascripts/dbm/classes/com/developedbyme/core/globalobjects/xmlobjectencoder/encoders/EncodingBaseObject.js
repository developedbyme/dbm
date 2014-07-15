/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject");
	
	//Self reference
	var EncodingBaseObject = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("com.developedbyme.utils.xml.XmlModifier");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::_init");
		
		this.superCall();
		
		this._variableNamesArray = new Array();
		this._propertyNamesArray = new Array();
		
		return this;
	};
	
	objectFunctions.addVariableToEncode = function(aName) {
		this._variableNamesArray.push(aName);
		
		return this;
	};
	
	objectFunctions.addVariablesToEncode = function(aNames) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::addVariablesToEncode");
		//console.log(aNames);
		ArrayFunctions.concatToArray(this._variableNamesArray, aNames);
		
		return this;
	};
	
	objectFunctions.addPropertyToEncode = function(aName) {
		this._propertyNamesArray.push(aName);
		
		return this;
	};
	
	objectFunctions.addPropertiesToEncode = function(aNames) {
		ArrayFunctions.concatToArray(this._propertyNamesArray, aNames);
		
		return this;
	};
	
	objectFunctions._createDataNode = function(aType, aClassName, aParentNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::_createDataNode");
		var newNode = XmlModifier.createNamespacedChild(aParentNode, dbm.xmlNamespaces.dbmData, "data", "item");
		XmlModifier.createNamespacedAttribute(newNode, dbm.xmlNamespaces.dbmData, "data", "type", aType);
		XmlModifier.createNamespacedAttribute(newNode, dbm.xmlNamespaces.dbmData, "data", "class", aClassName);
		
		return newNode;
	};
	
	objectFunctions._encodeVariables = function(aValue, aNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::_encodeVariables");
		//console.log(aValue, this._variableNamesArray);
		
		var currentArray = this._variableNamesArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentVariableName = currentArray[i];
			var newNode = dbm.singletons.dbmXmlObjectEncoder.encodeValue(aValue[currentVariableName], aNode);
			//METODO: check for null
			XmlModifier.createNamespacedAttribute(newNode, dbm.xmlNamespaces.dbmData, "data", "name", currentVariableName);
		}
	};
	
	objectFunctions._encodeProperties = function(aValue, aNode) {
		var currentArray = this._propertyNamesArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPropertyName = currentArray[i];
			var currentProperty = aValue.getProperty(currentPropertyName);
			//METODO: check for null
			var newNode = this._encodeProperty(currentProperty, aNode);
			XmlModifier.createNamespacedAttribute(newNode, dbm.xmlNamespaces.dbmData, "data", "name", currentPropertyName);
			XmlModifier.createNamespacedAttribute(newNode, dbm.xmlNamespaces.dbmData, "data", "parentApplyType", "setPropertyInput");
		}
	};
	
	objectFunctions._encodeValue = function(aValue, aNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::_encodeValue");
		
		this._encodeVariables(aValue, aNode);
		this._encodeProperties(aValue, aNode);
	};
	
	objectFunctions.encode = function(aValue, aClassName, aParentNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::encode");
		var returnNode = this._createDataNode("dbmObject", aClassName, aParentNode);
		this._encodeValue(aValue, returnNode);
		return returnNode;
	};
	
	objectFunctions._encodeProperty = function(aProperty, aParentNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.encoders.EncodingBaseObject::encode");
		//console.log(aProperty, aParentNode);
		
		if(aProperty._inputConnection === null && aProperty._inputUpdateFunction === null) {
			return dbm.singletons.dbmXmlObjectEncoder.encodeValue(aProperty.getValue(), aParentNode);
		}
		else {
			//METODO: link up property
			return null; //MEDEBUG
		}
	};
	
	staticFunctions.create = function() {
		var newEncodingBaseObject = ClassReference._createAndInitClass(ClassReference);
		
		return newEncodingBaseObject;
	};
});