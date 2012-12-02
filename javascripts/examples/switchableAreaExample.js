dbm.runTempFunction(function() {
	//"use strict";
	
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	var InDomSwitchableArea = dbm.importClass("com.developedbyme.gui.abstract.switchablearea.InDomSwitchableArea");
	
	var SetPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var switchableArea = InDomSwitchableArea.create();
		
		var button1 = BaseButton.createButton(document.body, true, null, "Area 1");
		button1.getExtendedEvent().addCommandToEvent("click", SetPropertyCommand.createCommand(switchableArea.getProperty("currentArea"), "area1"));
		button1.activate();
		
		switchableArea.getProperty("display").update();
	});
});