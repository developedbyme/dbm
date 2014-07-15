/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.browser.LayoutChangeNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.browser.LayoutChangeNode");
	
	//Self reference
	var LayoutChangeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.LayoutChangeNode");
	
	//Error report
	
	//Dependencies
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	var WindowForElementNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowForElementNode");
	var DocumentForElementNode = dbm.importClass("com.developedbyme.flow.nodes.browser.DocumentForElementNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.browser.LayoutChangeNode::_init");
		
		this.superCall();
		
		this._element = this.createProperty("element", null);
		
		this._documentNode = this.addDestroyableObject(DocumentForElementNode.create(this._element));
		this._windowNode = this.addDestroyableObject(WindowForElementNode.create(this._element));
		this._windowSizeNode = this.addDestroyableObject(WindowSizeNode.create(this._windowNode.getProperty("window")));
		
		this._document = this.createProperty("document", this._documentNode.getProperty("document"));
		this._updateDocument = this.createGhostProperty("updateDocument");
		this._domChange = this.createGhostProperty("domChange");
		this._width = this.createProperty("width", this._windowSizeNode.getProperty("width"));
		this._height = this.createProperty("height", this._windowSizeNode.getProperty("height"));
		
		this._change = this.addProperty("change", AnyChangeMultipleInputProperty.create(this._objectProperty));
		this._change.connectInput(this._updateDocument);
		this._change.connectInput(this._domChange);
		this._change.connectInput(this._width);
		this._change.connectInput(this._height);
		
		this._mutationObserver = null;
		
		this.createUpdateFunction("documentUpdated", this._documentUpdated, [this._document], [this._updateDocument]);
		
		return this;
	};
	
	objectFunctions._documentUpdated = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.browser.LayoutChangeNode::_documentUpdated");
		
		//METODO: set mutation
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._element = null;
		
		this._documentNode = null;
		this._windowNode = null;
		this._windowSizeNode = null;
		
		this._document = null;
		this._updateDocument = null;
		this._domChange = null;
		this._width = null;
		this._height = null;
		
		this._change = null;
		
		this._mutationObserver = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		return newNode;
	};
});