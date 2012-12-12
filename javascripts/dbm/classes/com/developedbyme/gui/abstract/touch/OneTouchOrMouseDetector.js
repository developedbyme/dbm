dbm.registerClass("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector", "com.developedbyme.gui.abstract.touch.TouchDetector", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector");
	
	var OneTouchOrMouseDetector = dbm.importClass("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector");
	
	var InteractionExtendedEventSetup = dbm.importClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var MouseExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MouseExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector::_init");
		
		this.superCall();
		
		this._globalPositionPoint = Point.create();
		this.addDestroyableObject(this._globalPositionPoint);
		
		this._mousePositionNode = null;
		
		this._mouseTouch = null;
		
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.PRESS, CallFunctionCommand.createCommand(this, this._startMouseTouch, []));
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.RELEASE, CallFunctionCommand.createCommand(this, this._stopMouseTouch, []));
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.RELEASE_OUTSIDE, CallFunctionCommand.createCommand(this, this._stopMouseTouch, []));
		this.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.MOUSE_MOVE, CallFunctionCommand.createCommand(this, this._updateMouseTouch, []));
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		InteractionExtendedEventSetup.addPressWithMoveEvents(this.getExtendedEvent(), aElement, false);
		
		this._mousePositionNode = MousePositionNode.create(aElement.ownerDocument);
		this.addDestroyableObject(this._mousePositionNode);
		
		return this;
	};
	
	objectFunctions._startMouseTouch = function() {
		
	};
	
	objectFunctions._stopMouseTouch = function() {
		
	};
	
	objectFunctions._updateMouseTouch = function() {
		
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
	
	staticFunctions.create = function() {
		
		var newOneTouchOrMouseDetector = (new OneTouchOrMouseDetector()).init();
		
		return newOneTouchOrMouseDetector;
	};
});