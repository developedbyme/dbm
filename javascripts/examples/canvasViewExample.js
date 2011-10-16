dbm.runTempFunction(function() {
	
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var canvasView = CanvasView.create(document, true, "2d");
		
		var testLayer = canvasView.getController().getLayer("/test/left/ball");
		//var testLayer = canvasView.getController().getRootLayer();
		testLayer.getProperty("x").setValue(50);
		testLayer.getProperty("y").setValue(20);
		testLayer.getProperty("rotate").setValue(0.1*Math.PI);
		testLayer.setStrokeStyle(0, "#FF0000");
		testLayer.lineTo(20, 20);
		testLayer.bezierCurveTo(30, 0, 50, 30, 60, 50);
		
		canvasView.getController().getProperty("display").update();
	});
});