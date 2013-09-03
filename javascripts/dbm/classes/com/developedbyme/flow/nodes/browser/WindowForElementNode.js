dbm.registerClass("com.developedbyme.flow.nodes.browser.WindowForElementNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.browser.WindowForElementNode");
	
	var WindowForElementNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowForElementNode");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var SetPropertyAsDirtyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.browser.WindowForElementNode::_init");
		
		this.superCall();
		
		this._element = this.createProperty("element", null);
		this._window = this.createProperty("window", null);
		
		//MENOTE: Since events for changing document doesn't work this property can be used to flasg those changes
		this._document = this.createProperty("document", null);
		
		this.createUpdateFunction("default", this._update, [this._element, this._document], [this._window]);
		
		this.getExtendedEvent().createEvent("windowChanged");
		this.getExtendedEvent().addCommandToEvent("windowChanged", SetPropertyAsDirtyCommand.createCommand(this._element));
		//this.getExtendedEvent().addCommandToEvent("windowChanged", LogCommand.createCommand("test"));
		
		return this;
	};
	
	objectFunctions.start = function() {
		//console.log("com.developedbyme.flow.nodes.browser.WindowForElementNode::start");
		this.getExtendedEvent().linkJavascriptEvent(this._element.getValue(), JavascriptEventIds.DOM_NODE_INSERTED_INTO_DOCUMENT, "windowChanged", "windowChanged", true, true).activate();
	};
	
	objectFunctions.stop = function() {
		this.getExtendedEvent().deactivateJavascriptLink("windowChanged");
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.browser.WindowForElementNode::_update");
		
		var element = this._element.getValueWithoutFlow();
		if(element !== null) {
			this.start();
			this._window.setValueWithFlow(DomReferenceFunctions.getDocument(element).defaultView, aFlowUpdateNumber);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._element = null;
		this._window = null;
		this._document = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		return newNode;
	};
});