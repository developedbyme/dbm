dbm.registerClass("com.developedbyme.flow.nodes.browser.DocumentForElementNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.browser.DocumentForElementNode");
	
	var DocumentForElementNode = dbm.importClass("com.developedbyme.flow.nodes.browser.DocumentForElementNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var SetPropertyAsDirtyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.browser.DocumentForElementNode::_init");
		
		this.superCall();
		
		this._element = this.createProperty("element", null);
		this._document = this.createProperty("document", null);
		
		this.createUpdateFunction("default", this._update, [this._element], [this._document]);
		
		this.getExtendedEvent().createEvent("documentChanged");
		this.getExtendedEvent().addCommandToEvent("documentChanged", SetPropertyAsDirtyCommand.createCommand(this._element));
		
		return this;
	};
	
	objectFunctions.start = function() {
		//console.log("com.developedbyme.flow.nodes.browser.DocumentForElementNode::start");
		this.getExtendedEvent().linkJavascriptEvent(this._element.getValue(), JavascriptEventIds.DOM_NODE_INSERTED_INTO_DOCUMENT, "documentChanged", "documentChanged", true).activate();
	};
	
	objectFunctions.stop = function() {
		this.getExtendedEvent().deactivateJavascriptLink("documentChanged");
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.browser.DocumentForElementNode::_update");
		
		var element = this._element.getValueWithoutFlow();
		if(element !== null) {
			this.start();
			this._document.setValueWithFlow(DomReferenceFunctions.getDocument(element), aFlowUpdateNumber);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._element = null;
		this._document = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		return newNode;
	};
});