/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.xml.XmlModifier", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.xml.XmlModifier");
	//"use strict";
	
	var XmlModifier = dbm.importClass("dbm.utils.xml.XmlModifier");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	
	staticFunctions.DEFAULT_USE_CDATA = true;
	
	staticFunctions.getOwnerDocument = function(aNode) {
		//console.log("dbm.utils.xml.XmlModifier::getOwnerDocument");
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
		//console.log("dbm.utils.xml.XmlModifier::createAttribute");
		var newAttribute = ClassReference.getOwnerDocument(aNode).createAttribute(aName);
		newAttribute.nodeValue = aValue;
		aNode.setAttributeNode(newAttribute);
		return aNode;
	};
	
	staticFunctions.createNamespacedAttribute = function(aNode, aNamespace, aPrefix, aName, aValue) {
		//console.log("dbm.utils.xml.XmlModifier::createNamespacedAttribute");
		//console.log(aNode, aNamespace, aPrefix, aName, aValue);
		aNode.setAttributeNS(aNamespace, aPrefix + ":" + aName, aValue);
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