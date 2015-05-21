/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.text.LinkElement", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.text.LinkElement");
	//"use strict";
	
	//Self reference
	var LinkElement = dbm.importClass("dbm.gui.text.LinkElement");
	
	//Error report
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	
	//Utils
	
	//Constants
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.text.LinkElement::_init");
		
		this.superCall();
		
		this._url = this.addProperty("url", ExternalVariableProperty.createWithoutExternalObject());
		this._display.connectInput(this._url);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		//console.log("dbm.gui.text.LinkElement::setElement");
		//console.log(aElement, aElement.href);
		
		this.superCall(aElement);
		
		this._url.setupExternalObject(this.getElement(), "href");
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._url = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aUrl, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createLink(aUrl, null, aAttributes));
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
	
	staticFunctions.createNew = function(aUrl, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		newNode.setElement(htmlCreator.createLink(aUrl, null, aAttributes));
		
		return newNode;
	};
});