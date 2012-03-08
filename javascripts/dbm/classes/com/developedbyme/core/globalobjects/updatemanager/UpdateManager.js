dbm.registerClass("com.developedbyme.core.globalobjects.updatemanager.UpdateManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.updatemanager.UpdateManager");
	//"use strict";
	
	var UpdateManager = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.UpdateManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var UpdateChain = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain");
	var CallFunctionUpdater = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.objects.CallFunctionUpdater");
	
	dbm.setClassAsSingleton("dbmUpdateManager");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.UpdateManager::_init");
		
		this.superCall();
		
		this._intervalNumber = -1;
		this._updateLength = 40;
		
		this._startTime = 0;

		this.currentTime = 0;
		this.currentFrame = 0;
		this._isUpdating = false;
		
		this._updateChains = (new NamedArray()).init();
		this._updateChain = (new UpdateChain()).init();
		
		this._addUpdaterType("updateInput");
		this._addUpdaterType("updateTimelines");
		this._addUpdaterType("default");
		this._addUpdaterType("updateFlow");
		
		var thisPointer = this;
		this._updateCallback = function _updateCallback() {
			thisPointer.update();
		};
		
		return this;
	};
	
	objectFunctions.start = function() {
		
		if(this._intervalNumber != -1) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "start", "Update manager is already started.");
			return;
		}
		
		var startDate = new Date();
		this._startTime = startDate.getTime();
		
		this.currentTime = 0;
		this.currentFrame = 0;
		
		this._intervalNumber = setInterval(this._updateCallback, this._updateLength);
	}
	
	objectFunctions.stop = function() {
		if(this._intervalNumber != -1) {
			clearInterval(this._intervalNumber);
			this._intervalNumber = -1;
		}
	}
	
	objectFunctions._addUpdaterType = function(aType) {
		var newUpdater = (new UpdateChain()).init();
		this._updateChain.push(newUpdater);
		this._updateChains.addObject(aType, newUpdater);
		return newUpdater;
	};
	
	objectFunctions.update = function() {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.UpdateManager::update");
		
		this._isUpdating = true;
		var newDate = new Date();
		this.currentTime = 0.001*(newDate.getTime()-this._startTime);
		this.currentFrame++;
		
		this._updateChain.updateTime(this.currentTime, this.currentFrame);
		
		this._isUpdating = false;
	};
	
	objectFunctions.addUpdater = function(aUpdater, aType) {
		this._updateChains.getObject(aType).push(aUpdater);
	};
	
	objectFunctions.removeUpdater = function(aUpdater, aType) {
		this._updateChains.getObject(aType).removeItem(aUpdater);
	};
	
	objectFunctions.addUpdatedFunction = function(aObject, aFunction, aType) {
		this._updateChains.getObject(aType).push(CallFunctionUpdater.create(aObject, aFunction));
	};
	
	objectFunctions.removeUpdatedFunction = function(aObject, aFunction, aType) {
		var currentChain = this._updateChains.getObject(aType)
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