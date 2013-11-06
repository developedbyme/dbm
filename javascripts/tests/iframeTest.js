dbm.runTempFunction(function() {
	//"use strict";
	
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var testIframe = DisplayBaseObject.createNode("iframe", dbm.getDocument(), true);
		
		console.log(testIframe);
	});
});