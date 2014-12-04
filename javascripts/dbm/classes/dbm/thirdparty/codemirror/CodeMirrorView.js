/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.codemirror.CodeMirrorView", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var CodeMirrorView = dbm.importClass("dbm.thirdparty.codemirror.CodeMirrorView");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var ExtendedEventValueProperty = dbm.importClass("dbm.core.objectparts.ExtendedEventValueProperty");
	var CustomFunctionEventLink = dbm.importClass("dbm.core.extendedevent.eventlink.CustomFunctionEventLink");
	
	//Utils
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	var StaticCallbackLink = dbm.importClass("dbm.core.extendedevent.eventlink.StaticCallbackLink");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var SetPropertyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.SetPropertyCommand");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var FormFieldExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.FormFieldExtendedEventIds");
	var CodeMirrorViewEventIds = dbm.importClass("dbm.thirdparty.codemirror.constants.CodeMirrorViewEventIds");
	var CodeMirrorOptionIds = dbm.importClass("dbm.thirdparty.codemirror.constants.CodeMirrorOptionIds");
	
	//Libraries
	var CodeMirror = dbm.importLibrary("CodeMirror", function() {CodeMirror = CodeMirror.realLibrary;});
	
	staticFunctions.EDITOR_GROUP_NAME = "editor";
	staticFunctions.DEFAULT_MODE = "javascript";
	staticFunctions.DEFAULT_LINE_NUMBERS = true;
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.thirdparty.codemirror.CodeMirrorView::_init");
		
		this.superCall();
		
		this._options = this.addDestroyableObject(NamedArray.create(false));
		
		this._editor = null;
		
		this._value = this.addProperty("value", ExtendedEventValueProperty.create(""));
		this._updateFunctions.getObject("display").addInputConnection(this._value);
		this._options.addObject(CodeMirrorOptionIds.VALUE, this._value);
		
		this._domChange = this.createGhostProperty("domChange");
		this._redraw = this.createGhostProperty("redraw");
		this.createUpdateFunction("redrawUpdate", this._redrawFlowUpdate, [this._element, this._domChange], [this._redraw]);
		this._updateFunctions.getObject("display").addInputConnection(this._redraw);
		
		this._createOptionProperty(CodeMirrorOptionIds.MODE, ClassReference.DEFAULT_MODE);
		this._createOptionProperty(CodeMirrorOptionIds.LINE_NUMBERS, ClassReference.DEFAULT_LINE_NUMBERS);
		
		this.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.CHANGE, CallFunctionCommand.createCommand(this, this._valueChanged, []));
		this._updateCommand = CallFunctionCommand.createCommand(this, this._updateValue, [GetVariableObject.createSelectDataCommand()]).retain();
		
		this._value.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.UPDATE, this._updateCommand); //METODO: move to activate
		
		this._keyMaps = this.addDestroyableObject(NamedArray.create(true));
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		return this;
	};
	
	
	objectFunctions.enableOption = function(aName) {
		if(this._options.select(aName)) {
			return this._options.currentSelectedItem;
		}
		//METODO: check that the editor exists
		return this._createOptionProperty(aName, this._editor.getOption(aName));
	};
	
	objectFunctions._createOptionProperty = function(aName, aValue) {
		var newProperty = this.addProperty(aName, ExtendedEventValueProperty.create(aValue));
		newProperty.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.UPDATE, CallFunctionCommand.createCommand(this, this._optionChanged, [aName, GetVariableObject.createSelectDataCommand()]));
		this._options.addObject(aName, newProperty);
		this._updateFunctions.getObject("display").addInputConnection(newProperty);
		return newProperty;
	};
	
	objectFunctions._addEditorListener = function(aCodeMirrorEvent, aExtendedEvent) {
		
		var activateCommand = CallFunctionCommand.createCommand(this._editor, this._editor.on, [aCodeMirrorEvent, GetVariableObject.createSelectDataCommand(), null]);
		var deactivateCommand = CallFunctionCommand.createCommand(this._editor, this._editor.off, [aCodeMirrorEvent, GetVariableObject.createSelectDataCommand(), null]);
		
		this.getExtendedEvent().addEventLink(CustomFunctionEventLink.create(this.getExtendedEvent(), aExtendedEvent, activateCommand, deactivateCommand, "multiple"), ClassReference.EDITOR_GROUP_NAME, true);
		
	};
	
	objectFunctions.createEditor = function() {
		
		var optionsObject = new Object();
		var currentArray = this._options.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = currentArray[i];
			optionsObject[currentName] = this._options.getObject(currentName).getValue();
		};
		
		this._editor = CodeMirror(this._element.getValue(), optionsObject);
		this._editor.setSize("100%", "100%"); //METODO: settings for this and request
		this._addEditorListener(CodeMirrorViewEventIds.CHANGE, FormFieldExtendedEventIds.CHANGE);
		
		return this;
	};
	
	objectFunctions.addKeyMap = function(aKeyCombination, aCommand) {
		
		var newLink = StaticCallbackLink.create(this.getExtendedEvent(), aKeyCombination);
		
		this._keyMaps.addObject(aKeyCombination, newLink);
		
		if(this._editor !== null) { //METODO: check that class is active
			var callbackFunction = newLink.getCallbackFunction();
			
			var currentObject = this._editor.getOption("extraKeys");
			if(currentObject === null) {
				currentObject = new Object();
			}
			currentObject[aKeyCombination] = callbackFunction;
			
			this._editor.setOption("extraKeys", currentObject);
		}
		
		if(!this.getExtendedEvent().hasEvent(aKeyCombination)) {
			this.getExtendedEvent().createEvent(aKeyCombination);
		}
		
		if(VariableAliases.isSet(aCommand)) {
			this.getExtendedEvent().addCommandToEvent(aKeyCombination, aCommand);
		}
	};
	
	objectFunctions.getValue = function() {
		return this._value.getValue();
	};
	
	objectFunctions.setValue = function(aValue) {
		this._value.setValue(aValue);
		this._value.update();
	};
	
	objectFunctions._updateValue = function(aValue) {
		//console.log("dbm.thirdparty.codemirror.CodeMirrorView::_updateValue");
		
		if(this._editor !== null) {
			if(this._editor.getValue() !== aValue) {
				this._editor.setValue(aValue);
			}
		}
	};
	
	objectFunctions._valueChanged = function(aValue) {
		//console.log("dbm.thirdparty.codemirror.CodeMirrorView::_valueChanged");
		this._value.setValue(this._editor.getValue());
	};
	
	objectFunctions._optionChanged = function(aName, aValue) {
		//console.log("dbm.thirdparty.codemirror.CodeMirrorView::_updateValue");
		
		if(this._editor !== null) {
			this._editor.setOption(aName, aValue);
		}
	};
	
	objectFunctions._redrawFlowUpdate = function(aFlowUpdateNumber) {
		console.log("dbm.thirdparty.codemirror.CodeMirrorView::_redrawFlowUpdate");
		this._editor.refresh();
	};
	
	objectFunctions.activate = function() {
		
		//METODO: extra keys
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference.EDITOR_GROUP_NAME);
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		
		//METODO: extra keys
		this.getExtendedEvent().deactivateJavascriptEventLink(ClassReference.EDITOR_GROUP_NAME);
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case FormFieldExtendedEventIds.CHANGE:
				return true;
		}
		
		if(this._keyMaps.hasObject(aName)) {
			return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._editor = null;
		this._mode = null;
		this._value = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement, aValue, aType) {
		
		var newCodeMirrorView = (new CodeMirrorView()).init().setElement(aElement);
		
		newCodeMirrorView.setPropertyInputWithoutNull("value", aValue);
		newCodeMirrorView.setPropertyInputWithoutNull("type", aType);
		
		newCodeMirrorView.createEditor();
		
		return newCodeMirrorView;
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aAttributes, aValue, aType) {
		var newCodeMirrorView = (new ClassReference()).init();
		
		var theParent = DomReferenceFunctions.getDocumentVisualParent(aParentOrDocument);
		
		newCodeMirrorView.setParent(theParent);
		
		var htmlCreator = newCodeMirrorView.getHtmlCreator();
		
		newCodeMirrorView.setElement(htmlCreator.createDiv(aAttributes));
		
		if(aAddToParent !== false) {
			newCodeMirrorView.addToDom();
		}
		
		newCodeMirrorView.setPropertyInputWithoutNull("value", aValue);
		newCodeMirrorView.setPropertyInputWithoutNull("type", aType);
		newCodeMirrorView.createEditor();
		
		return newCodeMirrorView;
	};
});