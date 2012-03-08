dbm.registerClass("com.developedbyme.flow.nodes.browser.WindowSizeNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.browser.WindowSizeNode::_init");
		
		this.superCall();
		
		this._width = this.createProperty("width", window.innerWidth);
		this._height = this.createProperty("height", window.innerHeight);
		this._window = this.createProperty("window", window);
		
		this.getExtendedEvent().createEvent("resize");
		this.getExtendedEvent().addCommandToEvent("resize", CallFunctionCommand.createCommand(this, this._updateSize, []));
		this.getExtendedEvent().createEventLinkGroup("resize");
		
		this.createUpdateFunction("windowUpdated", this._windowUpdated, [this._window], [this._width, this._height]);
		
		return this;
	};
	
	objectFunctions.start = function() {
		//console.log("com.developedbyme.flow.nodes.browser.WindowSizeNode::start");
		this.getExtendedEvent().linkJavascriptEvent(this._window.getValue(), "resize", "resize", "resize", true).activate();
	};
	
	objectFunctions.stop = function() {
		//this.getExtendedEvent("resize").deactivateJavascriptEventLink();
		this.getExtendedEvent().deactivateJavascriptEventLink("resize");
	};
	
	objectFunctions._windowUpdated = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.browser.WindowSizeNode::_windowUpdated");
		//console.log(aEvent);
		
		var theWindow = this._window.getValueWithoutFlow();
		
		if(theWindow != null) {
			this.start();
			this._width.setValueWithFlow(theWindow.innerWidth, aFlowUpdateNumber);
			this._height.setValueWithFlow(theWindow.innerHeight, aFlowUpdateNumber);
		}
		else {
			this.stop();
		}
	};
	
	objectFunctions._updateSize = function(aEvent) {
		//console.log("com.developedbyme.flow.nodes.browser.WindowSizeNode::_updateSize");
		//console.log(aEvent);
		
		var theWindow = this._window.getValue();
		
		if(theWindow != null) {
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