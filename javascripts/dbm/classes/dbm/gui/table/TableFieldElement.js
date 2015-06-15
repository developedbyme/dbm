/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.table.TableFieldElement", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.table.TableFieldElement");
	//"use strict";
	
	var TableFieldElement = dbm.importClass("dbm.gui.table.TableFieldElement");
	
	var TextElement = dbm.importClass("dbm.gui.text.TextElement");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.xml.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.table.TableFieldElement::_init");
		
		this.superCall();
		
		this._text = null;
		
		return this;
	};
	
	objectFunctions.setText = function(aText) {
		this._text = TextElement.create(this.getElement(), true, aText);
		this._text.getProperty("display").update();
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("dbm.gui.table.TableFieldElement::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function(aType, aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createNode(aType, aAttributes));
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});