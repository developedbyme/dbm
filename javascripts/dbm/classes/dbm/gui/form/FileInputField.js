/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A generic input field for selecting files.
 */
dbm.registerClass("dbm.gui.form.FileInputField", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.form.FileInputField");
	
	//Self reference
	var FileInputField = dbm.importClass("dbm.gui.form.FileInputField");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
		
	//Constants
	var JavascriptEventIds = dbm.importClass("dbm.constants.JavascriptEventIds");
	var FormFieldExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.FormFieldExtendedEventIds");
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	
	staticFunctions._ACTIVE = "active";
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.form.FileInputField::_init");
		
		this.superCall();
		
		this._isSingleFile = true;
		this._isActive = false;
		this._value = this.createProperty("value", null);
		
		this.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.CHANGE, CallFunctionCommand.createCommand(this, this._change, []));
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this.getExtendedEvent().linkJavascriptEvent(aElement, JavascriptEventIds.FOCUS, FormFieldExtendedEventIds.FOCUS, ClassReference._ACTIVE, true, true);
		this.getExtendedEvent().linkJavascriptEvent(aElement, JavascriptEventIds.BLUR, FormFieldExtendedEventIds.BLUR, ClassReference._ACTIVE, true, true);
		this.getExtendedEvent().linkJavascriptEvent(aElement, JavascriptEventIds.CHANGE, FormFieldExtendedEventIds.CHANGE, ClassReference._ACTIVE, true, true);
		
		return this;
	};
	
	objectFunctions.getValue = function() {
		return this._value.getValue();
	};
	
	objectFunctions._change = function() {
		console.log("dbm.gui.form.FileInputField::_change");
		console.log(this);
		
		var files = this.getElement().files;
		
		if(files.length === 0) {
			this._value.setValue(null);
		}
		else {
			if(this._isSingleFile) {
				this._value.setValue(files[0]);
			}
			else {
				this._value.setValue(files);
			}
		}
	};
	
	objectFunctions.triggerDialog = function() {
		console.log("dbm.gui.form.FileInputField::triggerDialog");
		this.getElement().click();
	};
	
	objectFunctions.activate = function() {
		this._isActive = true;
		
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._ACTIVE);
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		this._isActive = false;
		
		this.getExtendedEvent().deactivateJavascriptEventLink(ClassReference._ACTIVE);
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case FormFieldExtendedEventIds.FOCUS:
			case FormFieldExtendedEventIds.BLUR:
			case FormFieldExtendedEventIds.CHANGE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._value = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		return (new FileInputField()).init().setElement(aElement);
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aType, aAttributes) {
		
		aType = VariableAliases.valueWithDefault(aType, "file");
		
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createNode("input", aAttributes));
		newNode.getElement().type = aType;
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});