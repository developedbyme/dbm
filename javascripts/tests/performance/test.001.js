/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tests to see how the timer effects perfomance.
 */
dbm.runTempFunction(function() {
	
	dbm.addSpecificClassesFolder("com.developedbyme", "dbm/classes");
	
	var RequestAnimationFrameTimer = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.timer.RequestAnimationFrameTimer");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var dummyObject = new Object();
		dummyObject.update = function() {
			//console.log("update");
		}
		
		var requestObject = RequestAnimationFrameTimer.create(dummyObject, window, window.webkitRequestAnimationFrame);
		requestObject.start();
	});
});