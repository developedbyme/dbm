dbm.registerClass("com.developedbyme.gui.table.TableRowElement", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.table.TableRowElement");
	//"use strict";
	
	var TableRowElement = dbm.importClass("com.developedbyme.gui.table.TableRowElement");
	
	var TableFieldElement = dbm.importClass("com.developedbyme.gui.table.TableFieldElement");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.table.TableRowElement::_init");
		
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
		//console.log("com.developedbyme.gui.table.TableRowElement::setAllReferencesToNull");
		
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