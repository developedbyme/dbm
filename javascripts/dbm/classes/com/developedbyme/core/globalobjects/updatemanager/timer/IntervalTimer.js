/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.updatemanager.timer.IntervalTimer", "com.developedbyme.core.globalobjects.updatemanager.timer.TimerBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.IntervalTimer");
	
	var IntervalTimer = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.timer.IntervalTimer");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.IntervalTimer::_init");
		
		this.superCall();
		
		this._intervalId = -1;
		this._intervalLength = 40;
		
		return this;
	};
	
	objectFunctions.setIntervalLength = function(aLength) {
		
		this._intervalLength = aLength;
		
		if(this._isStarted) {
			this.stop().start();
		}
		
		return this;
	};
	
	objectFunctions._performStart = function() {
		this._intervalId = setInterval(this._callbackFunction, this._intervalLength);
	};
	
	objectFunctions._performStop = function() {
		clearInterval(this._intervalId);
		this._intervalId = -1;
	};
	
	staticFunctions.create = function(aUpdateObject, aFps) {
		var newIntervalTimer = (new ClassReference()).init();
		newIntervalTimer.setUpdateObject(aUpdateObject);
		newIntervalTimer.setIntervalLength(Math.round(1000/aFps));
		return newIntervalTimer;
	};
});