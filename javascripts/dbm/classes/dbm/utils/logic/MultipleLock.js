/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A lock that can be locked multiple times.
 */
dbm.registerClass("dbm.utils.logic.MultipleLock", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.logic.MultipleLock");
	
	//Self reference
	var MultipleLock = dbm.importClass("dbm.utils.logic.MultipleLock");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var ArrayHolder = dbm.importClass("dbm.utils.data.ArrayHolder");
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	var LockExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LockExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.logic.MultipleLock::_init");
		
		this.superCall();
		
		this._isLocked = false;
		this._locks = this.addDestroyableObject(ArrayHolder.create(false));
		
		return this;
	}; //End function _init
	
	/**
	 * Checks if this lock is locked.
	 *
	 * @return	Boolean	True if this lock is locked.
	 */
	objectFunctions.isLocked = function() {
		//console.log("dbm.utils.logic.MultipleLock::isLocked");
		return this._isLocked;
	}; //End function isLocked
	
	/**
	 * Locks this lock.
	 *
	 * @param	aIdentifier	Any	The identifier for this instance of the lock.
	 *
	 * @return	self
	 */
	objectFunctions.lock = function(aIdentifier) {
		//console.log("dbm.utils.logic.MultipleLock::lock");
		
		var theArray = this._locks.array;
		theArray.push(aIdentifier);
		if(theArray.length === 1) {
			this._isLocked = true;
			if(this.getExtendedEvent().hasEvent(LockExtendedEventIds.LOCKED)) {
				this.getExtendedEvent().perform(LockExtendedEventIds.LOCKED, null);
			}
		}
		
		return this;
	}; //End function lock
	
	/**
	 * Unlocks this lock.
	 *
	 * @param	aIdentifier	Any	The identifier for this instance of the lock.
	 *
	 * @return	self
	 */
	objectFunctions.unlock = function(aIdentifier) {
		//console.log("dbm.utils.logic.MultipleLock::unlock");
		
		var theArray = this._locks.array;
		
		var index = ArrayFunctions.indexOfInArray(theArray, aIdentifier);
		if(index !== -1) {
			theArray.splice(index, 1);
			if(theArray.length === 0) {
				this._isLocked = false;
				if(this.getExtendedEvent().hasEvent(LockExtendedEventIds.UNLOCKED)) {
					this.getExtendedEvent().perform(LockExtendedEventIds.UNLOCKED, null);
				}
			}
		}
		else {
			//METODO: error message
		}
		
		return this;
	}; //End function unlock
	
	/**
	 * Checks if an extended event is expected for this object.
	 *
	 * @param	aName	String	The name of the event.
	 *
	 * @return	Boolean	True if the event is expected.
	 */
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case LockExtendedEventIds.LOCKED:
			case LockExtendedEventIds.UNLOCKED:
				return true;
		}
		
		return this.superCall(aName);
	}; //End function _extendedEvent_eventIsExpected
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._locks = null;
		
		this.superCall();
	}; //End function setAllReferencesToNull
	
	/**
	 * Creates a new objetc of this class.
	 *
	 * @return	The newly created object.
	 */
	staticFunctions.create = function() {
		var newMultipleLock = ClassReference._createAndInitClass(ClassReference);
		return newMultipleLock;
	}; //End function create
});