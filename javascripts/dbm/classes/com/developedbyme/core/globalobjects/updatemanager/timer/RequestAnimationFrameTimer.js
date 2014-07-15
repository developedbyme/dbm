/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.updatemanager.timer.RequestAnimationFrameTimer", "com.developedbyme.core.globalobjects.updatemanager.timer.TimerBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.RequestAnimationFrameTimer");
	
	//Self reference
	var RequestAnimationFrameTimer = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.timer.RequestAnimationFrameTimer");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.RequestAnimationFrameTimer::_init");
		
		this.superCall();
		
		this._updateRequestObject = null;
		this._updateRequestFunction = null;
		
		return this;
	};
	
	objectFunctions.setUpdateRequestFunction = function(aObject, aFunction) {
		
		this._updateRequestObject = aObject;
		this._updateRequestFunction = aFunction;
		
		return this;
	};
	
	objectFunctions._requestNextFrame = function() {
		this._updateRequestFunction.call(this._updateRequestObject, this._callbackFunction);
	};
	
	objectFunctions._performStart = function() {
		this._requestNextFrame();
	};
	
	objectFunctions._performStop = function() {
		//METODO
	};
	
	objectFunctions._preUpdate = function() {
		this._requestNextFrame();
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._updateRequestObject = null;
		this._updateRequestFunction = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new objetc of this class.
	 *
	 * @param	aUpdateObject			The object to do callbacks on every tick.
	 * @param	aUpdateRequestObject	The object that has the request animation function.
	 * @param	aUpdatedRequestFunction	The request animation function.
	 *
	 * @return	The newly created object.
	 */
	staticFunctions.create = function(aUpdateObject, aUpdateRequestObject, aUpdatedRequestFunction) {
		var newRequestAnimationFrameTimer = (new ClassReference()).init();
		newRequestAnimationFrameTimer.setUpdateObject(aUpdateObject);
		newRequestAnimationFrameTimer.setUpdateRequestFunction(aUpdateRequestObject, aUpdatedRequestFunction);
		return newRequestAnimationFrameTimer;
	};
});