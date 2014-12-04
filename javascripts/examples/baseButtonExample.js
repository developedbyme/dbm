dbm.runTempFunction(function() {
	//"use strict";
	
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var theButton = BaseButton.create(document.getElementById("testButton"));
		console.log(theButton);
		
		var callbackFunction = function() {
			console.log("callbackFunction");
			console.log(this);
		};
		
		var theCommand = CallFunctionCommand.createCommand(theButton, callbackFunction, []);
		theButton.getExtendedEvent().addCommandToEvent("click", theCommand);
		theButton.getExtendedEvent().addCommandToEvent("click", CallFunctionCommand.createCommand(theButton, theButton.deactivate, []));
		
		theButton.activate();
	});
});