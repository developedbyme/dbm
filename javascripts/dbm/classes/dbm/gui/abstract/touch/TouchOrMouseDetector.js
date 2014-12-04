/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.touch.TouchOrMouseDetector", "dbm.gui.abstract.touch.TouchDetector", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.abstract.touch.TouchOrMouseDetector");
	
	var TouchOrMouseDetector = dbm.importClass("dbm.gui.abstract.touch.TouchOrMouseDetector");
	
	var TouchData = dbm.importClass("dbm.gui.abstract.touch.TouchData");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var MousePositionNode = dbm.importClass("dbm.flow.nodes.userinput.MousePositionNode");
	
	var PositionFunctions = dbm.importClass("dbm.utils.htmldom.PositionFunctions");
	var InteractionExtendedEventSetup = dbm.importClass("dbm.core.extendedevent.setup.InteractionExtendedEventSetup");
	
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	var MouseExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.MouseExtendedEventIds");
	
	staticFunctions._MOUSE_TOUCH_IDENTIFIER = "mouse";
	
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.touch.TouchOrMouseDetector::_init");
		
		this.superCall();
		
		this._mouseTouch = null;
		this._mousePositionNode = null;
		
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.PRESS, CallFunctionCommand.createCommand(this, this._startMouseTouch, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.RELEASE, CallFunctionCommand.createCommand(this, this._stopMouseTouch, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.RELEASE_OUTSIDE, CallFunctionCommand.createCommand(this, this._stopMouseTouch, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(MouseExtendedEventIds.MOVE, CallFunctionCommand.createCommand(this, this._updateMouseTouch, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		//console.log("dbm.gui.abstract.touch.TouchOrMouseDetector::setElement");
		
		this.superCall(aElement);
		
		InteractionExtendedEventSetup.addPressWithMoveEvents(this.getExtendedEvent(), aElement, false, this._useCapture);
		
		this._mousePositionNode = MousePositionNode.create(aElement.ownerDocument);
		this.addDestroyableObject(this._mousePositionNode);
		
		return this;
	};
	
	objectFunctions.activate = function() {
		
		this.superCall();
		
		this._mousePositionNode.start();
		this.getExtendedEvent().activateJavascriptEventLink(ButtonExtendedEventIds.PRESS);
		
		return;
	};
	
	objectFunctions.deactivate = function() {
		
		this.superCall();
		
		this._mousePositionNode.stop();
		this.getExtendedEvent().deactivateJavascriptEventLink(ButtonExtendedEventIds.PRESS);
		
		return;
	};
	
	objectFunctions._startMouseTouch = function(aEvent) {
		console.log("dbm.gui.abstract.touch.TouchOrMouseDetector::_startMouseTouch");
		
		this._currentEvent = aEvent;
		
		var xPosition = this._mousePositionNode.getProperty("x").getValue();
		var yPosition = this._mousePositionNode.getProperty("y").getValue();
		
		this._mouseTouch = this._startTouch(ClassReference._MOUSE_TOUCH_IDENTIFIER, xPosition, yPosition, 0, 0, 0, 1);
		
		this._currentEvent = null;
	};
	
	objectFunctions._stopMouseTouch = function(aEvent) {
		console.log("dbm.gui.abstract.touch.TouchOrMouseDetector::_stopMouseTouch");
		
		this._currentEvent = aEvent;
		
		var xPosition = this._mousePositionNode.getProperty("x").getValue();
		var yPosition = this._mousePositionNode.getProperty("y").getValue();
		
		this._stopTouch(ClassReference._MOUSE_TOUCH_IDENTIFIER, xPosition, yPosition, 0, 0, 0, 1);
		this._mouseTouch = null;
		
		this._currentEvent = null;
	};
	
	objectFunctions._updateMouseTouch = function(aEvent) {
		console.log("dbm.gui.abstract.touch.TouchOrMouseDetector::_updateMouseTouch");
		
		this._currentEvent = aEvent;
		
		var xPosition = this._mousePositionNode.getProperty("x").getValue();
		var yPosition = this._mousePositionNode.getProperty("y").getValue();
		
		this._updateTouch(ClassReference._MOUSE_TOUCH_IDENTIFIER, xPosition, yPosition, 0, 0, 0, 1);
		
		this._currentEvent = null;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ButtonExtendedEventIds.PRESS:
			case ButtonExtendedEventIds.RELEASE:
			case ButtonExtendedEventIds.RELEASE_OUTSIDE:
			case MouseExtendedEventIds.MOVE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		
		var newTouchOrMouseDetector = (new TouchOrMouseDetector()).init();
		
		newTouchOrMouseDetector.setElement(aElement);
		newTouchOrMouseDetector.preventEventDefaults();
		
		return newTouchOrMouseDetector;
	};
});