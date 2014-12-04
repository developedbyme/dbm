dbm.runTempFunction(function() {
	//"use strict";
	
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	var InDomSwitchableArea = dbm.importClass("dbm.gui.abstract.switchablearea.InDomSwitchableArea");
	
	var SetPropertyCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.SetPropertyCommand");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var htmlCreator = dbm.singletons["dbmHtmlDomManager"].getHtmlCreator(document);
		
		var switchableArea = InDomSwitchableArea.create();
		
		var button1 = BaseButton.createButton(document.body, true, null, "Area 1");
		button1.getExtendedEvent().addCommandToEvent("click", SetPropertyCommand.createCommand(switchableArea.getProperty("visibleArea"), "area1"));
		//button1.getExtendedEvent().addCommandToEvent("click", CallFunctionCommand.createCommand(console, console.log, ["area1"]));
		//button1.getExtendedEvent().addCommandToEvent("click", CallFunctionCommand.createCommand(switchableArea.getProperty("display"), switchableArea.getProperty("display").update, []));
		button1.activate();
		
		var button2 = BaseButton.createButton(document.body, true, null, "Area 2");
		button2.getExtendedEvent().addCommandToEvent("click", SetPropertyCommand.createCommand(switchableArea.getProperty("visibleArea"), "area2"));
		button2.activate();
		
		var holderElement = htmlCreator.createDiv({name: "holder"});
		document.body.appendChild(holderElement);
		
		var area1 = htmlCreator.createDiv(null, htmlCreator.createText("Area 1"))
		switchableArea.addHtmlArea("area1", area1);
		dbm.singletons.dbmHtmlDomManager.getControllerForHtmlElement(area1).setParent(holderElement);
		
		var area2 = htmlCreator.createDiv(null, htmlCreator.createText("Second area"))
		switchableArea.addHtmlArea("area2", area2);
		dbm.singletons.dbmHtmlDomManager.getControllerForHtmlElement(area2).setParent(holderElement);
		
		switchableArea.getProperty("display").startUpdating();
		
		console.log(switchableArea);
	});
});