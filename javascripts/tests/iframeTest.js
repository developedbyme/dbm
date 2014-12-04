dbm.runTempFunction(function() {
	//"use strict";
	
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var testIframe = DisplayBaseObject.createNode("iframe", dbm.getDocument(), true);
		
		console.log(testIframe);
	});
});