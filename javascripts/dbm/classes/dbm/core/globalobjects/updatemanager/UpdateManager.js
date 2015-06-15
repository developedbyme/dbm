/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.updatemanager.UpdateManager", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.updatemanager.UpdateManager");
	//"use strict";
	
	//Self reference
	var UpdateManager = dbm.importClass("dbm.core.globalobjects.updatemanager.UpdateManager");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var UpdateChain = dbm.importClass("dbm.core.globalobjects.updatemanager.objects.UpdateChain");
	var CallFunctionUpdater = dbm.importClass("dbm.core.globalobjects.updatemanager.objects.CallFunctionUpdater");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var UpdaterTypes = dbm.importClass("dbm.constants.generic.UpdaterTypes");
	
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.updatemanager.UpdateManager::_init");
		
		this.superCall();
		
		this._updateTimer = null;
		
		this._startTime = 0;

		this.currentTime = 0;
		this.currentFrame = 0;
		this._isUpdating = false;
		
		this._updateChains = (new NamedArray()).init();
		this._updateChain = (new UpdateChain()).init();
		
		this._addUpdaterType(UpdaterTypes.UPDATE_INPUT);
		this._addUpdaterType(UpdaterTypes.UPDATE_TIMELINES);
		this._addUpdaterType(UpdaterTypes.DEFAULT);
		this._addUpdaterType(UpdaterTypes.UPDATE_FLOW);
		
		return this;
	};
	
	objectFunctions.start = function() {
		
		if(this._updateTimer.getStatus()) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "start", "Update manager is already started.");
			return;
		}
		
		this._startTime = Date.now();
		
		this.currentTime = 0;
		this.currentFrame = 0;
		
		this._updateTimer.start();
	};
	
	objectFunctions.stop = function() {
		if(this._updateTimer.getStatus()) {
			this._updateTimer.stop();
		}
	};
	
	objectFunctions._addUpdaterType = function(aType) {
		var newUpdater = (new UpdateChain()).init();
		this._updateChain.push(newUpdater);
		this._updateChains.addObject(aType, newUpdater);
		return newUpdater;
	};
	
	objectFunctions.setTimer = function(aTimer) {
		this._updateTimer = aTimer;
		this._updateTimer.setUpdateObject(this);
		
		return this;
	};
	
	objectFunctions.update = function() {
		//console.log("dbm.core.globalobjects.updatemanager.UpdateManager::update");
		
		this._isUpdating = true;
		var currentTime = Date.now();
		this.currentTime = 0.001*(currentTime-this._startTime);
		this.currentFrame++;
		
		this._updateChain.updateTime(this.currentTime, this.currentFrame);
		
		this._isUpdating = false;
	};
	
	objectFunctions.addUpdater = function(aUpdater, aType) {
		
		aType = VariableAliases.valueWithDefault(aType, UpdaterTypes.DEFAULT);
		
		this._updateChains.getObject(aType).push(aUpdater);
	};
	
	objectFunctions.removeUpdater = function(aUpdater, aType) {
		
		aType = VariableAliases.valueWithDefault(aType, UpdaterTypes.DEFAULT);
		
		this._updateChains.getObject(aType).removeItem(aUpdater);
	};
	
	objectFunctions.addUpdatedFunction = function(aObject, aFunction, aType) {
		
		aType = VariableAliases.valueWithDefault(aType, UpdaterTypes.DEFAULT);
		
		this._updateChains.getObject(aType).push(CallFunctionUpdater.create(aObject, aFunction));
	};
	
	objectFunctions.removeUpdatedFunction = function(aObject, aFunction, aType) {
		
		aType = VariableAliases.valueWithDefault(aType, UpdaterTypes.DEFAULT);
		
		var currentChain = this._updateChains.getObject(aType);
		var currentArray = currentChain.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentUpdater = currentArray[i];
			if(currentUpdater instanceof CallFunctionUpdater && currentUpdater.isUpdaterFor(aObject, aFunction)) {
				currentChain.removeItem(currentUpdater);
				currentUpdater.destroy();
				break;
			}
		}
	};
});