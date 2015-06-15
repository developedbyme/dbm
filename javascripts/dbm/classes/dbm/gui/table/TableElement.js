/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.table.TableElement", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.table.TableElement");
	//"use strict";
	
	var TableElement = dbm.importClass("dbm.gui.table.TableElement");
	
	var TableGroupElement = dbm.importClass("dbm.gui.table.TableGroupElement");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.xml.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.table.TableElement::_init");
		
		this.superCall();
		
		this._fields = null;
		this._rows = new Array();
		
		this._header = null;
		this._body = null;
		this._footer = null;
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		return this.superCall(aName);
	};
	
	objectFunctions.setFields = function(aFields) {
		this._fields = aFields;
		
		if(this._header === null) {
			this._header = TableGroupElement.createHead(this.getElement(), true);
		}
		
		var row = this._header.createRow();
		row.createFieldsFromArray(this._fields, "th");
		
		return this;
	};
	
	objectFunctions.setData = function(aDataArray) {
		if(this._body === null) {
			this._body = TableGroupElement.createBody(this.getElement(), true);
		}
		
		var currentArray = aDataArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			console.log(i);
			var newRow = this._body.createRow();
			newRow.createFieldsFromData(currentArray[i], this._fields, "td");
		}
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("dbm.gui.table.TableElement::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createNode("table", aAttributes));
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});