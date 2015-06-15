/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Class that listens for device motion events.
 */
dbm.registerClass("dbm.utils.device.DeviceMotion", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.device.DeviceMotion");
	
	//Self reference
	var DeviceMotion = dbm.importClass("dbm.utils.device.DeviceMotion");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var AngleFunctions = dbm.importClass("dbm.utils.math.AngleFunctions");
	
	//Constants
	var JavascriptEventIds = dbm.importClass("dbm.constants.htmlevents.JavascriptEventIds");
	var DeviceExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.DeviceExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.device.DeviceMotion::_init");
		
		this.superCall();
		
		this._eventDispather = null;
		
		this._xValue = this.createProperty("xValue", NaN);
		this._yValue = this.createProperty("yValue", NaN);
		this._zValue = this.createProperty("zValue", NaN);
		this._xWithGravityValue = this.createProperty("xWithGravityValue", NaN);
		this._yWithGravityValue = this.createProperty("yWithGravityValue", NaN);
		this._zWithGravityValue = this.createProperty("zWithGravityValue", NaN);
		this._alphaValue = this.createProperty("alphaValue", NaN);
		this._betaValue = this.createProperty("betaValue", NaN);
		this._gammaValue = this.createProperty("gammaValue", NaN);
		this._interval = this.createProperty("interval", -1);
		
		this.getExtendedEvent().createEvent(DeviceExtendedEventIds.MOTION_UPDATED);
		
		this.getExtendedEvent().addCommandToEvent(DeviceExtendedEventIds.MOTION_UPDATED, CallFunctionCommand.createCommand(this, this._motionUpdated, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.setEventDispatcher = function(aEventDispatcher) {
		
		this._eventDispather = aEventDispatcher;
		
		this.getExtendedEvent().linkJavascriptEvent(this._eventDispather, JavascriptEventIds.DEVICE_MOTION, DeviceExtendedEventIds.MOTION_UPDATED, DeviceExtendedEventIds.MOTION_UPDATED, true);
		
		return this;
	};
	
	objectFunctions._motionUpdated = function(aEvent) {
		//console.log("dbm.utils.device.DeviceMotion::_motionUpdated");
		//console.log(aEvent);
		
		this._xValue.setValue(this._valueOrNaN(aEvent.acceleration.x));
		this._yValue.setValue(this._valueOrNaN(aEvent.acceleration.y));
		this._zValue.setValue(this._valueOrNaN(aEvent.acceleration.z));
		
		this._xWithGravityValue.setValue(this._valueOrNaN(aEvent.accelerationIncludingGravity.x));
		this._yWithGravityValue.setValue(this._valueOrNaN(aEvent.accelerationIncludingGravity.y));
		this._zWithGravityValue.setValue(this._valueOrNaN(aEvent.accelerationIncludingGravity.z));
		
		this._alphaValue.setValue(this._degreeOrNaN(aEvent.rotationRate.alpha));
		this._betaValue.setValue(this._degreeOrNaN(aEvent.rotationRate.beta));
		this._gammaValue.setValue(this._degreeOrNaN(aEvent.rotationRate.gamma));
		
		this._interval.setValue(this._valueOrNaN(aEvent.interval));
	};
	
	objectFunctions._valueOrNaN = function(aValue) {
		return (VariableAliases.isSet(aValue) ? aValue : NaN);
	};
	
	objectFunctions._degreeOrNaN = function(aValue) {
		return (VariableAliases.isSet(aValue) ? AngleFunctions.degreesToRadians(aValue) : NaN);
	};
	
	objectFunctions.startUpdating = function() {
		console.log("dbm.utils.device.DeviceMotion::startUpdating");
		
		this.getExtendedEvent().activateJavascriptEventLink(DeviceExtendedEventIds.MOTION_UPDATED);
		
		return this;
	};
	
	objectFunctions.stopUpdaing = function() {
		
		this.getExtendedEvent().deactivateJavascriptEventLink(DeviceExtendedEventIds.MOTION_UPDATED);
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case DeviceExtendedEventIds.MOTION_UPDATED:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._eventDispather = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aEventDispatcher) {
		
		aEventDispatcher = VariableAliases.valueWithDefault(aEventDispatcher, dbm.getWindow());
		
		var newDeviceMotion = (new ClassReference()).init();
		newDeviceMotion.setEventDispatcher(aEventDispatcher);
		return newDeviceMotion;
	};
});