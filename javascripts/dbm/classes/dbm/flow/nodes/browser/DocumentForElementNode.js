/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.browser.DocumentForElementNode", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.browser.DocumentForElementNode");
	
	//Self reference
	var DocumentForElementNode = dbm.importClass("dbm.flow.nodes.browser.DocumentForElementNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var SetPropertyAsDirtyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	
	//Constants
	var JavascriptEventIds = dbm.importClass("dbm.constants.htmlevents.JavascriptEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.browser.DocumentForElementNode::_init");
		
		this.superCall();
		
		this._element = this.createProperty("element", null);
		this._document = this.createProperty("document", null);
		
		this.createUpdateFunction("default", this._update, [this._element], [this._document]);
		
		this.getExtendedEvent().createEvent("documentChanged");
		this.getExtendedEvent().addCommandToEvent("documentChanged", SetPropertyAsDirtyCommand.createCommand(this._element));
		
		return this;
	};
	
	objectFunctions.start = function() {
		//console.log("dbm.flow.nodes.browser.DocumentForElementNode::start");
		this.getExtendedEvent().linkJavascriptEvent(this._element.getValue(), JavascriptEventIds.DOM_NODE_INSERTED_INTO_DOCUMENT, "documentChanged", "documentChanged", true).activate();
	};
	
	objectFunctions.stop = function() {
		this.getExtendedEvent().deactivateJavascriptLink("documentChanged");
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.browser.DocumentForElementNode::_update");
		
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