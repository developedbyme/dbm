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
	
	staticFunctions.getFirstChild = function(aXml) {
		if(aXml == null) {
			if(ClassReference.WARN_FOR_NO_XML) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getFirstChild", "Xml is null");
			}
			return null;
		}
		
		var currentArray = aXml.childNodes;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			if(currentChild.nodeType == XmlNodeTypes.ELEMENT_NODE) {
				return currentChild;
			}
		}
		
		if(ClassReference.WARN_FOR_NO_RESULT) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getFirstChild", "No result in " + aXml);
		}
		return null;
	};
	
	staticFunctions.getChild = function(aXml, aChildName) {
		//console.log("com.developedbyme.utils.xml.XmlChildRetreiver::getChild (static)");
		//console.log(aXml, aChildName);
		if(aXml == null) {
			if(ClassReference.WARN_FOR_NO_XML) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getChild", "Xml is null");
			}
			return null;
		}
		
		var returnArray = new Array();
		var currentArray = aXml.childNodes;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			if(currentChild.nodeName == aChildName) {
				returnArray.push(currentChild);
			}
		}
		
		if(returnArray.length == 0) {
			if(ClassReference.WARN_FOR_NO_RESULT) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getChild", "No result in " + aXml);
			}
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
		if(aXml == null) {
			if(ClassReference.WARN_FOR_NO_XML) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedChild", "Xml is null");
			}
			return null;
		}
		
		var returnArray = new Array();
		var currentArray = aXml.childNodes;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			if(currentChild.namespaceURI == aChildNamespace && currentChild.localName == aChildName) {
				returnArray.push(currentChild);
			}
		}
		
		if(returnArray.length == 0) {
			if(ClassReference.WARN_FOR_NO_RESULT) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedChild", "No result in " + aXml);
			}
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
		
		if(aXml == null) {
			if(ClassReference.WARN_FOR_NO_XML) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getChildByAttribute", "Xml is null");
			}
			return returnArray;
		}
		
		var currentArray = aXml.childNodes;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			
			if((currentChild.nodeType == XmlNodeTypes.ELEMENT_NODE) && ((aChildName == "*") || (currentChild.nodeName == aChildName))) {
				returnArray.push(currentChild);
			}
		}
		
		if(returnArray.length == 0) {
			if(ClassReference.WARN_FOR_NO_RESULT) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getChildByAttribute", "No result in " + aXml);
			}
			return returnArray;
		}
		return returnArray;
	};
	
	staticFunctions.getChildByAttribute = function(aXml, aAttributeName, aValue, aChildName) {
		//console.log("com.developedbyme.utils.xml.XmlChildRetreiver::getChildByAttribute (static)");
		aChildName = VariableAliases.valueWithDefault(aChildName, "*");
		//console.log(aXml, aAttributeName, aValue, aChildName);
		
		if(aXml == null) {
			if(ClassReference.WARN_FOR_NO_XML) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getChildByAttribute", "Xml is null");
			}
			return null;
		}
		
		var returnArray = new Array();
		var currentArray = aXml.childNodes;
		if(currentArray == null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getChildByAttribute", "Xml " + aXml + " doesn't seem to be a correct xml. Can't get child (" + aChildName + ") with attribute " + aAttributeName + " set to " + aValue);
			return null;
		}
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			
			if((currentChild.nodeType == XmlNodeTypes.ELEMENT_NODE) && ((aChildName == "*") || (currentChild.nodeName == aChildName)) && (ClassReference.getAttribute(currentChild, aAttributeName) == aValue)) {
				returnArray.push(currentChild);
			}
		}
		
		if(returnArray.length == 0) {
			if(ClassReference.WARN_FOR_NO_RESULT) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getChildByAttribute", "No result in " + aXml);
			}
			return null;
		}
		if(returnArray.length > 1) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getChildByAttribute", "More than 1 child matches the query, selecting first.");
		}
		return returnArray[0];
	};
	
	staticFunctions.getNamespacedChildByNamespacedAttribute = function(aXml, aAttributeNamespace, aAttributeName, aValue, aChildNamespace, aChildName) {
		//console.log("com.developedbyme.utils.xml.XmlChildRetreiver::getNamespacedChildByNamespacedAttribute (static)");
		
		if(aXml == null) {
			if(ClassReference.WARN_FOR_NO_XML) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedChildByNamespacedAttribute", "Xml is null");
			}
			return null;
		}
		
		var returnArray = new Array();
		var currentArray = aXml.childNodes;
		if(currentArray == null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedChildByNamespacedAttribute", "Xml " + aXml + " doesn't seem to be a correct xml. Can't get child (" + aChildName + ") with attribute " + aAttributeName + " set to " + aValue);
			return null;
		}
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			
			if((currentChild.nodeType == XmlNodeTypes.ELEMENT_NODE) && ((currentChild.namespaceURI == aChildNamespace) && (currentChild.localName == aChildName)) && (ClassReference.getNamespacedAttribute(currentChild, aAttributeNamespace, aAttributeName) == aValue)) {
				returnArray.push(currentChild);
			}
		}
		
		if(returnArray.length == 0) {
			if(ClassReference.WARN_FOR_NO_RESULT) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedChildByNamespacedAttribute", "No result in " + aXml);
			}
			return null;
		}
		if(returnArray.length > 1) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedChildByNamespacedAttribute", "More than 1 child matches the query, selecting first.");
		}
		return returnArray[0];
	};
	
	staticFunctions.getNodeValue = function(aXml) {
		if(aXml == null) {
			if(ClassReference.WARN_FOR_NO_XML) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNodeValue", "Xml is null");
			}
			return null;
		}
		
		if(aXml.nodeType == XmlNodeTypes.TEXT_NODE || aXml.nodeType == XmlNodeTypes.CDATA_SECTION_NODE) {
			return String(aXml.nodeValue);
		}
		else if(aXml.nodeType == XmlNodeTypes.ELEMENT_NODE) {
			if(ClassReference.hasSimpleContent(aXml)) {
				return String(aXml.firstChild.nodeValue);
			}
		}
		
		if(ClassReference.WARN_FOR_NO_RESULT) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNodeValue", "No result in " + aXml);
		}
		
		return null;
	};
	
	staticFunctions.getAttribute = function(aXml, aAttributeName) {
		if(aXml == null) {
			if(ClassReference.WARN_FOR_NO_XML) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getAttribute", "Xml is null");
			}
			return null;
		}
		if(!(aXml.nodeType == XmlNodeTypes.ELEMENT_NODE)) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getAttribute", "Node is not an element.");
			return null;
		}
		if(aXml.hasAttribute) {
			if(!aXml.hasAttribute(aAttributeName)) {
				if(ClassReference.WARN_FOR_NO_RESULT) {
					ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getAttribute", "No result in " + aXml);
				}
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
				if(currentAttribute["name"] == aAttributeName) {
					return currentAttribute["value"];
				}
			}
			if(ClassReference.WARN_FOR_NO_RESULT) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getAttribute", "No result in " + aXml);
			}
			return null;
		}
	};
	
	staticFunctions.getNamespacedAttribute = function(aXml, aAttributeNamespace, aAttributeName) {
		if(aXml == null) {
			if(ClassReference.WARN_FOR_NO_XML) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedAttribute", "Xml is null");
			}
			return null;
		}
		if(!(aXml.nodeType == XmlNodeTypes.ELEMENT_NODE)) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedAttribute", "Node is not an element.");
			return null;
		}
		
		if(!aXml.hasAttributeNS(aAttributeNamespace, aAttributeName)) {
			if(ClassReference.WARN_FOR_NO_RESULT) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "getNamespacedAttribute", "No result in " + aXml);
			}
			return null;
		}
		return aXml.getAttributeNS(aAttributeNamespace, aAttributeName);
		
	};
	
	staticFunctions.hasSimpleContent = function(aXml) {
		if(aXml == null) {
			if(ClassReference.WARN_FOR_NO_XML) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[XmlChildRetreiver]", "hasSimpleContent", "Xml is null");
			}
			return false;
		}
		if((aXml.childNodes.length == 1) && (aXml.firstChild.nodeType == XmlNodeTypes.TEXT_NODE || aXml.firstChild.nodeType == XmlNodeTypes.CDATA_SECTION_NODE)) {
			return true;
		}
		return false;
	};
});