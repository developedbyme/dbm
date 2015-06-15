/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.text.HtmlTextElement", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	//"use strict";
	
	var HtmlTextElement = dbm.importClass("dbm.gui.text.HtmlTextElement");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	var DomManipulationFunctions = dbm.importClass("dbm.utils.htmldom.DomManipulationFunctions");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.xml.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.text.HtmlTextElement::_init");
		
		this.superCall();
		
		this._text = this.createProperty("text","");
		this._fragment = null;
		
		var textUpdate = this.createGhostProperty("textUpdate");
		this.createUpdateFunction("text", this._updateTextFlow, [this._text], [textUpdate]);
		
		this._display.connectInput(textUpdate);
		
		return this;
	};
	
	objectFunctions._connectObjectToOpacity = function() {
		//MENOTE: do nothing
	};
	
	objectFunctions._updateTextFlow = function(aFlowUpdateNumber) {
		//console.log("dbm.gui.text.HtmlTextElement::_updateTextFlow");
		
		var theElement = this.getElement();
		
		while(theElement.childNodes.length > 0) {
			theElement.removeChild(theElement.firstChild);
		}
		
		//console.log(this, theElement);
		this.getHtmlCreator().createFromTemplate(this._text.getValueWithoutFlow(), theElement);
		
		//MENOTE: Fragments gets cleared out when added to the dom
		DomManipulationFunctions.setElementDomStatus(theElement, this._parentElement.getValue(), this._inDom.getValue());
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
		//console.log("dbm.gui.text.HtmlTextElement::create");
		//console.log(aParentOrDocument, aAddToParent, aText);
		
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setPropertyInputWithoutNull(aText);
		newNode.setElement(htmlCreator.createFromTemplate(aText));
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		newNode.getProperty("display").update();
		
		return newNode;
	};
});