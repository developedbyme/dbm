dbm.runTempFunction(function() {
	
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var PlaceElementNode = dbm.importClass("dbm.flow.nodes.display.PlaceElementNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
		
		var placeElementNode = (new PlaceElementNode()).init();
		placeElementNode.getProperty("element").setValue(document.getElementById("placement"));
		
		dbm.singletons.dbmFlowManager.connectProperties(windowSizeNode.getProperty("width"), placeElementNode.getProperty("width"));
		dbm.singletons.dbmFlowManager.connectProperties(windowSizeNode.getProperty("height"), placeElementNode.getProperty("height"));
				
		dbm.singletons.dbmFlowManager.addUpdatedProperty(placeElementNode.getProperty("display"));
	});
});