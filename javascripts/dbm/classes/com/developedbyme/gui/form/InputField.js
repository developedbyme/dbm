dbm.registerClass("com.developedbyme.gui.form.InputField", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.form.InputField");
	
	var InputField = dbm.importClass("com.developedbyme.gui.form.InputField");
	
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	var FormFieldExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.FormFieldExtendedEventIds");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions._ACTIVE = "active";
	staticFunctions._INTERNAL_CHANGE = "internalChange";
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.gui.form.InputField::init");
		
		this.superCall();
		
		this._isActive = false;
		this._value = this.createProperty("value", "");
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
		if(this._defaultText != null && VariableAliases.isNull(this.getElement().value)) {
			this._isChangingDefaultText = true;
			this.getElement().value = this._defaultText;
			this._isChangingDefaultText = false;
		}
		
		return this;
	}
	
	objectFunctions.setText = function(aText) {
		this.getElement().value = this._defaultText;
		
		return this;
	}
	
	objectFunctions.getValue = function() {
		return this._value.getValue();
	}
	
	objectFunctions._focus = function() {
		//console.log("com.developedbyme.gui.form.InputField::_focus");
		if(this._defaultText != null && this.getElement().value == this._defaultText) {
			this._isChangingDefaultText = true;
			this.getElement().value = "";
			this._isChangingDefaultText = false;
		}
	}
	
	objectFunctions._blur = function() {
		//console.log("com.developedbyme.gui.form.InputField::_blur");
		if(this._defaultText != null && VariableAliases.isNull(this.getElement().value)) {
			this._isChangingDefaultText = true;
			this.getElement().value = this._defaultText;
			this._isChangingDefaultText = false;
		}
	}
	
	objectFunctions._change = function(aEvent) {
		//console.log("com.developedbyme.gui.form.InputField::_change");
		if(this._isChangingDefaultText) return;
		this._value.setValue(this.getElement().value);
		if(this.getExtendedEvent().hasEvent(FormFieldExtendedEventIds.CHANGE)) {
			this.getExtendedEvent().perform(FormFieldExtendedEventIds.CHANGE, this.getElement().value);
		}
		if(aEvent.keyCode == 13) {
			if(this.getExtendedEvent().hasEvent(FormFieldExtendedEventIds.REQUEST_SUBMIT)) {
				this.getExtendedEvent().perform(FormFieldExtendedEventIds.REQUEST_SUBMIT, this.getElement().value);
			}
		}
	}
	
	objectFunctions._updateFlowText = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.gui.form.InputField::_updateFlowText");
		this.getElement().value = this._value.getValueWithoutFlow();
	}
	
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
});