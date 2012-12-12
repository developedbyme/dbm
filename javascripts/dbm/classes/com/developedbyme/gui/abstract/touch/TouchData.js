dbm.registerClass("com.developedbyme.gui.abstract.touch.TouchData", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.abstract.touch.TouchData");
	
	var TouchData = dbm.importClass("com.developedbyme.gui.abstract.touch.TouchData");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.abstract.touch.TouchData::_init");
		
		this.superCall();
		
		this.id = null;
		this._isTouching = this.createProperty("isTouching", false);
		
		this._startX = this.createProperty("startX", 0);
		this._startY = this.createProperty("startY", 0);
		
		this._currentX = this.createProperty("currentX", 0);
		this._currentY = this.createProperty("currentY", 0);
		
		return this;
	};
	
	objectFunctions.startTouch = function(aX, aY) {
		
		this._isTouching.setValue(true);
		
		this._startX.setValue(aX);
		this._startY.setValue(aY);
		
		this._currentX.setValue(aX);
		this._currentY.setValue(aY);
		
		return this;
	};
	
	objectFunctions.updateTouch = function(aX, aY) {
		
		this._currentX.setValue(aX);
		this._currentY.setValue(aY);
		
		return this;
	};
	
	objectFunctions.stopTouch = function(aX, aY) {
		
		this._isTouching.setValue(false);
		
		this._currentX.setValue(aX);
		this._currentY.setValue(aY);
		
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
	
	staticFunctions.create = function(aId) {
		
		var newTouchData = (new TouchData()).init();
		
		newTouchData.id = null;
		
		return newTouchData;
	};
});