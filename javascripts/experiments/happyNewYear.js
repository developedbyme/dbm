dbm.runTempFunction(function() {
	
	var PlaceElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.PlaceElementNode");
	
	var GlobalTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.GlobalTimeNode");
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var SubtractionNode = dbm.importClass("com.developedbyme.flow.nodes.math.SubtractionNode");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var DivisionNode = dbm.importClass("com.developedbyme.flow.nodes.math.DivisionNode");
	var FlowGroup = dbm.importClass("com.developedbyme.flow.FlowGroup");
	
	var DateStringToTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.DateStringToTimeNode");
	var CurrentTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.CurrentTimeNode");
	var TimeBreakdownNode = dbm.importClass("com.developedbyme.flow.nodes.time.TimeBreakdownNode");
	var PadNumberNode = dbm.importClass("com.developedbyme.flow.nodes.text.PadNumberNode");
	var TextReplacementNode = dbm.importClass("com.developedbyme.flow.nodes.text.TextReplacementNode");
	
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		//Center of page
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
		
		//Scale group
		var scalePoint = FlowGroup.create({x: windowSizeNode.getProperty("width"), y: windowSizeNode.getProperty("height"), scale: 0.5}, {x: 0, y: 0});
		
		var scaleXNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("scale"));
		var scaleYNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("scale"));
		
		dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		
		//Parsed time
		
		var dateNode = DateStringToTimeNode.create("2012-12-10T15:00:00Z");
		
		//Current time
		
		var currentDateNode = CurrentTimeNode.create();
		currentDateNode.start();
		
		//Time diff
		
		var timeDiffNode = SubtractionNode.create(currentDateNode.getProperty("time"), dateNode.getProperty("time"));
		
		//Time output
		
		var timeBreakdownNode = TimeBreakdownNode.create(timeDiffNode.getProperty("outputValue"));
		
		var hoursPadNumberNode = PadNumberNode.create(timeBreakdownNode.getProperty("hours"), 2);
		var minutesPadNumberNode = PadNumberNode.create(timeBreakdownNode.getProperty("minutes"), 2);
		var secondsPadNumberNode = PadNumberNode.create(timeBreakdownNode.getProperty("seconds"), 2);
		
		var formatTimeNode = TextReplacementNode.create("HH:MM:SS");
		formatTimeNode.addReplacement("HH", hoursPadNumberNode.getProperty("outputValue"));
		formatTimeNode.addReplacement("MM", minutesPadNumberNode.getProperty("outputValue"));
		formatTimeNode.addReplacement("SS", secondsPadNumberNode.getProperty("outputValue"));
		
		//GUI
		var textElement = TextElement.create(document.body, true, "Text");
		textElement.setPropertyInput("text", formatTimeNode.getProperty("outputValue"));
		
		textElement.getProperty("display").startUpdating();
		
	});
});