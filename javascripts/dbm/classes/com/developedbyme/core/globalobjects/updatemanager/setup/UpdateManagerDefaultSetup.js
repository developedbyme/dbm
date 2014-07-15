/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Default setup for the global update manager.
 */
dbm.registerClass("com.developedbyme.core.globalobjects.updatemanager.setup.UpdateManagerDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.updatemanager.setup.UpdateManagerDefaultSetup");
	//"use strict";
	
	//Self reference
	var UpdateManagerDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.setup.UpdateManagerDefaultSetup");
	
	//Error report
	
	//Dependencies
	var UpdateManager = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.UpdateManager");
	var IntervalTimer = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.timer.IntervalTimer");
	var RequestAnimationFrameTimer = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.timer.RequestAnimationFrameTimer");
	
	//Utils
	
	//Constants
	
	/**
	 * Sets up the default timers.
	 */
	staticFunctions.setup = function() {
		var mainTimer;
		
		if(window.requestAnimationFrame) {
			mainTimer = RequestAnimationFrameTimer.create(null, window, window.requestAnimationFrame);
		}
		else if(window.mozRequestAnimationFrame) {
			mainTimer = RequestAnimationFrameTimer.create(null, window, window.mozRequestAnimationFrame);
		}
		else if(window.webkitRequestAnimationFrame) {
			mainTimer = RequestAnimationFrameTimer.create(null, window, window.webkitRequestAnimationFrame);
		}
		else {
			mainTimer = IntervalTimer.create(null, 60);
		}
		
		UpdateManager.getInstance().setTimer(mainTimer);
	};
});