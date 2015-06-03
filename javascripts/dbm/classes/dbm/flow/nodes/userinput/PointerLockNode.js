/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.userinput.PointerLockNode", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.userinput.PointerLockNode");
	
	//Self reference
	var PointerLockNode = dbm.importClass("dbm.flow.nodes.userinput.PointerLockNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var JavascriptEventIds = dbm.importClass("dbm.constants.JavascriptEventIds");
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.userinput.PointerLockNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._locked = this.createProperty("locked", false);
		this._document = this.createProperty("document", dbm.getDocument());
		this._element = this.createProperty("element", dbm.getDocument().body);
		
		this.getExtendedEvent().createEvent(JavascriptEventIds.MOUSE_MOVE);
		this.getExtendedEvent().addCommandToEvent(JavascriptEventIds.MOUSE_MOVE, CallFunctionCommand.createCommand(this, this._updatePosition, [GetVariableObject.createSelectDataCommand()]));
		
		this.getExtendedEvent().createEvent(GenericExtendedEventIds.CHANGED);
		this.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.CHANGED, CallFunctionCommand.createCommand(this, this._lockChanged, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.start = function() {
		//console.log("dbm.flow.nodes.userinput.PointerLockNode::start");
		
		this.getExtendedEvent().linkJavascriptEvent(this._document.getValue(), JavascriptEventIds.POINTER_LOCK_CHANGE, GenericExtendedEventIds.CHANGED, GenericExtendedEventIds.CHANGED, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._document.getValue(), JavascriptEventIds.MOUSE_MOVE, JavascriptEventIds.MOUSE_MOVE, JavascriptEventIds.MOUSE_MOVE, true);
		
		this._element.getValue().requestPointerLock();
		
		return this;
	};
	
	objectFunctions.stop = function() {
		//console.log("dbm.flow.nodes.userinput.PointerLockNode::stop");
		this._document.getValue().exitPointerLock();
		
		return this;
	};
	
	//MENOTE: switch this to take x and y as parameters
	objectFunctions._updatePosition = function(aEvent) {
		//console.log("dbm.flow.nodes.userinput.PointerLockNode::_updatePosition");
		//console.log(aEvent);
		
		this._x.setValue(this._x.getValue()+aEvent.movementX);
		this._y.setValue(this._y.getValue()+aEvent.movementY);
		
		//console.log(this._x.getValue(), this._y.getValue());
	};
	
	objectFunctions._lockChanged = function(aEvent) {
		//console.log("dbm.flow.nodes.userinput.PointerLockNode::_lockChanged");
		//console.log(aEvent);
		
		var isLocked = (dbm.getDocument().pointerLockElement === this._element.getValue());
		this._locked.setValue(isLocked);
		if(isLocked) {
			this.getExtendedEvent().activateJavascriptEventLink(JavascriptEventIds.MOUSE_MOVE);
		}
		else {
			this.getExtendedEvent().deactivateJavascriptEventLink(JavascriptEventIds.MOUSE_MOVE);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._element = null;
		this._document = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		
		var newPointerLockNode = (new ClassReference()).init();
		if(!VariableAliases.isNull(aElement)) {
			newPointerLockNode.getProperty("element").setValue(aElement);
		}
		return newPointerLockNode;
	};
});