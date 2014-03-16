/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.xml.XmlChildRetreiver", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	staticFunctions.WARN_FOR_NO_XML = false;
	staticFunctions.WARN_FOR_NO_RESULT = false;
	
	staticFunctions._reportWarning = function(aShouldWarn, aFunctionName, aText) {
		if(aShouldWarn) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", aFunctionName, aText);
		}
	};
	
	staticFunctions.getFirstChild = function(aXml) {
		if(aXml === null) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_XML, "getFirstChild", "Xml is null");
			return null;
		}
		
		var currentArray = aXml.childNodes;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			if(currentChild.nodeType === XmlNodeTypes.ELEMENT_NODE) {
				return currentChild;
			}
		}
		
		ClassReference._reportWarning(ClassReference.WARN_FOR_NO_RESULT, "getFirstChild", "No result in " + aXml);
		return null;
	};
	
	staticFunctions.getChild = function(aXml, aChildName) {
		//console.log("com.developedbyme.utils.xml.XmlChildRetreiver::getChild (static)");
		//console.log(aXml, aChildName);
		if(aXml === null) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_XML, "getChild", "Xml is null");
			return null;
		}
		
		var returnArray = ClassReference.getChilds();
		
		if(returnArray.length === 0) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_RESULT, "getChild", "No result in " + aXml);
			return null;
		}
		if(returnArray.length > 1) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getChild", "More than 1 child matches the query, selecting first.");
		}
		return returnArray[0];
	};
	
	staticFunctions.getNamespacedChild = function(aXml, aChildNamespace, aChildName) {
		//console.log("com.developedbyme.utils.xml.XmlChildRetreiver::getNamespacedChild (static)");
		//console.log(aXml, aChildNamespace, aChildName);
		if(aXml === null) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_XML, "getNamespacedChild", "Xml is null");
			return null;
		}
		
		var returnArray = new Array();
		var currentArray = aXml.childNodes;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			if(currentChild.namespaceURI === aChildNamespace && currentChild.localName === aChildName) {
				returnArray.push(currentChild);
			}
		}
		
		if(returnArray.length === 0) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_RESULT, "getNamespacedChild", "No result in " + aXml);
			return null;
		}
		if(returnArray.length > 1) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedChild", "More than 1 child matches the query, selecting first.");
		}
		return returnArray[0];
	};
	
	staticFunctions.getChilds = function(aXml, aChildName) {
		//console.log("com.developedbyme.utils.xml.XmlChildRetreiver::getChilds (static)");
		aChildName = VariableAliases.valueWithDefault(aChildName, "*");
		//console.log(aXml, ChildName);
		
		var returnArray = new Array();
		
		if(aXml === null) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_XML, "getChildByAttribute", "Xml is null");
			return returnArray;
		}
		
		var currentArray = aXml.childNodes;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			
			if((currentChild.nodeType === XmlNodeTypes.ELEMENT_NODE) && ((aChildName === "*") || (currentChild.nodeName === aChildName))) {
				returnArray.push(currentChild);
			}
		}
		
		if(returnArray.length === 0) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_RESULT, "getChildByAttribute", "No result in " + aXml);
			return returnArray;
		}
		return returnArray;
	};
	
	staticFunctions.getChildByAttribute = function(aXml, aAttributeName, aValue, aChildName) {
		//console.log("com.developedbyme.utils.xml.XmlChildRetreiver::getChildByAttribute (static)");
		aChildName = VariableAliases.valueWithDefault(aChildName, "*");
		//console.log(aXml, aAttributeName, aValue, aChildName);
		
		if(aXml === null) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_XML, "getChildByAttribute", "Xml is null");
			return null;
		}
		
		var returnArray = new Array();
		var currentArray = aXml.childNodes;
		if(currentArray === null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getChildByAttribute", "Xml " + aXml + " doesn't seem to be a correct xml. Can't get child (" + aChildName + ") with attribute " + aAttributeName + " set to " + aValue);
			return null;
		}
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			
			if((currentChild.nodeType === XmlNodeTypes.ELEMENT_NODE) && ((aChildName === "*") || (currentChild.nodeName === aChildName)) && (ClassReference.getAttribute(currentChild, aAttributeName) === aValue)) {
				returnArray.push(currentChild);
			}
		}
		
		if(returnArray.length === 0) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_RESULT, "getChildByAttribute", "No result in " + aXml);
			return null;
		}
		if(returnArray.length > 1) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getChildByAttribute", "More than 1 child matches the query, selecting first.");
		}
		return returnArray[0];
	};
	
	staticFunctions.getNamespacedChildByNamespacedAttribute = function(aXml, aAttributeNamespace, aAttributeName, aValue, aChildNamespace, aChildName) {
		//console.log("com.developedbyme.utils.xml.XmlChildRetreiver::getNamespacedChildByNamespacedAttribute (static)");
		
		if(aXml === null) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_XML, "getNamespacedChildByNamespacedAttribute", "Xml is null");
			return null;
		}
		
		var returnArray = new Array();
		var currentArray = aXml.childNodes;
		if(currentArray === null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedChildByNamespacedAttribute", "Xml " + aXml + " doesn't seem to be a correct xml. Can't get child (" + aChildName + ") with attribute " + aAttributeName + " set to " + aValue);
			return null;
		}
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			
			if((currentChild.nodeType === XmlNodeTypes.ELEMENT_NODE) && ((currentChild.namespaceURI === aChildNamespace) && (currentChild.localName === aChildName)) && (ClassReference.getNamespacedAttribute(currentChild, aAttributeNamespace, aAttributeName) === aValue)) {
				returnArray.push(currentChild);
			}
		}
		
		if(returnArray.length === 0) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_RESULT, "getNamespacedChildByNamespacedAttribute", "No result in " + aXml);
			return null;
		}
		if(returnArray.length > 1) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedChildByNamespacedAttribute", "More than 1 child matches the query, selecting first.");
		}
		return returnArray[0];
	};
	
	staticFunctions.getNodeValue = function(aXml) {
		if(aXml === null) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_XML, "getNodeValue", "Xml is null");
			return null;
		}
		
		if(aXml.nodeType === XmlNodeTypes.TEXT_NODE || aXml.nodeType === XmlNodeTypes.CDATA_SECTION_NODE) {
			return String(aXml.nodeValue);
		}
		else if(aXml.nodeType === XmlNodeTypes.ELEMENT_NODE) {
			if(ClassReference.hasSimpleContent(aXml)) {
				return String(aXml.firstChild.nodeValue);
			}
		}
		
		ClassReference._reportWarning(ClassReference.WARN_FOR_NO_RESULT, "getNodeValue", "No result in " + aXml);
		
		return null;
	};
	
	staticFunctions.getAttribute = function(aXml, aAttributeName) {
		if(aXml === null) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_XML, "getAttribute", "Xml is null");
			return null;
		}
		if(aXml.nodeType !== XmlNodeTypes.ELEMENT_NODE) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getAttribute", "Node is not an element.");
			return null;
		}
		if(aXml.hasAttribute) {
			if(!aXml.hasAttribute(aAttributeName)) {
				ClassReference._reportWarning(ClassReference.WARN_FOR_NO_RESULT, "getAttribute", "No result in " + aXml);
				return null;
			}
			return aXml.getAttribute(aAttributeName);
		}
		else {
			//MENOTE: IE uses an array with name => value
			var attributesArray = aXml.attributes;
			var attributesArrayLength = attributesArray.length;
			for(var i = 0; i < attributesArrayLength; i++) {
				var currentAttribute = attributesArray[i];
				if(currentAttribute["name"] === aAttributeName) {
					return currentAttribute["value"];
				}
			}
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_RESULT, "getAttribute", "No result in " + aXml);
			return null;
		}
	};
	
	staticFunctions.getNamespacedAttribute = function(aXml, aAttributeNamespace, aAttributeName) {
		if(aXml === null) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_XML, "getNamespacedAttribute", "Xml is null");
			return null;
		}
		if(aXml.nodeType !== XmlNodeTypes.ELEMENT_NODE) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedAttribute", "Node is not an element.");
			return null;
		}
		
		if(!aXml.hasAttributeNS(aAttributeNamespace, aAttributeName)) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_RESULT, "getNamespacedAttribute", "No result in " + aXml);
			return null;
		}
		return aXml.getAttributeNS(aAttributeNamespace, aAttributeName);
		
	};
	
	staticFunctions.hasSimpleContent = function(aXml) {
		if(aXml === null) {
			ClassReference._reportWarning(ClassReference.WARN_FOR_NO_XML, "hasSimpleContent", "Xml is null");
			return false;
		}
		if((aXml.childNodes.length === 1) && (aXml.firstChild.nodeType === XmlNodeTypes.TEXT_NODE || aXml.firstChild.nodeType === XmlNodeTypes.CDATA_SECTION_NODE)) {
			return true;
		}
		return false;
	};
	
	staticFunctions.getFirstTextNode = function(aXml) {
		//console.log("com.developedbyme.utils.xml.XmlChildRetreiver::getTextNode (static)");
		
		var currentArray = aXml.childNodes;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			
			if(currentChild.nodeType === XmlNodeTypes.TEXT_NODE || currentChild.nodeType === XmlNodeTypes.CDATA_SECTION_NODE) {
				return currentChild;
			}
		}
		
		//METODO: error message
		return null;
	};
	
	staticFunctions.getAllValuesForAttribute = function(aXml, aAttributeName, aReturnArray) {
		//console.log("com.developedbyme.utils.xml.XmlChildRetreiver::getAllValuesForAttribute (static)");
		
		var currentAttribute = ClassReference.getAttribute(aXml, aAttributeName);
		if(currentAttribute !== null) {
			aReturnArray.push(currentAttribute);
		}
		
		var currentArray = ClassReference.getChilds(aXml);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			ClassReference.getAllValuesForAttribute(currentChild, aAttributeName, aReturnArray);
		}
	};
});