dbm.registerClass("com.developedbyme.gui.text.TextElement", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	//"use strict";
	
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.text.TextElement::_init");
		
		this.superCall();
		
		this._text = this.addProperty("text", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._updateFunctions.getObject("display").addInputConnection(this._text);
		
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