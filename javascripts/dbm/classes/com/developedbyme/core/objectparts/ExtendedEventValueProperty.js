/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A property that sends out to value to an extended when changed.
 */
dbm.registerClass("com.developedbyme.core.objectparts.ExtendedEventValueProperty", "com.developedbyme.core.objectparts.ExtendedEventProperty", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExtendedEventValueProperty");
	//"use strict";
	
	//Self reference
	var ExtendedEventValueProperty = dbm.importClass("com.developedbyme.core.objectparts.ExtendedEventValueProperty");
	
	//Error report
	
	//Dependencies
	var ExtendedEventController = dbm.importClass("com.developedbyme.core.extendedevent.ExtendedEventController");
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.ExtendedEventValueProperty::_init");
		
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
	
	objectFunctions._performValueChangeExtendedEvent = function(aValue) {
		//console.log("com.developedbyme.core.objectparts.ExtendedEventValueProperty::_performValueChangeExtendedEvent");
		if(this._extendedEvent.hasEvent(this._extendedEventName)) {
			this._extendedEvent.perform(this._extendedEventName, aValue);
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		return (aName === this._extendedEventName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._extendedEventName = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObjectInput, aValue, aExtendedEventName) {
		
		aExtendedEventName = VariableAliases.valueWithDefault(aExtendedEventName, GenericExtendedEventIds.UPDATE);
		
		var newExtendedEventValueProperty = ClassReference._createWithInputValue(ClassReference, aObjectInput, aValue);
		newExtendedEventValueProperty.setExtendedEventName(aExtendedEventName);
		return newExtendedEventValueProperty;
	};
});