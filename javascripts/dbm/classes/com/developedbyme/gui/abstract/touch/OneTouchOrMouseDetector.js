dbm.registerClass("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector", "com.developedbyme.gui.abstract.touch.TouchDetector", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector");
	
	var OneTouchOrMouseDetector = dbm.importClass("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector");
	
	var TouchData = dbm.importClass("com.developedbyme.gui.abstract.touch.TouchData");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var MousePositionNode = dbm.importClass("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	
	var PositionFunctions = dbm.importClass("com.developedbyme.utils.htmldom.PositionFunctions");
	var InteractionExtendedEventSetup = dbm.importClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var MouseExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MouseExtendedEventIds");
	
	staticFunctions._MOUSE_TOUCH_IDENTIFIER = "mouse";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector::_init");
		
		this.superCall();
		
		this._selectionPoint = TouchData.create(ClassReference._MOUSE_TOUCH_IDENTIFIER);
		this._mouseTouch = null;
		this._mousePositionNode = null;
		
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.PRESS, CallFunctionCommand.createCommand(this, this._startMouseTouch, []));
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.RELEASE, CallFunctionCommand.createCommand(this, this._stopMouseTouch, []));
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.RELEASE_OUTSIDE, CallFunctionCommand.createCommand(this, this._stopMouseTouch, []));
		this.getExtendedEvent().addCommandToEvent(MouseExtendedEventIds.MOVE, CallFunctionCommand.createCommand(this, this._updateMouseTouch, []));
		
		return this;
	};
	
	objectFunctions.getSelectionPoint = function() {
		return this._selectionPoint;
	};
	
	objectFunctions.setElement = function(aElement) {
		//console.log("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector::setElement");
		
		this.superCall(aElement);
		
		InteractionExtendedEventSetup.addPressWithMoveEvents(this.getExtendedEvent(), aElement, false);
		
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
	
	objectFunctions._createTouch = function(aIdentifier) {
		//console.log("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector::_createTouch");
		//console.log(aIdentifier);
		var activeTouches = this._activeTouches.getValue();
		//if(activeTouches.length == 0) { //MEDEBUG: touches are not removed correctly
			//console.log("Use selection point");
			this._selectionPoint.id = aIdentifier;
			return this._selectionPoint;
		//}
		return this.superCall(aIdentifier);
	};
	
	objectFunctions._startMouseTouch = function() {
		console.log("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector::_startMouseTouch");
		
		var xPosition = this._mousePositionNode.getProperty("x").getValue();
		var yPosition = this._mousePositionNode.getProperty("y").getValue();
		
		this._mouseTouch = this._startTouch(ClassReference._MOUSE_TOUCH_IDENTIFIER, xPosition, yPosition, 0, 0, 0, 1);
		
	};
	
	objectFunctions._stopMouseTouch = function() {
		console.log("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector::_stopMouseTouch");
		
		var xPosition = this._mousePositionNode.getProperty("x").getValue();
		var yPosition = this._mousePositionNode.getProperty("y").getValue();
		
		this._stopTouch(ClassReference._MOUSE_TOUCH_IDENTIFIER, xPosition, yPosition, 0, 0, 0, 1);
		this._mouseTouch = null;
	};
	
	objectFunctions._updateMouseTouch = function() {
		console.log("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector::_updateMouseTouch");
		
		var xPosition = this._mousePositionNode.getProperty("x").getValue();
		var yPosition = this._mousePositionNode.getProperty("y").getValue();
		
		this._updateTouch(ClassReference._MOUSE_TOUCH_IDENTIFIER, xPosition, yPosition, 0, 0, 0, 1);
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
		
		var newOneTouchOrMouseDetector = (new OneTouchOrMouseDetector()).init();
		
		newOneTouchOrMouseDetector.setElement(aElement);
		
		return newOneTouchOrMouseDetector;
	};
});