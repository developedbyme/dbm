/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.htmldommanager.objects.SvgCreator", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.htmldommanager.objects.SvgCreator");
	//"use strict";
	
	var SvgCreator = dbm.importClass("dbm.core.globalobjects.htmldommanager.objects.SvgCreator");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	var JavascriptObjectTypes = dbm.importClass("dbm.constants.JavascriptObjectTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.htmldommanager.objects.SvgCreator::_init");
		
		this.superCall();
		
		this.ownerDocument = null;
		
		return this;
	};
	
	objectFunctions.setDocument = function(aDocument) {
		//console.log("dbm.core.globalobjects.htmldommanager.objects.SvgCreator::setDocument");
		
		this.ownerDocument = aDocument;
		
		return this;
		
	};
	
	objectFunctions.setAttributesToNode = function(aElement, aAttributes) {
		if(aAttributes !== null) {
			for(var objectName in aAttributes) {
				aElement.setAttribute(objectName, aAttributes[objectName]);
			}
		}
	};
	
	objectFunctions.createSvg = function(aAttributes /*, ... childs */) {
		var newElement = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
		var defsElement = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "defs");
		newElement.appendChild(defsElement);
		var currentArray = arguments;
		var currentArrayLength = currentArray.length;
		for(var i = 1; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.ownerDocument && currentObject.ownerDocument === newElement.ownerDocument) {
				newElement.appendChild(currentObject);
			}
			else {
				newElement.appendChild(this.ownerDocument.createTextNode(currentObject));
			}
		}
		
		return newElement;
	};
	
	objectFunctions.createNode = function(aTagName, aAttributes /*, ... childs */) {
		var newElement = this.ownerDocument.createElementNS("http://www.w3.org/2000/svg", aTagName);
		this.setAttributesToNode(newElement, aAttributes);
		var currentArray = arguments;
		var currentArrayLength = currentArray.length;
		for(var i = 2; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.ownerDocument && currentObject.ownerDocument === newElement.ownerDocument) {
				newElement.appendChild(currentObject);
			}
			else {
				newElement.appendChild(this.ownerDocument.createTextNode(currentObject));
			}
		}
		
		return newElement;
	};
	
	objectFunctions.createAttribute = function(aNode, aName, aValue) {
		var newAttribute = this.ownerDocument.createAttributeNS("http://www.w3.org/2000/svg", aName);
		newAttribute.nodeValue = aValue;
		aNode.setAttributeNode(newAttribute);
		return aNode;
	};
	
	staticFunctions.create = function(aDocument) {
		
		return (new SvgCreator()).init().setDocument(aDocument);
		
	};
});