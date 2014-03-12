dbm.registerClass("com.developedbyme.gui.form.InputField", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.form.InputField");
	
	var InputField = dbm.importClass("com.developedbyme.gui.form.InputField");
	
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	var FormFieldExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.FormFieldExtendedEventIds");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	staticFunctions._ACTIVE = "active";
	staticFunctions._INTERNAL_CHANGE = "internalChange";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.form.InputField::_init");
		
		this.superCall();
		
		this._isActive = false;
		this._value = this.createProperty("value", "");
		this._lastValue = "";
		this._display = this.createGhostProperty("display");
		this.createUpdateFunction("display", this._updateFlowText, [this._value], [this._display]);
		this._defaultText = null;
		this._isChangingDefaultText = false;
		
		this.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.FOCUS, CallFunctionCommand.createCommand(this, this._focus, []));
		this.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.BLUR, CallFunctionCommand.createCommand(this, this._blur, []));
		this.getExtendedEvent().addCommandToEvent(ClassReference._INTERNAL_CHANGE, CallFunctionCommand.createCommand(this, this._change, [GetVariableObject.createSelectDataCommand()]));
		
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
		//console.log("com.developedbyme.gui.form.InputField::setDefaultText");
		this._defaultText = aText;
		if(this._defaultText !== null && VariableAliases.isNull(this.getElement().value)) {
			this._isChangingDefaultText = true;
			this.getElement().value = this._defaultText;
			this._isChangingDefaultText = false;
		}
		
		return this;
	};
	
	objectFunctions.setText = function(aText) {
		console.log("com.developedbyme.gui.form.InputField::setText");
		
		if(aText === "" && this._defaultText !== null) {
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
		//console.log("com.developedbyme.gui.form.InputField::_focus");
		if(this._defaultText !== null && this.getElement().value === this._defaultText) {
			this._isChangingDefaultText = true;
			this.getElement().value = "";
			this._isChangingDefaultText = false;
		}
	};
	
	objectFunctions._blur = function() {
		//console.log("com.developedbyme.gui.form.InputField::_blur");
		if(this._defaultText !== null && VariableAliases.isNull(this.getElement().value)) {
			this._isChangingDefaultText = true;
			this.getElement().value = this._defaultText;
			this._isChangingDefaultText = false;
		}
	};
	
	objectFunctions._change = function(aEvent) {
		//console.log("com.developedbyme.gui.form.InputField::_change");
		if(this._isChangingDefaultText) return;
		if(this.getElement().value !== this._lastValue) {
			this._value.setValue(this.getElement().value);
			if(this.getExtendedEvent().hasEvent(FormFieldExtendedEventIds.CHANGE)) {
				this.getExtendedEvent().perform(FormFieldExtendedEventIds.CHANGE, this.getElement().value);
			}
		}
		if(aEvent.keyCode === 13) {
			if(this.getExtendedEvent().hasEvent(FormFieldExtendedEventIds.REQUEST_SUBMIT)) {
				this.getExtendedEvent().perform(FormFieldExtendedEventIds.REQUEST_SUBMIT, this.getElement().value);
			}
		}
	};
	
	objectFunctions._updateFlowText = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.gui.form.InputField::_updateFlowText");
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
	
	staticFunctions.create = function(aElement, aDefaultText) {
		return (new InputField()).init().setElement(aElement).setDefaultText(aDefaultText);
	};
	
	staticFunctions.createOnParent = function(aParentOrDocument, aAddToParent, aDefaultText, aType, aAttributes) {
		
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