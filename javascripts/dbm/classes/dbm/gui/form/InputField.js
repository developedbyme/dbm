/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A generic input field.
 */
dbm.registerClass("dbm.gui.form.InputField", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.form.InputField");
	
	//Self reference
	var InputField = dbm.importClass("dbm.gui.form.InputField");
	
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
	staticFunctions._INTERNAL_CHANGE = "internalChange";
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.form.InputField::_init");
		
		this.superCall();
		
		this._isActive = false;
		this._value = this.createProperty("value", "");
		this._lastValue = "";
		this._defaultText = null;
		this._isChangingDefaultText = false;
		
		this.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.FOCUS, CallFunctionCommand.createCommand(this, this._focus, []));
		this.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.BLUR, CallFunctionCommand.createCommand(this, this._blur, []));
		this.getExtendedEvent().addCommandToEvent(ClassReference._INTERNAL_CHANGE, CallFunctionCommand.createCommand(this, this._change, [GetVariableObject.createSelectDataCommand()]));
		
		this._updateFunctions.getObject("display").addInputConnection(this._value);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this.getExtendedEvent().linkJavascriptEvent(aElement, JavascriptEventIds.FOCUS, FormFieldExtendedEventIds.FOCUS, ClassReference._ACTIVE, true, true);
		this.getExtendedEvent().linkJavascriptEvent(aElement, JavascriptEventIds.BLUR, FormFieldExtendedEventIds.BLUR, ClassReference._ACTIVE, true, true);
		this.getExtendedEvent().linkJavascriptEvent(aElement, JavascriptEventIds.KEY_UP, ClassReference._INTERNAL_CHANGE, ClassReference._ACTIVE, true, true);
		
		return this;
	};
	
	objectFunctions.setDefaultText = function(aText) {
		//console.log("dbm.gui.form.InputField::setDefaultText");
		this._defaultText = aText;
		if(VariableAliases.isSet(this._defaultText) && VariableAliases.isNull(this.getElement().value)) {
			this._isChangingDefaultText = true;
			this.getElement().value = this._defaultText;
			this._isChangingDefaultText = false;
		}
		
		return this;
	};
	
	objectFunctions.setText = function(aText) {
		console.log("dbm.gui.form.InputField::setText");
		
		if(aText === "" && VariableAliases.isSet(this._defaultText)) {
			this._isChangingDefaultText = true;
			this.getElement().value = this._defaultText;
			this._isChangingDefaultText = false;
		}
		else {
			this.getElement().value = aText;
		}
		this._value.setValue(aText);
		
		return this;
	};
	
	objectFunctions.getValue = function() {
		return this._value.getValue();
	};
	
	objectFunctions._focus = function() {
		//console.log("dbm.gui.form.InputField::_focus");
		if(VariableAliases.isSet(this._defaultText) && this.getElement().value === this._defaultText) {
			this._isChangingDefaultText = true;
			this.getElement().value = "";
			this._isChangingDefaultText = false;
		}
	};
	
	objectFunctions._blur = function() {
		//console.log("dbm.gui.form.InputField::_blur");
		if(VariableAliases.isSet(this._defaultText) && VariableAliases.isNull(this.getElement().value)) {
			this._isChangingDefaultText = true;
			this.getElement().value = this._defaultText;
			this._isChangingDefaultText = false;
		}
	};
	
	objectFunctions._change = function(aEvent) {
		//console.log("dbm.gui.form.InputField::_change");
		//console.log(this._isChangingDefaultText, this.getElement().value, this._lastValue);
		if(this._isChangingDefaultText) return;
		var newValue = this.getElement().value;
		if(newValue !== this._lastValue) {
			this._lastValue = newValue;
			this._value.setValue(newValue);
			if(this.getExtendedEvent().hasEvent(FormFieldExtendedEventIds.CHANGE)) {
				this.getExtendedEvent().perform(FormFieldExtendedEventIds.CHANGE, newValue);
			}
		}
		if(aEvent.keyCode === 13) {
			if(this.getExtendedEvent().hasEvent(FormFieldExtendedEventIds.REQUEST_SUBMIT)) {
				this.getExtendedEvent().perform(FormFieldExtendedEventIds.REQUEST_SUBMIT, newValue);
			}
		}
	};
	
	objectFunctions._updateDisplayFlow = function(aFlowUpdateNumber) {
		//console.log("dbm.gui.form.InputField::_updateFlowText");
		var newValue = this._value.getValueWithoutFlow();
		this.getElement().value = newValue;
		this._lastValue = newValue.toString();
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
			case ClassReference._INTERNAL_CHANGE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._value = null;
		this._lastValue = null;
		this._defaultText = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aDefaultText) {
		return (new InputField()).init().setElement(aElement).setDefaultText(aDefaultText);
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aDefaultText, aType, aAttributes) {
		
		aDefaultText = VariableAliases.valueWithDefault(aDefaultText, null);
		aType = VariableAliases.valueWithDefault(aType, "text");
		
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createNode("input", aAttributes));
		newNode.setDefaultText(aDefaultText);
		newNode.getElement().type = aType;
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});