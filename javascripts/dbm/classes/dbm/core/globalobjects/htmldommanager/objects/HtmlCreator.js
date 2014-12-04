/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Object that makes it simple to create new html elements.
 */
dbm.registerClass("dbm.core.globalobjects.htmldommanager.objects.HtmlCreator", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.htmldommanager.objects.HtmlCreator");
	//"use strict";
	
	//Self reference
	var HtmlCreator = dbm.importClass("dbm.core.globalobjects.htmldommanager.objects.HtmlCreator");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	var JavascriptObjectTypes = dbm.importClass("dbm.constants.JavascriptObjectTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.htmldommanager.objects.HtmlCreator::_init");
		
		this.superCall();
		
		this.ownerDocument = null;
		
		return this;
	};
	
	/**
	 * Sets the document to use for creating new nodes.
	 *
	 * @param	aDocument	Document	The document.
	 */
	objectFunctions.setDocument = function(aDocument) {
		//console.log("dbm.core.globalobjects.htmldommanager.objects.HtmlCreator::setDocument");
		
		this.ownerDocument = aDocument;
		
		return this;
		
	};
	
	/**
	 * Sets attribute to a node.
	 *
	 * @param	aElement		Element		The element to set the attributes on.
	 * @param	aAttributes		Object		Accosiative array with names and values of all attributes to set.
	 */
	objectFunctions.setAttributesToNode = function(aElement, aAttributes) {
		if(aAttributes !== null) {
			for(var objectName in aAttributes) {
				aElement.setAttribute(objectName, aAttributes[objectName]);
			}
		}
	};
	
	/**
	 * Creates a text node.
	 *
	 * @param	aText	String	The text for the new text node.
	 *
	 * @return	Native<Text>	The newly created text node.
	 */
	objectFunctions.createText = function(aText) {
		return this.ownerDocument.createTextNode(aText);
	};
	
	/**
	 * Creates a HTML element.
	 *
	 * @param	aTagName		String			The name/type for the element.
	 * @param	aAttributes		Object			The attributes to add to the element.
	 * @rest	aChilds			Array<Node>		The childnodes to add to this element.
	 *
	 * @param	Element		The newly created element.
	 */
	objectFunctions.createNode = function(aTagName, aAttributes /*, ... aChilds */) {
		var newElement = this.ownerDocument.createElement(aTagName);
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
	
	objectFunctions.createDiv = function(aAttributes /*, ... childs */) {
		var newElement = this.ownerDocument.createElement("div");
		this.setAttributesToNode(newElement, aAttributes);
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
	
	objectFunctions.createImage = function(aSrc, aAttributes) {
		var newElement = this.ownerDocument.createElement("img");
		newElement.src = aSrc;
		this.setAttributesToNode(newElement, aAttributes);
		return newElement;
	};
	
	objectFunctions.createLink = function(aHref, aTarget, aAttributes /*, ... childs */) {
		var newElement = this.ownerDocument.createElement("a");
		newElement.href = aHref;
		if(aTarget !== null) {
			var target = aTarget;
			newElement.onclick = function() {
				return dbm.handleLink(this.href, target);
			};
		}
		this.setAttributesToNode(newElement, aAttributes);
		var currentArray = arguments;
		var currentArrayLength = currentArray.length;
		for(var i = 3; i < currentArrayLength; i++) {
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
	
	objectFunctions.createForm = function(aAction, aMethod, aAttributes /*, ... childs */) {
		var newElement = this.ownerDocument.createElement("form");
		newElement.action = aAction;
		newElement.method = aMethod;
		this.setAttributesToNode(newElement, aAttributes);
		var currentArray = arguments;
		var currentArrayLength = currentArray.length;
		for(var i = 3; i < currentArrayLength; i++) {
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
	
	objectFunctions.createInput = function(aName, aType, aValue, aAttributes) {
		var newElement = this.ownerDocument.createElement("input");
		newElement.type = aType;
		newElement.name = aName;
		newElement.value = aValue;
		this.setAttributesToNode(newElement, aAttributes);
		return newElement;
	};
	
	objectFunctions.createSelect = function(aName, aValues, aAttributes) {
		var newElement = this.ownerDocument.createElement("select");
		newElement.name = aName;
		
		var newOption;
		
		if(aValues instanceof Array) {
			var currentArray = aValues;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				newOption = this.ownerDocument.createElement("option");
				newOption.text = currentArray[i];
				newOption.value = currentArray[i];
				newElement.appendChild(newOption);
			}
		}
		else if(aValues !== null) {
			for(var objectName in aValues) {
				newOption = this.ownerDocument.createElement("option");
				newOption.text = aValues[objectName];
				newOption.value = objectName;
				newElement.appendChild(newOption);
			}
		}
		
		this.setAttributesToNode(newElement, aAttributes);
		return newElement;
	};
	
	objectFunctions.createFromTemplate = function(aHtmlString, aFragment) {
		var newElement = this.ownerDocument.createElement("div");
		newElement.innerHTML = aHtmlString;
		var documentFragment;
		if(VariableAliases.isSet(aFragment)) {
			documentFragment = aFragment;
		}
		else {
			documentFragment = this.ownerDocument.createDocumentFragment();
		}
		var currentArray = ArrayFunctions.copyArray(newElement.childNodes);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			documentFragment.appendChild(currentChild);
		}
		
		return documentFragment;
	};
	
	staticFunctions.create = function(aDocument) {
		
		return (new HtmlCreator()).init().setDocument(aDocument);
		
	};
});