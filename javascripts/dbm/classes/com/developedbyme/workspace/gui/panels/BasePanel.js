/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.workspace.gui.panels.BasePanel", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.workspace.gui.panels.BasePanel");
	//"use strict";
	
	var BasePanel = dbm.importClass("com.developedbyme.workspace.gui.panels.BasePanel");
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.panels.BasePanel::_init");
		
		this.superCall();
		
		this._inputArea = this.createProperty("inputArea").setAlwaysUpdateFlow();
		this._updateFunctions.getObject("display").addInputConnection(this._inputArea);
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create());
		this._updateFunctions.getObject("display").addInputConnection(this._graphicsUpdate);
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputArea = null;
		this._graphicsUpdate = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aAttributes) {
		return ClassReference._create(ClassReference, aAttributes);
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aAttributes) {
		return ClassReference._createOnParent(ClassReference, aParentOrDocument, aAddToParent, aAttributes);
	};
	
	staticFunctions._create = function(aClass, aAttributes) {
		var newNode = (new aClass()).init();
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		newNode.setElement(htmlCreator.createDiv(aAttributes));
		
		return newNode;
	};
	
	staticFunctions._createOnParent = function(aClass, aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new aClass()).init();
		
		var theParent = DomReferenceFunctions.getDocumentVisualParent(aParentOrDocument);
		
		newNode.setParent(theParent);
		
		var htmlCreator = newNode.getHtmlCreator();
		
		newNode.setElement(htmlCreator.createDiv(aAttributes));
		
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});