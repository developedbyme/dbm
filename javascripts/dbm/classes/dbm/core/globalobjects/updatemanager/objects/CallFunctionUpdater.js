/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.updatemanager.objects.CallFunctionUpdater", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.updatemanager.objects.CallFunctionUpdater");
	
	var CallFunctionUpdater = dbm.importClass("dbm.core.globalobjects.updatemanager.objects.CallFunctionUpdater");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.updatemanager.objects.CallFunctionUpdater::_init");
		
		this.superCall();
		
		this._updateObject = null;
		this._updateFunction = null;
		
		return this;
	};
	
	objectFunctions.setup = function(aObject, aFunction) {
		//console.log("dbm.core.globalobjects.updatemanager.objects.CallFunctionUpdater::setup");
		
		this._updateObject = aObject;
		this._updateFunction = aFunction;
		
		return this;
	};
	
	objectFunctions.isUpdaterFor = function(aObject, aFunction) {
		//console.log("dbm.core.globalobjects.updatemanager.objects.CallFunctionUpdater::isUpdaterFor");
		
		return (this._updateObject === aObject && this._updateFunction === aFunction);
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("dbm.core.globalobjects.updatemanager.objects.CallFunctionUpdater::updateTime");
		
		this._updateFunction.call(this._updateObject, aTime, aFrame);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._updateObject = null;
		this._updateFunction = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObject, aFunction) {
		var newCallFunctionUpdater = (new CallFunctionUpdater()).init();
		newCallFunctionUpdater.setup(aObject, aFunction);
		return newCallFunctionUpdater;
	};
});