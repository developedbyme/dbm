dbm.runTempFunction(function() {
	//"use strict";
	
	var OneTouchOrMouseDetector = dbm.importClass("dbm.gui.abstract.touch.OneTouchOrMouseDetector");
	
	var SetPropertyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.SetPropertyCommand");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var touchDetector = OneTouchOrMouseDetector.create(document.body);
		touchDetector.activate();
		
		console.log(touchDetector);
	});
});