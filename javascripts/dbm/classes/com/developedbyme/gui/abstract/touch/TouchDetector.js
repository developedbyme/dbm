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
		this._touches = NamedArray.create(false);
		this._activeTouches = this.createProperty("activeTouches", new Array());
		
		this.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.START, CallFunctionCommand.createCommand(this, this._callback_startTouch, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.END, CallFunctionCommand.createCommand(this, this._callback_stopTouch, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.END_OUTSIDE, CallFunctionCommand.createCommand(this, this._callback_stopTouch, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.MOVE, CallFunctionCommand.createCommand(this, this._callback_updateTouch, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.CANCEL, CallFunctionCommand.createCommand(this, this._callback_cancelTouch, [GetVariableObject.createSelectDataCommand()]));
		
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
	
	objectFunctions._startTouch = function(aIdentifier, aX, aY, aRadiusX, aRadiusY, aRotation, aForce) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_startTouch");
		
		var newTouch = TouchData.create(aIdentifier);
		
		this._touches.addObject(aIdentifier, newTouch);
		var activeTouches = this._activeTouches.getValue();
		activeTouches.push(newTouch);
		this._activeTouches.setAsDirty();
		
		//METODO: send out event
		
		newTouch.startTouch(aX, aY, aRadiusX, aRadiusY, aRotation, aForce);
	};
	
	objectFunctions._updateTouch = function(aIdentifier, aX, aY, aRadiusX, aRadiusY, aRotation, aForce) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_updateTouch");
		
		if(this._touches.select(aIdentifier)) {
			var currentTouch = this._touches.currentSelectedItem;
			currentTouch.updateTouch(aX, aY, aRadiusX, aRadiusY, aRotation, aForce);
		}
		else {
			//METODO: error message
		}
	};
	
	objectFunctions._removeTouch = function(aTouch) {
		
		//METODO: remove from touches
		
		var activeTouches = this._activeTouches.getValue();
		var touchIndex = ArrayFunctions.indexOfInArray(activeTouches, aTouch);
		activeTouches.splice(touchIndex, 1);
		
		this._activeTouches.setAsDirty();
		
	};
	
	objectFunctions._stopTouch = function(aIdentifier, aX, aY, aRadiusX, aRadiusY, aRotation, aForce) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_stopTouch");
		
		if(this._touches.select(aIdentifier)) {
			var currentTouch = this._touches.currentSelectedItem;
			currentTouch.stopTouch(aX, aY, aRadiusX, aRadiusY, aRotation, aForce);
		}
		else {
			//METODO: error message
		}
	};
	
	objectFunctions._cancelTouch = function(aIdentifier, aX, aY, aRadiusX, aRadiusY, aRotation, aForce) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_cancelTouch");
		
		if(this._touches.select(aIdentifier)) {
			var currentTouch = this._touches.currentSelectedItem;
			currentTouch.cancelTouch(aX, aY, aRadiusX, aRadiusY, aRotation, aForce);
		}
		else {
			//METODO: error message
		}
	};
	
	objectFunctions._callback_startTouch = function(aEvent) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_callback_startTouch");
		
		var currentArray = aEvent.changedTouches;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			this._startTouch(currentObject.identifier, currentObject.pageX, currentObject.pageY, currentObject.radiusX, currentObject.radiusY, currentObject.rotationAngle, currentObject.force);
		}
	};
	
	objectFunctions._callback_updateTouch = function(aEvent) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_callback_updateTouch");
		
		var currentArray = aEvent.changedTouches;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			this._updateTouch(currentObject.identifier, currentObject.pageX, currentObject.pageY, currentObject.radiusX, currentObject.radiusY, currentObject.rotationAngle, currentObject.force);
		}
	};
	
	objectFunctions._callback_stopTouch = function(aEvent) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_callback_stopTouch");
		
		var currentArray = aEvent.changedTouches;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			this._stopTouch(currentObject.identifier, currentObject.pageX, currentObject.pageY, currentObject.radiusX, currentObject.radiusY, currentObject.rotationAngle, currentObject.force);
		}
	};
	
	objectFunctions._callback_cancelTouch = function(aEvent) {
		console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_callback_cancelTouch");
		
		var currentArray = aEvent.changedTouches;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			this._cancelTouch(currentObject.identifier, currentObject.pageX, currentObject.pageY, currentObject.radiusX, currentObject.radiusY, currentObject.rotationAngle, currentObject.force);
		}
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