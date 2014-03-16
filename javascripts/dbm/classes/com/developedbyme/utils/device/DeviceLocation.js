/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.device.DeviceLocation", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.device.DeviceLocation");
	
	var DeviceLocation = dbm.importClass("com.developedbyme.utils.device.DeviceLocation");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var DeviceExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.DeviceExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.device.DeviceLocation::_init");
		
		this.superCall();
		
		this._geolocation = null;
		this._isUpdaing = false;
		this._watchId = -1;
		this._options = null;
		
		this._hasPosition = this.createProperty("hasPosition", false);
		this._hasAltitude = this.createProperty("hasAltitude", false);
		this._hasDirection = this.createProperty("hasDirection", false);
		this._latitude = this.createProperty("latitude", NaN);
		this._longitude = this.createProperty("longitude", NaN);
		this._altitude = this.createProperty("altitude", NaN);
		this._accuracy = this.createProperty("accuracy", NaN);
		this._altitudeAccuracy = this.createProperty("altitudeAccuracy", NaN);
		this._heading = this.createProperty("heading", NaN);
		this._speed = this.createProperty("speed", NaN);
		this._lastUpdate = this.createProperty("lastUpdate", 0);
		
		var thisPointer = this;
		
		this._requestCallback = function(aEvent) {
			//console.log("_requestCallback (callback)");
			thisPointer._positionUpdated(aEvent);
		};
		this._errorCallback = function(aEvent) {
			//console.log("_errorCallback (callback)");
			thisPointer._positionError(aEvent);
		};
		
		return this;
	};
	
	objectFunctions.setGeolocation = function(aGeolocation) {
		
		this._geolocation = aGeolocation;
		
		return this;
	};
	
	objectFunctions.setOptions = function(aEnableHighAccuracy, aTimeout, aMaximumAge) {
		this._options = {"enableHighAccuracy": false, "timeout": aTimeout, "maximumAge": aMaximumAge};
	};
	
	objectFunctions._positionUpdated = function(aEvent) {
		//console.log("com.developedbyme.utils.device.DeviceLocation::_requestCallback");
		//console.log(aEvent);
		
		var coordinates = aEvent.coords;
		this._lastUpdate.setValue(aEvent.timestamp);
		
		this._hasPosition.setValue(true);
		this._latitude.setValue(coordinates.latitude);
		this._longitude.setValue(coordinates.longitude);
		this._accuracy.setValue(coordinates.accuracy);
		
		if(coordinates.altitude !== null) {
			this._hasAltitude.setValue(true);
			this._altitude.setValue(coordinates.altitude);
			this._altitudeAccuracy.setValue(coordinates.altitudeAccuracy);
		}
		else {
			this._hasAltitude.setValue(false);
		}
		
		if(coordinates.heading !== null) {
			this._hasDirection.setValue(true);
			this._heading.setValue(coordinates.heading);
			this._speed.setValue(coordinates.speed);
		}
		else {
			this._hasDirection.setValue(false);
		}
		
		if(this.getExtendedEvent().hasEvent(DeviceExtendedEventIds.POSITION_UPDATED)) {
			this.getExtendedEvent().perform(DeviceExtendedEventIds.POSITION_UPDATED, aEvent);
		}
	};
	
	objectFunctions._positionError = function(aEvent) {
		console.log("com.developedbyme.utils.device.DeviceLocation::_errorCallback");
		console.log(aEvent);
		
		//METODO: error message
		
		if(this.getExtendedEvent().hasEvent(DeviceExtendedEventIds.POSITION_ERROR)) {
			this.getExtendedEvent().perform(DeviceExtendedEventIds.POSITION_ERROR, aEvent);
		}
	};
	
	objectFunctions.updatePosition = function() {
		
		this._geolocation.getCurrentPosition(this._requestCallback, this._errorCallback, this._options);
		
		return this;
	};
	
	objectFunctions.startUpdating = function() {
		if(this._isUpdaing) return;
		this._isUpdaing = true;
		this._watchId = this._geolocation.watchPosition(this._requestCallback, this._errorCallback, this._options);
		
		return this;
	};
	
	objectFunctions.stopUpdating = function() {
		if(!this._isUpdaing) return;
		this._geolocation.clearWatch(this._watchId);
		this._watchId = -1;
		this._isUpdaing = false;
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case DeviceExtendedEventIds.POSITION_UPDATED:
			case DeviceExtendedEventIds.POSITION_ERROR:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._geolocation = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aGeolocation) {
		
		aGeolocation = VariableAliases.valueWithDefault(aGeolocation, window.navigator.geolocation);  //MENOTE: change this to dbm.getWindow()
		
		var newDeviceLocation = (new ClassReference()).init();
		newDeviceLocation.setGeolocation(aGeolocation);
		return newDeviceLocation;
	};
});