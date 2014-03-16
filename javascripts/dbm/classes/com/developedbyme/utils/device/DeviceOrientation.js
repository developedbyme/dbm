/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.device.DeviceOrientation", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.device.DeviceOrientation");
	
	//Self reference
	var DeviceOrientation = dbm.importClass("com.developedbyme.utils.device.DeviceOrientation");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var AngleFunctions = dbm.importClass("com.developedbyme.utils.math.AngleFunctions");
	
	//Constants
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	var DeviceExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.DeviceExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.device.DeviceOrientation::_init");
		
		this.superCall();
		
		this._eventDispather = null;
		
		this._hasOrientation = this.createProperty("hasOrientation", false);
		this._alphaValue = this.createProperty("alphaValue", NaN);
		this._betaValue = this.createProperty("betaValue", NaN);
		this._gammaValue = this.createProperty("gammaValue", NaN);
		this._isAbsolute = this.createProperty("isAbsolute", null);
		
		this.getExtendedEvent().createEvent(JavascriptEventIds.DEVICE_ORIENTATION);
		this.getExtendedEvent().createEvent(DeviceExtendedEventIds.COMPASS_NEEDS_CALIBRATION);
		
		this.getExtendedEvent().addCommandToEvent(JavascriptEventIds.DEVICE_ORIENTATION, CallFunctionCommand.createCommand(this, this._orientationUpdated, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.setEventDispatcher = function(aEventDispatcher) {
		
		this._eventDispather = aEventDispatcher;
		
		this.getExtendedEvent().linkJavascriptEvent(this._eventDispather, JavascriptEventIds.DEVICE_ORIENTATION, JavascriptEventIds.DEVICE_ORIENTATION, DeviceExtendedEventIds.ORIENTATION_UPDATED, true);
		this.getExtendedEvent().linkJavascriptEvent(this._eventDispather, JavascriptEventIds.COMPASS_NEEDS_CALIBRATION, DeviceExtendedEventIds.COMPASS_NEEDS_CALIBRATION, DeviceExtendedEventIds.ORIENTATION_UPDATED, true);
		
		return this;
	};
	
	objectFunctions._orientationUpdated = function(aEvent) {
		//console.log("com.developedbyme.utils.device.DeviceOrientation::_orientationUpdated");
		//console.log(aEvent);
		//console.log(aEvent.gamma);
		if(aEvent.alpha === null && aEvent.beta === null && aEvent.gamma === null) {
			if(this.getExtendedEvent().hasEvent(DeviceExtendedEventIds.ORIENTATION_ERROR)) {
				this.getExtendedEvent().perform(DeviceExtendedEventIds.ORIENTATION_ERROR, aEvent);
			}
			return;
		}
		
		if(aEvent.alpha !== null) {
			this._alphaValue.setValue(AngleFunctions.degreesToRadians(aEvent.alpha));
		}
		else {
			this._alphaValue.setValue(NaN);
		}
		if(aEvent.beta !== null) {
			this._betaValue.setValue(AngleFunctions.degreesToRadians(aEvent.beta));
		}
		else {
			this._betaValue.setValue(NaN);
		}
		if(aEvent.gamma !== null) {
			this._gammaValue.setValue(AngleFunctions.degreesToRadians(aEvent.gamma));
		}
		else {
			this._gammaValue.setValue(NaN);
		}
		
		this._isAbsolute.setValue(VariableAliases.isTrue(aEvent.absolute)); //MENOTE: can be missing
		this._hasOrientation.setValue(true);
		
		if(this.getExtendedEvent().hasEvent(DeviceExtendedEventIds.ORIENTATION_UPDATED)) {
			this.getExtendedEvent().perform(DeviceExtendedEventIds.ORIENTATION_UPDATED, aEvent);
		}
	};
	
	objectFunctions.startUpdating = function() {
		console.log("com.developedbyme.utils.device.DeviceOrientation::startUpdating");
		
		this.getExtendedEvent().activateJavascriptEventLink(DeviceExtendedEventIds.ORIENTATION_UPDATED);
		
		return this;
	};
	
	objectFunctions.stopUpdaing = function() {
		
		this.getExtendedEvent().deactivateJavascriptEventLink(DeviceExtendedEventIds.ORIENTATION_UPDATED);
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case DeviceExtendedEventIds.ORIENTATION_UPDATED:
			case DeviceExtendedEventIds.ORIENTATION_ERROR:
			case DeviceExtendedEventIds.COMPASS_NEEDS_CALIBRATION:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._eventDispather = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aEventDispatcher) {
		
		aEventDispatcher = VariableAliases.valueWithDefault(aEventDispatcher, window); //MENOTE: change this to dbm.getWindow()
		
		var newDeviceOrientation = (new ClassReference()).init();
		newDeviceOrientation.setEventDispatcher(aEventDispatcher);
		return newDeviceOrientation;
	};
});