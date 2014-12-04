/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.browser.WindowSizeNode", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.browser.WindowSizeNode");
	
	//Self reference
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.browser.WindowSizeNode::_init");
		
		this.superCall();
		
		var currentWindow = dbm.getWindow();
		this._width = this.createProperty("width", currentWindow.innerWidth);
		this._height = this.createProperty("height", currentWindow.innerHeight);
		this._window = this.createProperty("window", currentWindow);
		
		this.getExtendedEvent().createEvent("resize");
		this.getExtendedEvent().addCommandToEvent("resize", CallFunctionCommand.createCommand(this, this._updateSize, []));
		this.getExtendedEvent().createEventLinkGroup("resize");
		
		this.createUpdateFunction("windowUpdated", this._windowUpdated, [this._window], [this._width, this._height]);
		
		return this;
	};
	
	objectFunctions.start = function() {
		//console.log("dbm.flow.nodes.browser.WindowSizeNode::start");
		this.getExtendedEvent().linkJavascriptEvent(this._window.getValue(), "resize", "resize", "resize", true).activate();
	};
	
	objectFunctions.stop = function() {
		//this.getExtendedEvent("resize").deactivateJavascriptEventLink();
		this.getExtendedEvent().deactivateJavascriptEventLink("resize");
	};
	
	objectFunctions._windowUpdated = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.browser.WindowSizeNode::_windowUpdated");
		//console.log(aEvent);
		
		var theWindow = this._window.getValueWithoutFlow();
		
		if(theWindow !== null) {
			this.start();
			this._width.setValueWithFlow(theWindow.innerWidth, aFlowUpdateNumber);
			this._height.setValueWithFlow(theWindow.innerHeight, aFlowUpdateNumber);
		}
		else {
			//METODO: remove old listener for reactivation
			this.stop();
		}
	};
	
	objectFunctions._updateSize = function(aEvent) {
		//console.log("dbm.flow.nodes.browser.WindowSizeNode::_updateSize");
		//console.log(aEvent);
		
		var theWindow = this._window.getValue();
		
		if(theWindow !== null) {
			this._width.setValue(theWindow.innerWidth);
			this._height.setValue(theWindow.innerHeight);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._width = null;
		this._height = null;
		this._window = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aWindow) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("window", aWindow);
		return newNode;
	};
});