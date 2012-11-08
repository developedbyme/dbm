dbm.registerClass("com.developedbyme.flow.nodes.userinput.ConfirmLeavePageNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.userinput.ConfirmLeavePageNode");
	
	var ConfirmLeavePageNode = dbm.importClass("com.developedbyme.flow.nodes.userinput.ConfirmLeavePageNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.userinput.ConfirmLeavePageNode::_init");
		
		this.superCall();
		
		this._confirm = this.createProperty("confirm", true);
		this._text = this.createProperty("text", "");
		this._window = this.createProperty("window", window);
		
		var thisPointer = this;
		this._callback_confirmFunction = function(aEvent) {
			return thisPointer._confirmFunction(aEvent);
		}
		
		return this;
	};
	
	objectFunctions.start = function() {
		//console.log("com.developedbyme.flow.nodes.userinput.ConfirmLeavePageNode::start");
		
		//METODO: switch to constant
		this._window.getValue().addEventListener("beforeunload", this._callback_confirmFunction, false);
		
		return this;
	};
	
	objectFunctions.stop = function() {
		//console.log("com.developedbyme.flow.nodes.userinput.ConfirmLeavePageNode::stop");
		
		//METODO: switch to constant
		this._window.getValue().removeEventListener("beforeunload", this._callback_confirmFunction, false);
		
		return this;
	};
	
	objectFunctions._confirmFunction = function(aEvent) {
		//console.log("com.developedbyme.flow.nodes.userinput.ConfirmLeavePageNode::_confirmFunction");
		//console.log(aEvent);
		
		if(this._confirm.getValue()) {
			
			var message = this._text.getValue();
			
			aEvent.cancelBubble = true;
			aEvent.returnValue = message;
			aEvent.stopPropagation();
			aEvent.preventDefault();
			
			return message;
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		if(this._window != null) {
			this.stop();
		}
		
		this._confirm = null;
		this._text = null;
		this._window = null;
		
		this._callbackFunction = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aWindow, aText, aConfirm) {
		
		var newConfirmLeavePageNode = (new ClassReference()).init();
		newConfirmLeavePageNode.setPropertyInputWithoutNull("window", aWindow);
		newConfirmLeavePageNode.setPropertyInputWithoutNull("text", aText);
		newConfirmLeavePageNode.setPropertyInputWithoutNull("confirm", aConfirm);
		return newConfirmLeavePageNode;
	};
});