dbm.runTempFunction(function() {
	
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var openButton = BaseButton.create(document.getElementById("openButton"));
		
		var openCallbackFunction = function() {
			console.log("openCallbackFunction");
			
			dbm.singletons.dbmWindowManager.createWindow("test").open();
			var secondWindow = dbm.singletons.dbmWindowManager.createWindow("test2").open().setPosition(100, 200).setSize(300, 400);
			
			dbm.singletons.dbmWindowManager.createWindow("test3").setPosition(600, 200).setSize(300, 400).open();
		};
		
		var openCommand = CallFunctionCommand.createCommand(null, openCallbackFunction, []);
		openButton.getExtendedEvent().addCommandToEvent("click", openCommand);
		openButton.activate();
		
		var focusButton = BaseButton.create(document.getElementById("focusButton"));
		
		var focusCallbackFunction = function() {
			console.log("focusCallbackFunction");
			
			dbm.singletons.dbmWindowManager.getWindow("test").focus();
			dbm.singletons.dbmWindowManager.getWindow("test2").focus();
			dbm.singletons.dbmWindowManager.getWindow("test3").focus();
		};
		
		var focusCommand = CallFunctionCommand.createCommand(null, focusCallbackFunction, []);
		focusButton.getExtendedEvent().addCommandToEvent("click", focusCommand);
		focusButton.activate();
		
		
	});
});