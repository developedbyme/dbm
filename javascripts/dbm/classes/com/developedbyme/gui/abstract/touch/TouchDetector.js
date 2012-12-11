dbm.registerClass("com.developedbyme.gui.abstract.touch.TouchDetector", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.abstract.touch.TouchDetector");
	
	var TouchDetector = dbm.importClass("com.developedbyme.gui.abstract.touch.TouchDetector");
	
	var TouchExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.TouchExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.abstract.touch.TouchDetector::_init");
		
		this.superCall();
		
		this._isActive = false;
		
		return this;
	};
	
	objectFunctions.addElement = function(aElement) {
		//METODO: store the element
		InteractionExtendedEventSetup.addClickEvents(this.getExtendedEvent(), aElement, false);
		InteractionExtendedEventSetup.addMouseOverEvents(this.getExtendedEvent(), aElement, false);
		
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