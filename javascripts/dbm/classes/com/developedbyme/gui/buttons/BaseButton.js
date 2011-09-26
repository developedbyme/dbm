dbm.registerClass("com.developedbyme.gui.buttons.BaseButton", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var CssCursorTypes = dbm.importClass("com.developedbyme.constants.CssCursorTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.gui.buttons.BaseButton::init");
		
		this.superCall();
		
		this._isActive = false;
		this._useHandCursor = true;
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this.getExtendedEvent().linkJavascriptEvent(aElement, "click", ButtonExtendedEventIds.CLICK, ButtonExtendedEventIds.CLICK, true, true);
		
		return this;
	};
	
	objectFunctions.activate = function() {
		this._isActive = true;
		
		if(this._useHandCursor) {
			this.setStyleProperty("cursor", CssCursorTypes.POINTER);
		}
		
		this.getExtendedEvent().activateJavascriptEventLink(ButtonExtendedEventIds.CLICK);
		
		return this;
	};
	
	objectFunctions.deactivate = function() {
		this._isActive = false;
		
		if(this._useHandCursor) {
			this.removeStyleProperty("cursor");
		}
		
		this.getExtendedEvent().deactivateJavascriptEventLink(ButtonExtendedEventIds.CLICK);
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ButtonExtendedEventIds.CLICK:
			case ButtonExtendedEventIds.MOUSE_OVER:
			case ButtonExtendedEventIds.MOUSE_OUT:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aElement) {
		return (new BaseButton()).init().setElement(aElement);
	}
});