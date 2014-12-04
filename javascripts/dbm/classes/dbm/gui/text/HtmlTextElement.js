/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.text.HtmlTextElement", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	//"use strict";
	
	var HtmlTextElement = dbm.importClass("dbm.gui.text.HtmlTextElement");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.text.HtmlTextElement::_init");
		
		this.superCall();
		
		this._text = this.createProperty("text","");
		this._fragment = null;
		this._updateFunctions.getObject("display").addInputConnection(this._text);
		
		return this;
	};
	
	objectFunctions._connectObjectToOpacity = function() {
		//MENOTE: do nothing
	};
	
	objectFunctions._updateDisplayFlow = function(aFlowUpdateNumber) {
		this.superCall(aFlowUpdateNumber);
		
		while(this.getElement().childNodes.length > 0) {
			this.getElement().removeChild(this.getElement().firstChild);
		}
		
		this.getHtmlCreator().createFromTemplate(this._text.getValueWithoutFlow(), this.getElement());
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
		
		newNode.setElement(htmlCreator.createFromTemplate(aText));
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		newNode.getProperty("display").update();
		
		return newNode;
	};
});