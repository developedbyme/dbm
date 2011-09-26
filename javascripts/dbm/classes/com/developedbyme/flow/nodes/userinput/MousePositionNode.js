dbm.registerClass("com.developedbyme.flow.nodes.userinput.MousePositionNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.userinput.MousePositionNode::init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._document = this.createProperty("document", document);
		
		this.getExtendedEvent().createEvent("mousemove");
		this.getExtendedEvent().addCommandToEvent("mousemove", CallFunctionCommand.createCommand(this, this._updatePosition, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.start = function() {
		//console.log("com.developedbyme.flow.nodes.userinput.MousePositionNode::start");
		this.getExtendedEvent().linkJavascriptEvent(this._document.getValue(), "mousemove", "mousemove", "mousemove").activate();
		
		return this;
	};
	
	objectFunctions.stop = function() {
		this.getExtendedEvent().deactivateJavascriptLink("mousemove");
		
		return this;
	};
	
	objectFunctions._updatePosition = function(aEvent) {
		//console.log("com.developedbyme.flow.nodes.userinput.MousePositionNode::_updatePosition");
		//console.log(aEvent);
		
		this._x.setValue(aEvent.pageX);
		this._y.setValue(aEvent.pageY);
	};
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});