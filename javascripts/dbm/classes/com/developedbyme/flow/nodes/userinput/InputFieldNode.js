/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.userinput.InputFieldObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.userinput.InputFieldObject");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.userinput.InputFieldObject::_init");
		
		this.superCall();
		
		this._element = this.createProperty("element", null);
		this._outputValue = this.createProperty("outputValue", "");
		
		this.getExtendedEvent().createEvent("change");
		this.getExtendedEvent().addCommandToEvent("change", CallFunctionCommand.createCommand(this, this._updateValue, []));
		
		return this;
	};
	
	objectFunctions.start = function() {
		this.getExtendedEvent().linkJavascriptEvent(this._element.getValue(), "change", "change", "change").activate();
		
		return this;
	};
	
	objectFunctions.stop = function() {
		this.getExtendedEvent().deactivateJavascriptLink("change");
		
		return this;
	};
	
	objectFunctions._updateValue = function() {
		this._outputValue.setValue(this._element.getValue().value);
	};
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		newNode.setPropertyInputWithoutNull("outputValue", aElement.value);
		return newNode;
	};
});