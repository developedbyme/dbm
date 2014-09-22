/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.updatemanager.timer.TimerBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.TimerBaseObject");
	
	//Self reference
	var TimerBaseObject = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.timer.TimerBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var FunctionFunctions = dbm.importClass("com.developedbyme.utils.native.function.FunctionFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.TimerBaseObject::_init");
		
		this.superCall();
		
		this._isStarted = false;
		this._updateObject = null;
		this._callbackFunction = FunctionFunctions.createScopedFunction(this, this.update);
		
		return this;
	};
	
	objectFunctions.setUpdateObject = function(aObject) {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.TimerBaseObject::setUpdateObject");
		
		this._updateObject = aObject;
		
		return this;
	};
	
	objectFunctions.getStatus = function() {
		return this._isStarted;
	};
	
	objectFunctions.start = function() {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.TimerBaseObject::start");
		if(!this._isStarted) {
			this._isStarted = true;
			this._performStart();
		}
		else {
			//METODO: warning
		}
		
		return this;
	};
	
	objectFunctions.stop = function() {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.TimerBaseObject::stop");
		if(this._isStarted) {
			this._isStarted = false;
			this._performStop();
		}
		else {
			//METODO: warning
		}
		
		return this;
	};
	
	objectFunctions._performStart = function() {
		//METODO: should be overridded
	};
	
	objectFunctions._performStop = function() {
		//METODO: should be overridded
	};
	
	objectFunctions._preUpdate = function() {
		//METODO: should be overridded
	};
	
	objectFunctions.update = function() {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.TimerBaseObject::update");
		
		this._preUpdate();
		this._updateObject.update();
	};
	
	objectFunctions.performDestroy = function() {
		
		if(this._isStarted) {
			this.stop();
		}
		ClassReference.destroyIfExists(this._callbackFunction);
		
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		if(aName === "_updateObject") {
			return false;
		}
		return this.superCall(aName);
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._updateObject = null;
		this._callbackFunction = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new objetc of this class.
	 *
	 * @param	aUpdateObject	The object to do callbacks on every tick.
	 *
	 * @return	The newly created object.
	 */
	staticFunctions.create = function(aUpdateObject) {
		var newTimerBaseObject = (new ClassReference()).init();
		newTimerBaseObject.setUpdateObject(aUpdateObject);
		return newTimerBaseObject;
	};
});