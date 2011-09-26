dbm.registerClass("com.developedbyme.flow.nodes.browser.WindowSizeNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.browser.WindowSizeNode::init");
		
		this.superCall();
		
		this._width = this.createProperty("width", window.innerWidth);
		this._height = this.createProperty("height", window.innerHeight);
		this._window = this.createProperty("window", window);
		
		this.getExtendedEvent().createEvent("resize");
		this.getExtendedEvent().addCommandToEvent("resize", CallFunctionCommand.createCommand(this, this._updateSize, []));
		
		return this;
	};
	
	objectFunctions.start = function() {
		//console.log("com.developedbyme.flow.nodes.browser.WindowSizeNode::start");
		this.getExtendedEvent().linkJavascriptEvent(this._window.getValue(), "resize", "resize", "resize", true).activate();
	};
	
	objectFunctions.stop = function() {
		this.getExtendedEvent().deactivateJavascriptLink("resize");
	};
	
	objectFunctions._updateSize = function(aEvent) {
		//console.log("com.developedbyme.flow.nodes.browser.WindowSizeNode::_updateSize");
		//console.log(aEvent);
		
		this._width.setValue(window.innerWidth);
		this._height.setValue(window.innerHeight);
	};
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});