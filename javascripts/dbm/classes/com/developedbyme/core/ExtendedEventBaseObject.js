/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for objects that emits extended events.
 */
dbm.registerClass("com.developedbyme.core.ExtendedEventBaseObject", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.ExtendedEventBaseObject");
	//"use strict";
	
	//Self reference
	var ExtendedEventBaseObject = dbm.importClass("com.developedbyme.core.ExtendedEventBaseObject");
	
	//Error report
	
	//Dependencies
	var ExtendedEventController = dbm.importClass("com.developedbyme.core.extendedevent.ExtendedEventController");
	var DelayedExtendedEventController = dbm.importClass("com.developedbyme.core.extendedevent.DelayedExtendedEventController");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.ExtendedEventBaseObject::_init");
		
		this.superCall();
		
		this._extendedEvent = null;
		this._delayedExtendedEvent = null;
		
		return this;
	}; //End function _init
	
	/**
	 * Gets the extended event controller. If it doesn't exist already it's created.
	 *
	 * @return	ExtendedEventController		The extended event controller.
	 */
	objectFunctions.getExtendedEvent = function() {
		if(this._extendedEvent === null) {
			this._extendedEvent = ExtendedEventController.create(this);
			this.addDestroyableObject(this._extendedEvent);
		}
		
		return this._extendedEvent;
	}; //End function getExtendedEvent
	
	/**
	 * Gets the controller for delayed events. If it doesn't exist already it's created.
	 *
	 * @return	DelayedExtendedEventController	The delayed exended event controller.
	 */
	objectFunctions.getDelayedExtendedEvent = function() {
		if(this._delayedExtendedEvent === null) {
			this._delayedExtendedEvent = DelayedExtendedEventController.create(this);
			this.addDestroyableObject(this._delayedExtendedEvent);
		}
		
		return this._delayedExtendedEvent;
	}; //End function getDelayedExtendedEvent
	
	/**
	 * If a node is changing document, all listeners needs to be reactivated.
	 */
	objectFunctions.reactivateForNewDocument = function() {
		if(this._extendedEvent !== null) {
			this._extendedEvent.reactivateEventListeners();
		}
	}; //End function reactivateForNewDocument
	
	/**
	 * Checks if an event is expected for this object, so that warnings doesn't shown when new events are created.
	 *
	 * @param	aName	String	The name of the event.
	 *
	 * @return	Boolean		True if the event is expected.
	 */
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		//MENOTE: should be overridden
		
		return false;
	}; //End function _extendedEvent_eventIsExpected
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._extendedEvent = null;
		this._delayedExtendedEvent = null;
		
		this.superCall();
	}; //End function setAllReferencesToNull
});