dbm.runTempFunction(function() {
	
	var ArrayGenerator = dbm.importClass("dbm.utils.native.array.ArrayGenerator");
	
	var SequencedMultipleOrderSelector = dbm.importClass("dbm.utils.data.orderselector.SequencedMultipleOrderSelector");
	var OrderedOrderSelector = dbm.importClass("dbm.utils.data.orderselector.OrderedOrderSelector");
	var ModifiedSteppedOrderSelector = dbm.importClass("dbm.utils.data.orderselector.ModifiedSteppedOrderSelector");
	var ReservedData = dbm.importClass("dbm.utils.data.orderselector.ReservedData");
	
	var RepeatedRangeInterpolation = dbm.importClass("dbm.utils.math.interpolation.RepeatedRangeInterpolation");
	var OffsettedInterpolation = dbm.importClass("dbm.utils.math.interpolation.OffsettedInterpolation");
	var LinearInterpolation = dbm.importClass("dbm.utils.math.interpolation.LinearInterpolation");
	
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	
	var startFunction = function() {
		console.log("startFunction");
		
		var length = 150;
		var startOffset = 0;
		
		var orderArray = ArrayGenerator.createHalfSplitOrderArray(length);
		
		var mainSelector = SequencedMultipleOrderSelector.create([
			SequencedMultipleOrderSelector.create([
				ModifiedSteppedOrderSelector.create(0, length, RepeatedRangeInterpolation.create(OffsettedInterpolation.create(LinearInterpolation.create(), 1, startOffset), 0, length)),
				ModifiedSteppedOrderSelector.create(0, length, RepeatedRangeInterpolation.create(OffsettedInterpolation.create(LinearInterpolation.create(), -1, startOffset), 0, length))
			]),
			OrderedOrderSelector.create(orderArray)
		]);
		
		var reservedData = ReservedData.create(length);
		
		var returnArray = new Array(length);
		
		
		var drawWidth = 500;
		
		var canvasView = CanvasView.create(dbm.getDocument().body, true, "2d", {width: drawWidth, height: drawWidth});
		var canvasController = canvasView.getController();
		canvasView.getProperty("display").startUpdating();
		canvasController.getProperty("display").startUpdating();
		
		canvasController.getRootLayer().getProperty("x").setValue(0.5*drawWidth);
		canvasController.getRootLayer().getProperty("y").setValue(0.5*drawWidth);
		
		var circleCurve = dbm.singletons.dbmCurveCreator.createCircle(0, 0, 5);
		
		var mainLayer = canvasController.getLayer("main");
		
		for(var i = 0; i < length; i++) {
			var nextPosition = mainSelector.getNextValue(reservedData);
			returnArray[i] = nextPosition;
			
			var drawLayer = canvasController.getLayer("main/circle/" + nextPosition);
			drawLayer.setStrokeStyle(1, "#FF0000");
			drawLayer.setFillStyle("#FF0000");
			drawLayer.drawCurve(circleCurve);
			drawLayer.closePath();
			
			drawLayer.setPropertyInput("x", 0.45*drawWidth*Math.sin(2*Math.PI*(nextPosition/length)));
			drawLayer.setPropertyInput("y", 0.45*drawWidth*Math.cos(2*Math.PI*(nextPosition/length)));
			drawLayer.getProperty("alpha").setValue(0.1);
			drawLayer.getProperty("alpha").setValueWithDelay(1, i*0.05);
		}
		
		console.log(returnArray);
		
		
		
		
	};
	
	dbm.addStartFunction(startFunction);
});