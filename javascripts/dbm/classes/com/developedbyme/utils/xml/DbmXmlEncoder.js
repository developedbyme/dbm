dbm.registerClass("com.developedbyme.utils.xml.DbmXmlEncoder", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.xml.DbmXmlEncoder");
	
	var DbmXmlEncoder = dbm.importClass("com.developedbyme.utils.xml.DbmXmlEncoder");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	var XmlModifier = dbm.importClass("com.developedbyme.utils.xml.XmlModifier");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ObjectFunctions = dbm.importClass("com.developedbyme.utils.native.object.ObjectFunctions");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	staticFunctions.DEFAULT_USE_CDATA = true;
	
	staticFunctions.encodeXmlFromObject = function(aObject) {
		//console.log("com.developedbyme.utils.xml.DbmXmlEncoder::encodeXmlFromObject");
		var newXml = XmlCreator.createEmptyXml();
		
		ClassReference.encodeValue(aObject, newXml);
		
		return newXml;
	};
	
	staticFunctions._createDataNode = function(aType, aParentNode) {
		//console.log("com.developedbyme.utils.xml.DbmXmlEncoder::_createDataNode");
		var newNode = XmlModifier.createNamespacedChild(aParentNode, "http://www.example.com", "data", "item");
		XmlModifier.createNamespacedAttribute(newNode, "http://www.example.com", "data", "type", aType);
		
		return newNode;
	};
	
	staticFunctions.encodeValue = function(aValue, aParentNode) {
		//console.log("com.developedbyme.utils.xml.DbmXmlEncoder::encodeValue");
		var newXml = XmlCreator.createEmptyXml();
		
		var valueType = ObjectFunctions.typeOfValue(aValue);
		switch(valueType) {
			case JavascriptObjectTypes.TYPE_UNDEFINED:
			case JavascriptObjectTypes.NON_REAL_TYPE_NULL:
				return ClassReference.encodeNullValue(aParentNode);
			case JavascriptObjectTypes.NON_REAL_TYPE_ARRAY:
				return ClassReference.encodeArray(aValue, aParentNode);
				break;
			case JavascriptObjectTypes.TYPE_OBJECT:
				return ClassReference.encodeObject(aValue, aParentNode);
				break;
			case JavascriptObjectTypes.TYPE_BOOLEAN:
			case JavascriptObjectTypes.TYPE_NUMBER:
			case JavascriptObjectTypes.TYPE_STRING:
				return ClassReference.encodeSimpleValue(aValue, valueType, aParentNode);
			case JavascriptObjectTypes.TYPE_FUNCTION:
				//MENOTE: i'm not sure that this is what is intended when you send a function
				return ClassReference.encodeFunction(aValue, aParentNode);
			case JavascriptObjectTypes.TYPE_XML:
				return ClassReference.encodeXml(aValue, aParentNode);
			default:
				//METODO: error message
				return ClassReference.encodeUnknownValue(aValue, aParentNode);
		}
	};
	
	staticFunctions.encodeSimpleValue = function(aValue, aType, aParentNode) {
		var newNode = ClassReference._createDataNode(aType, aParentNode);
		XmlModifier.createText(newNode, aValue, ClassReference.DEFAULT_USE_CDATA);
		return newNode;
	};
	
	staticFunctions.encodeNullValue = function(aParentNode) {
		var newNode = ClassReference._createDataNode(JavascriptObjectTypes.NON_REAL_TYPE_NULL, aParentNode);
		return newNode;
	};
	
	staticFunctions.encodeArray = function(aValue, aParentNode) {
		var newNode = ClassReference._createDataNode(JavascriptObjectTypes.NON_REAL_TYPE_ARRAY, aParentNode);
		var currentArray = aValue;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			ClassReference.encodeValue(currentArray[i], newNode);
		}
		return newNode;
	};
	
	staticFunctions.encodeObject = function(aValue, aParentNode) {
		//console.log("com.developedbyme.utils.xml.DbmXmlEncoder::encodeObject");
		var newNode = ClassReference._createDataNode(JavascriptObjectTypes.TYPE_OBJECT, aParentNode);
		for(var objectName in aValue) {
			switch(objectName) {
				case "constructor":
				case "prototype":
				case "__proto__":
					//MENOTE: do nothing
					break;
				default:
					var currentChild = ClassReference.encodeValue(aValue[objectName], newNode);
					XmlModifier.createNamespacedAttribute(currentChild, "http://www.example.com", "data", "name", objectName);
					break;
			}
		}
		return newNode;
	};
	
	staticFunctions.encodeFunction = function(aValue, aParentNode) {
		var newNode = ClassReference._createDataNode(JavascriptObjectTypes.TYPE_FUNCTION, aParentNode);
		XmlModifier.createText(newNode, aValue, true);
		return newNode;
	};
	
	staticFunctions.encodeXml = function(aValue, aParentNode) {
		var newNode = ClassReference._createDataNode(JavascriptObjectTypes.TYPE_XML, aParentNode);
		newNode.appendChild(newNode.getOwnerDocument().importNode(aValue, true));
		return newNode;
	};
	
	staticFunctions.encodeUnknownValue = function(aValue, aParentNode) {
		var newNode = ClassReference._createDataNode(JavascriptObjectTypes.NON_REAL_TYPE_UNKNOWN, aParentNode);
		XmlModifier.createText(newNode, aValue, true);
		return newNode;
	};
});