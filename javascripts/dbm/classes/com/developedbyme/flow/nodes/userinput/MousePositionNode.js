dbm.registerClass("com.developedbyme.flow.nodes.userinput.MousePositionNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	
	var MousePositionNode = dbm.importClass("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.userinput.MousePositionNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._document = this.createProperty("document", document);
		
		this.getExtendedEvent().createEvent(JavascriptEventIds.MOUSE_MOVE);
		this.getExtendedEvent().addCommandToEvent(JavascriptEventIds.MOUSE_MOVE, CallFunctionCommand.createCommand(this, this._updatePosition, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.start = function() {
		//console.log("com.developedbyme.flow.nodes.userinput.MousePositionNode::start");
		this.getExtendedEvent().linkJavascriptEvent(this._document.getValue(), JavascriptEventIds.MOUSE_MOVE, JavascriptEventIds.MOUSE_MOVE, JavascriptEventIds.MOUSE_MOVE, true).activate();
		
		return this;
	};
	
	objectFunctions.stop = function() {
		//console.log("com.developedbyme.flow.nodes.userinput.MousePositionNode::stop");
		this.getExtendedEvent().deactivateJavascriptLink(JavascriptEventIds.MOUSE_MOVE);
		
		return this;
	};
	
	objectFunctions._updatePosition = function(aEvent) {
		//console.log("com.developedbyme.flow.nodes.userinput.MousePositionNode::_updatePosition");
		//console.log(aEvent);
		
		this._x.setValue(aEvent.pageX);
		this._y.setValue(aEvent.pageY);
		
		//console.log(this._x, this._y);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._document = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		
		var newMousePositionNode = (new ClassReference()).init();
		if(!VariableAliases.isNull(aElement)) {
			newMousePositionNode._document.setValue(aElement);
		}
		return newMousePositionNode;
	};
});