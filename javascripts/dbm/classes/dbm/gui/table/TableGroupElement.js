/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.table.TableGroupElement", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.table.TableGroupElement");
	//"use strict";
	
	var TableGroupElement = dbm.importClass("dbm.gui.table.TableGroupElement");
	
	var TableRowElement = dbm.importClass("dbm.gui.table.TableRowElement");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.table.TableGroupElement::_init");
		
		this.superCall();
		
		this._rows = new Array();
		
		return this;
	};
	
	objectFunctions.createRow = function(aType) {
		var newRow = TableRowElement.create(this.getElement(), true);
		this._addRow(newRow);
		return newRow;
	};
	
	objectFunctions._addRow = function(aRow) {
		this._rows.push(aRow);
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("dbm.gui.table.TableGroupElement::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElementType, aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createNode(aElementType, aAttributes));
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
	
	staticFunctions.createHead = function(aParentOrDocument, aAddToParent, aAttributes) {
		return ClassReference.create("thead", aParentOrDocument, aAddToParent, aAttributes);
	};
	
	staticFunctions.createBody = function(aParentOrDocument, aAddToParent, aAttributes) {
		return ClassReference.create("tbody", aParentOrDocument, aAddToParent, aAttributes);
	};
	
	staticFunctions.createFooter = function(aParentOrDocument, aAddToParent, aAttributes) {
		return ClassReference.create("tfoot", aParentOrDocument, aAddToParent, aAttributes);
	};
});