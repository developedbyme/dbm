/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A property that sends out an extended when changed.
 */
dbm.registerClass("dbm.core.objectparts.ExtendedEventProperty", "dbm.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.objectparts.ExtendedEventProperty");
	//"use strict";
	
	//Self reference
	var ExtendedEventProperty = dbm.importClass("dbm.core.objectparts.ExtendedEventProperty");
	
	//Error report
	
	//Dependencies
	var ExtendedEventController = dbm.importClass("dbm.core.extendedevent.ExtendedEventController");
	var Property = dbm.importClass("dbm.core.objectparts.Property");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.objectparts.ExtendedEventProperty::_init");
		
		this.superCall();
		
		this._extendedEvent = ExtendedEventController.create(this);
		this._ownsExtendedEvent = true;
		this.addDestroyableObject(this._extendedEvent);
		
		return this;
	};
	
	/**
	 * Changes the event controller so that events can be dispatched on another object.
	 *
	 * @param	aExtendedEventController	ExtendedEventController		The controller to dispatch events from.
	 *
	 * @return	self
	 */
	objectFunctions.changeToExternalEventController = function(aExtendedEventController) {
		//console.log("dbm.core.objectparts.ExtendedEventProperty::changeToExternalEventController");
		
		if(this._ownsExtendedEvent) {
			this._extendedEvent.destroy();
			this.removeDestroyableObject(this._extendedEvent);
		}
		
		this._extendedEvent = aExtendedEventController;
		this._ownsExtendedEvent = false;
		
		return this;
	};
	
	/**
	 * Performs the event if the name exists.
	 *
	 * @param	aValue	String	The anme of the event to perform. Null if no event should be dispatched.
	 */
	objectFunctions._performValueChangeExtendedEvent = function(aValue) {
		//console.log("dbm.core.objectparts.ExtendedEventProperty::_performValueChangeExtendedEvent");
		if(aValue !== null) {
			if(this._extendedEvent.hasEvent(aValue)) {
				this._extendedEvent.perform(aValue, null);
			}
		}
	};
	
	/**
	 * Sets the value of this property (which dispatches the event).
	 *
	 * @param	aValue	*	The value of this property.
	 */
	objectFunctions._performSetValue = function(aValue) {
		//console.log("dbm.core.objectparts.ExtendedEventProperty::_performSetValue");
		//console.log(aValue, this._extendedEvent.hasEvent(aValue));
		this.superCall(aValue);
		this._performValueChangeExtendedEvent(aValue);
	};
	
	/**
	 * Gets the extended event controller.
	 *
	 * @return	ExtendedEventController		The extended event controller.
	 */
	objectFunctions.getExtendedEvent = function() {
		return this._extendedEvent;
	};
	
	/**
	 * Checks if an event is expected for this object, so that warnings doesn't shown when new events are created.
	 *
	 * @param	aName	String	The name of the event.
	 *
	 * @return	Boolean		True if the event is expected. All events are extected for this property.
	 */
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		return true;
	};
	
	/**
	 * Checks if a variable is owned by this object. Part of the destroy function.
	 *
	 * @param	aName	The name of the variable.
	 *
	 * @return	Boolean	True if this object is the owner of a variable.
	 */
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_extendedEvent":
				return this._ownsExtendedEvent;
		}
		return this.superCall();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._extendedEvent = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aValue	*	The value for the new property. (Optional)
	 *
	 * @return	ExtendedEventProperty	The newly created object.
	 */
	staticFunctions.create = function(aValue) {
		return ClassReference._createWithInputValue(ExtendedEventProperty, aValue);
	};
	
});