/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.userinput.MousePositionNode", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.userinput.MousePositionNode");
	
	var MousePositionNode = dbm.importClass("dbm.flow.nodes.userinput.MousePositionNode");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var JavascriptEventIds = dbm.importClass("dbm.constants.JavascriptEventIds");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.userinput.MousePositionNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._document = this.createProperty("document", dbm.getDocument());
		
		this.getExtendedEvent().createEvent(JavascriptEventIds.MOUSE_MOVE);
		this.getExtendedEvent().addCommandToEvent(JavascriptEventIds.MOUSE_MOVE, CallFunctionCommand.createCommand(this, this._updatePosition, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.start = function() {
		//console.log("dbm.flow.nodes.userinput.MousePositionNode::start");
		this.getExtendedEvent().linkJavascriptEvent(this._document.getValue(), JavascriptEventIds.MOUSE_MOVE, JavascriptEventIds.MOUSE_MOVE, JavascriptEventIds.MOUSE_MOVE, true).activate();
		
		return this;
	};
	
	objectFunctions.stop = function() {
		//console.log("dbm.flow.nodes.userinput.MousePositionNode::stop");
		this.getExtendedEvent().deactivateJavascriptLink(JavascriptEventIds.MOUSE_MOVE);
		
		return this;
	};
	
	//MENOTE: switch this to take x and y as parameters
	objectFunctions._updatePosition = function(aEvent) {
		//console.log("dbm.flow.nodes.userinput.MousePositionNode::_updatePosition");
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
			newMousePositionNode.getProperty("document").setValue(aElement);
		}
		return newMousePositionNode;
	};
});