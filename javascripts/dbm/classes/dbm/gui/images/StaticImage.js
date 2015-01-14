/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.images.StaticImage", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	//"use strict";
	
	//Self reference
	var StaticImage = dbm.importClass("dbm.gui.images.StaticImage");
	
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
		//console.log("dbm.gui.images.StaticImage::_init");
		
		this.superCall();
		
		this._source = this.addProperty("source", ExternalVariableProperty.createWithoutExternalObject());
		this._display.connectInput(this._source);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		//console.log("dbm.gui.images.StaticImage::setElement");
		//console.log(aElement, aElement.src);
		
		this.superCall(aElement);
		
		this._source.setupExternalObject(this.getElement(), "src");
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._source = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aUrl, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createImage(aUrl, aAttributes));
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
	
	staticFunctions.createNew = function(aUrl, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		newNode.setElement(htmlCreator.createImage(aUrl, aAttributes));
		
		return newNode;
	};
});