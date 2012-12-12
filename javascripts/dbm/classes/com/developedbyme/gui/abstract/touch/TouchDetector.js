dbm.registerClass("com.developedbyme.gui.abstract.touch.TouchDetector", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.abstract.touch.TouchDetector");
	
	var TouchDetector = dbm.importClass("com.developedbyme.gui.abstract.touch.TouchDetector");
	
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var TouchData = dbm.importClass("com.developedbyme.gui.abstract.touch.TouchData");
	
	var InteractionExtendedEventSetup = dbm.importClass("com.developedbyme.core.extendedevent.setup.InteractionExtendedEventSetup");
	
	var TouchExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.TouchExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_init");
		
		this.superCall();
		
		this._element = null;
		this._isActive = false;
		this._activeTouches = this.createProperty("activeTouches", new Array());
		
		this.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.START, CallFunctionCommand.createCommand(this, this._startTouch, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.END, CallFunctionCommand.createCommand(this, this._stopTouch, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.END_OUTSIDE, CallFunctionCommand.createCommand(this, this._stopTouch, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.MOVE, CallFunctionCommand.createCommand(this, this._updateTouch, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.CANCEL, CallFunctionCommand.createCommand(this, this._cancelTouch, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this._element = aElement;
		
		InteractionExtendedEventSetup.addTouchPressWithMoveEvents(this.getExtendedEvent(), aElement, false);
		
		InteractionExtendedEventSetup.preventDefaultForEvent(this.getExtendedEvent(), TouchExtendedEventIds.START);
		InteractionExtendedEventSetup.preventDefaultForEvent(this.getExtendedEvent(), TouchExtendedEventIds.END);
		InteractionExtendedEventSetup.preventDefaultForEvent(this.getExtendedEvent(), TouchExtendedEventIds.END_OUTSIDE);
		InteractionExtendedEventSetup.preventDefaultForEvent(this.getExtendedEvent(), TouchExtendedEventIds.MOVE);
		InteractionExtendedEventSetup.preventDefaultForEvent(this.getExtendedEvent(), TouchExtendedEventIds.CANCEL);
		
		return this;
	};
	
	objectFunctions.activate = function() {
		this._isActive = true;
		
		this.getExtendedEvent().activateJavascriptEventLink(TouchExtendedEventIds.START);
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		this._isActive = false;
		
		this.getExtendedEvent().deactivateJavascriptEventLink(TouchExtendedEventIds.START);
		
		return this;
	};
	
	objectFucntions._startTouch = function(aEvent) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_startTouch");
	};
	
	objectFucntions._updateTouch = function(aEvent) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_updateTouch");
	};
	
	objectFucntions._stopTouch = function(aEvent) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_stopTouch");
	};
	
	objectFucntions._cancelTouch = function(aEvent) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_cancelTouch");
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case TouchExtendedEventIds.START:
			case TouchExtendedEventIds.END:
			case TouchExtendedEventIds.END_OUTSIDE:
			case TouchExtendedEventIds.MOVE:
			case TouchExtendedEventIds.ENTER:
			case TouchExtendedEventIds.LEAVE:
			case TouchExtendedEventIds.CANCEL:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		
		var newTouchDetector = (new TouchDetector()).init();
		
		return newTouchDetector;
	};
});