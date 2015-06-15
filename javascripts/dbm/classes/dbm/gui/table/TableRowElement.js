/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.table.TableRowElement", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.table.TableRowElement");
	//"use strict";
	
	var TableRowElement = dbm.importClass("dbm.gui.table.TableRowElement");
	
	var TableFieldElement = dbm.importClass("dbm.gui.table.TableFieldElement");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.table.TableRowElement::_init");
		
		this.superCall();
		
		this._data = null;
		this._fields = new Array();
		
		return this;
	};
	
	objectFunctions.createFieldsFromArray = function(aArray, aType) {
		var currentArray = aArray;
		var currentArryLength = currentArray.length;
		for(var i = 0; i < currentArryLength; i++) {
			var newField = TableFieldElement.create(aType, this.getElement(), true);
			newField.setText(currentArray[i]);
			this._fields.push(newField);
		}
		
		return this;
	};
	
	objectFunctions.createFieldsFromData = function(aData, aFields, aType) {
		
		this._data = aData;
		
		var currentArray = aFields;
		var currentArryLength = currentArray.length;
		for(var i = 0; i < currentArryLength; i++) {
			var newField = TableFieldElement.create(aType, this.getElement(), true);
			newField.setText(aData[currentArray[i]]);
			this._fields.push(newField);
		}
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("dbm.gui.table.TableRowElement::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createNode("tr", aAttributes));
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});