dbm.runTempFunction(function() {
	
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	
	var PlaneCreator = dbm.importClass("dbm.utils.geometry.creators.PlaneCreator");
	var Mesh = dbm.importClass("dbm.core.data.geometry.mesh.Mesh");
	var Point = dbm.importClass("dbm.core.data.points.Point");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var canvasView = CanvasView.create(document, true, "3d", {"width": 500, "height": 500, "style": "width: 500px; height: 500px;"});
		
		canvasView.getController()._numberOfLinksToResolve = 400;
		
		/*
		var centerLayer = canvasView.getController().getLayer("/center");
		centerLayer.getProperty("x").setValue(100);
		centerLayer.getProperty("y").setValue(70);
		
		var moveLayer = canvasView.getController().getLayer("/center/move");
		moveLayer.getProperty("rotate").setValue(2*Math.PI/(canvasView.getController()._numberOfLinksToResolve+1));
		moveLayer.getProperty("rotate").animateValue(2*Math.PI-0.005, 60, "linear");
		moveLayer.getProperty("alpha").setValue(0.98);
		
		var graphicsLayer = canvasView.getController().getLayer("/center/move/graphics");
		graphicsLayer.setStrokeStyle(0, "#FF0000");
		graphicsLayer.lineTo(20, 20);
		graphicsLayer.bezierCurveTo(30, 0, 50, 30, 60, 50);
		
		var graphicsLayer = canvasView.getController().createLink("/center/move/copy", "/center/move");
		*/
		
		canvasView.getController().debugTraceStructure();
		canvasView.getController().getProperty("display").update();
		//canvasView.getController().getProperty("display").startUpdating();
		//console.log(canvasView);
		
		var squareMesh = PlaneCreator.createPlane(Mesh.create(), Point.create(0, 0, 0.5), Point.create(1, 0, 0), Point.create(0, 1, 0), 5, 5, Point.create(0, 0), Point.create(0.8, 0), Point.create(0, 0.6));
		console.log(squareMesh);
	});
});