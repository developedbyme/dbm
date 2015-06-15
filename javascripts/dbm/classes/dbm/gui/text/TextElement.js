/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.text.TextElement", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	//"use strict";
	
	var TextElement = dbm.importClass("dbm.gui.text.TextElement");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.text.TextElement::_init");
		
		this.superCall();
		
		this._text = this.addProperty("text", ExternalVariableProperty.createWithoutExternalObject(null));
		this._display.connectInput(this._text);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		this.superCall(aElement);
		
		this._text.setupExternalObject(this.getElement(), "nodeValue");
		
		return this;
	};
	
	objectFunctions.setStyleProperty = function(aStyleProperty, aValue) {
		
		//MENOTE: no style on text nodes
		
		return this;
	};
	
	objectFunctions.removeStyleProperty = function(aStyleProperty) {
		
		//MENOTE: no style on text nodes
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._text = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aText) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createText(""));
		newNode.setPropertyInput("text", aText);
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});