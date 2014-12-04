/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A property that sends out to value to an extended when changed.
 */
dbm.registerClass("dbm.core.objectparts.ExtendedEventValueProperty", "dbm.core.objectparts.ExtendedEventProperty", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.objectparts.ExtendedEventValueProperty");
	//"use strict";
	
	//Self reference
	var ExtendedEventValueProperty = dbm.importClass("dbm.core.objectparts.ExtendedEventValueProperty");
	
	//Error report
	
	//Dependencies
	var ExtendedEventController = dbm.importClass("dbm.core.extendedevent.ExtendedEventController");
	var Property = dbm.importClass("dbm.core.objectparts.Property");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.objectparts.ExtendedEventValueProperty::_init");
		
		this.superCall();
		
		this._extendedEventName = GenericExtendedEventIds.UPDATE;
		
		return this;
	};
	
	/**
	 * Sets the name of the extended event to send out.
	 *
	 * @param	aName	The name of the extended event.
	 *
	 * @return	self
	 */
	objectFunctions.setExtendedEventName = function(aName) {
		this._extendedEventName = aName;
		
		return this;
	};
	
	/**
	 * Performs the event if the name exists.
	 *
	 * @param	aValue	*	The data to send out with the event.
	 */
	objectFunctions._performValueChangeExtendedEvent = function(aValue) {
		//console.log("dbm.core.objectparts.ExtendedEventValueProperty::_performValueChangeExtendedEvent");
		if(this._extendedEvent.hasEvent(this._extendedEventName)) {
			this._extendedEvent.perform(this._extendedEventName, aValue);
		}
	};
	
	/**
	 * Checks if an event is expected for this object, so that warnings doesn't shown when new events are created.
	 *
	 * @param	aName	String	The name of the event.
	 *
	 * @return	Boolean		True if the event is expected.
	 */
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		return (aName === this._extendedEventName);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._extendedEventName = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aValue				*		The value for the new property.
	 * @param	aExtendedEventName	String	The name of the event to dispatch.
	 *
	 * @return	ExtendedEventValueProperty	The newly created object.
	 */
	staticFunctions.create = function(aValue, aExtendedEventName) {
		
		aExtendedEventName = VariableAliases.valueWithDefault(aExtendedEventName, GenericExtendedEventIds.UPDATE);
		
		var newExtendedEventValueProperty = ClassReference._createWithInputValue(ClassReference, aValue);
		newExtendedEventValueProperty.setExtendedEventName(aExtendedEventName);
		return newExtendedEventValueProperty;
	};
});