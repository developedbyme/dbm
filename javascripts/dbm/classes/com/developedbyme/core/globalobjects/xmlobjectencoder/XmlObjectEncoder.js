/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.xmlobjectencoder.XmlObjectEncoder", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.XmlObjectEncoder");
	
	//Self reference
	var XmlObjectEncoder = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.XmlObjectEncoder");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var BaseObject = dbm.importClass("com.developedbyme.core.BaseObject");
	
	//Utils
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("com.developedbyme.utils.xml.XmlModifier");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ObjectFunctions = dbm.importClass("com.developedbyme.utils.native.object.ObjectFunctions");
	
	//Constants
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	dbm.setClassAsSingleton("dbmXmlObjectEncoder");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::_init");
		
		this.superCall();
		
		this._encodeSimpleValuesAsAttributes = true;
		this._useCdata = true;
		this._classEncoders = this.addDestroyableObject(NamedArray.create(true));
		
		return this;
	};
	
	objectFunctions.addClassEncoder = function(aClassName, aEncoder) {
		this._classEncoders.addObject(aClassName, aEncoder);
	};
	
	objectFunctions.encodeXmlFromObject = function(aObject) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::encodeXmlFromObject");
		var newXml = XmlCreator.createEmptyXml();
		
		this.encodeValue(aObject, newXml);
		
		return newXml;
	};
	
	objectFunctions._createDataNode = function(aType, aParentNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::_createDataNode");
		var newNode = XmlModifier.createNamespacedChild(aParentNode, dbm.xmlNamespaces.dbmData, "data", "item");
		XmlModifier.createNamespacedAttribute(newNode, dbm.xmlNamespaces.dbmData, "data", "type", aType);
		
		return newNode;
	};
	
	objectFunctions.encodeValue = function(aValue, aParentNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::encodeValue");
		var newXml = XmlCreator.createEmptyXml();
		
		var valueType = ObjectFunctions.typeOfValue(aValue);
		switch(valueType) {
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
				return this.encodeSimpleValue(aValue, valueType, aParentNode);
			case JavascriptObjectTypes.TYPE_FUNCTION:
				//MENOTE: i'm not sure that this is what is intended when you send a function
				return this.encodeFunction(aValue, aParentNode);
			case JavascriptObjectTypes.TYPE_XML:
				return this.encodeXml(aValue, aParentNode);
			default:
				//METODO: error message
				return this.encodeUnknownValue(aValue, aParentNode);
		}
	};
	
	objectFunctions.encodeSimpleValue = function(aValue, aType, aParentNode) {
		var newNode = this._createDataNode(aType, aParentNode);
		if(this._encodeSimpleValuesAsAttributes) {
			XmlModifier.createNamespacedAttribute(newNode, dbm.xmlNamespaces.dbmData, "data", "nodeValue", aValue);
		}
		else {
			XmlModifier.createText(newNode, aValue, this._useCdata);
		}
		
		return newNode;
	};
	
	objectFunctions.encodeNullValue = function(aParentNode) {
		var newNode = this._createDataNode(JavascriptObjectTypes.NON_REAL_TYPE_NULL, aParentNode);
		return newNode;
	};
	
	objectFunctions.encodeArray = function(aValue, aParentNode) {
		var newNode = this._createDataNode(JavascriptObjectTypes.NON_REAL_TYPE_ARRAY, aParentNode);
		var currentArray = aValue;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this.encodeValue(currentArray[i], newNode);
		}
		return newNode;
	};
	
	objectFunctions.encodeObject = function(aValue, aParentNode) {
		//console.log("com.developedbyme.core.globalobjects.xmlobjectencoder.XmlObjectEncoder::encodeObject");
		if(aValue instanceof BaseObject) {
			var className = aValue.__fullClassName;
			if(this._classEncoders.select(className)) {
				return this._classEncoders.currentSelectedItem.encode(aValue, className, aParentNode);
			}
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "encodeObject", "Object " + className + " has no encoder.");
			return null;
		}
		
		var newNode = this._createDataNode(JavascriptObjectTypes.TYPE_OBJECT, aParentNode);
		for(var objectName in aValue) {
			switch(objectName) {
				case "constructor":
				case "prototype":
				case "__proto__":
					//MENOTE: do nothing
					break;
				default:
					var currentChild = this.encodeValue(aValue[objectName], newNode);
					XmlModifier.createNamespacedAttribute(currentChild, dbm.xmlNamespaces.dbmData, "data", "name", objectName);
					break;
			}
		}
		return newNode;
	};
	
	objectFunctions.encodeFunction = function(aValue, aParentNode) {
		var newNode = this._createDataNode(JavascriptObjectTypes.TYPE_FUNCTION, aParentNode);
		XmlModifier.createText(newNode, aValue, true);
		return newNode;
	};
	
	objectFunctions.encodeXml = function(aValue, aParentNode) {
		var newNode = this._createDataNode(JavascriptObjectTypes.TYPE_XML, aParentNode);
		newNode.appendChild(newNode.getOwnerDocument().importNode(aValue, true));
		return newNode;
	};
	
	objectFunctions.encodeUnknownValue = function(aValue, aParentNode) {
		var newNode = this._createDataNode(JavascriptObjectTypes.NON_REAL_TYPE_UNKNOWN, aParentNode);
		XmlModifier.createText(newNode, aValue, true);
		return newNode;
	};
});