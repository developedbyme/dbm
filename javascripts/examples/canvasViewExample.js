dbm.runTempFunction(function() {
	
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var canvasView = CanvasView.create(document, true, "2d");
		
		canvasView.getController()._numberOfLinksToResolve = 6;
		
		var centerLayer = canvasView.getController().getLayer("/center");
		centerLayer.getProperty("x").setValue(100);
		centerLayer.getProperty("y").setValue(50);
		
		var moveLayer = canvasView.getController().getLayer("/center/move");
		moveLayer.getProperty("rotate").setValue(2*Math.PI/(canvasView.getController()._numberOfLinksToResolve+1));
		
		var graphicsLayer = canvasView.getController().getLayer("/center/move/graphics");
		graphicsLayer.setStrokeStyle(0, "#FF0000");
		graphicsLayer.lineTo(20, 20);
		graphicsLayer.bezierCurveTo(30, 0, 50, 30, 60, 50);
		
		var graphicsLayer = canvasView.getController().createLink("/center/move/copy", "/center/move");
		
		canvasView.getController().debugTraceStructure();
		canvasView.getController().getProperty("display").update();
		
	});
});