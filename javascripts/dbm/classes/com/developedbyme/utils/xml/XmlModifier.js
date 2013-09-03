dbm.registerClass("com.developedbyme.utils.xml.XmlModifier", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.xml.XmlModifier");
	//"use strict";
	
	var XmlModifier = dbm.importClass("com.developedbyme.utils.xml.XmlModifier");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	staticFunctions.DEFAULT_USE_CDATA = true;
	
	staticFunctions.getOwnerDocument = function(aNode) {
		return ((aNode.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aNode : aNode.ownerDocument);
	};
	
	staticFunctions.createChild = function(aParentNode, aName) {
		var newNode = ClassReference.getOwnerDocument(aParentNode).createElement(aName);
		aParentNode.appendChild(newNode);
		return newNode;
	};
	
	staticFunctions.createNamespacedChild = function(aParentNode, aNamespace, aPrefix, aName) {
		var newNode = ClassReference.getOwnerDocument(aParentNode).createElementNS(aNamespace, aPrefix + ":" + aName);
		aParentNode.appendChild(newNode);
		return newNode;
	};
	
	staticFunctions.createAttribute = function(aNode, aName, aValue) {
		//console.log("com.developedbyme.utils.xml.XmlModifier::createAttribute");
		var newAttribute = ClassReference.getOwnerDocument(aNode).createAttribute(aName);
		newAttribute.nodeValue = aValue;
		aNode.setAttributeNode(newAttribute);
		return aNode;
	};
	
	staticFunctions.createNamespacedAttribute = function(aNode, aNamespace, aPrefix, aName, aValue) {
		//console.log("com.developedbyme.utils.xml.XmlModifier::createNamespacedAttribute");
		//console.log(aNode, aNamespace, aPrefix, aName, aValue);
		var newAttribute = ClassReference.getOwnerDocument(aNode).createAttributeNS(aNamespace, aPrefix + ":" + aName);
		newAttribute.nodeValue = aValue;
		aNode.setAttributeNode(newAttribute);
		return aNode;
	};
	
	staticFunctions.createText = function(aParentNode, aText, aUseCdata) {
		var newNode;
		var useCdata = (VariableAliases.isNull(aUseCdata)) ? ClassReference.DEFAULT_USE_CDATA : VariableAliases.isTrue(aUseCdata);
		if(useCdata) {
			newNode = ClassReference.getOwnerDocument(aParentNode).createCDATASection(aText);
		}
		else {
			newNode = ClassReference.getOwnerDocument(aParentNode).createTextNode(aText);
		}
		aParentNode.appendChild(newNode);
		return aParentNode;
	};
});