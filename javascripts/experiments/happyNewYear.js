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
	var RangeNode = dbm.importClass("com.developedbyme.flow.nodes.math.range.RangeNode");
	var MousePositionNode = dbm.importClass("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	
	var DateStringToTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.DateStringToTimeNode");
	var CurrentTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.CurrentTimeNode");
	var TimeBreakdownNode = dbm.importClass("com.developedbyme.flow.nodes.time.TimeBreakdownNode");
	var PadNumberNode = dbm.importClass("com.developedbyme.flow.nodes.text.PadNumberNode");
	var TextReplacementNode = dbm.importClass("com.developedbyme.flow.nodes.text.TextReplacementNode");
	var ReportNode = dbm.importClass("com.developedbyme.flow.nodes.debug.ReportNode");
	
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		//Center of page
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
		
		//Debug driver
		var mousePositionNode = (new MousePositionNode()).init();
		mousePositionNode.start();
		
		var mouseRangeNode = RangeNode.create(mousePositionNode.getProperty("x"), 0, windowSizeNode.getProperty("width"), -3, 3);
		
		//Scale group
		var scalePoint = FlowGroup.create({x: windowSizeNode.getProperty("width"), y: windowSizeNode.getProperty("height"), scale: 0.5, moveLengthScale: 0.25}, {x: 0, y: 0, moveLength: 0});
		
		var scaleXNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("scale"));
		var scaleYNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("scale"));
		
		var scaleLengthNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("moveLengthScale"));
		
		dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleLengthNode.getProperty("outputValue"), scalePoint.getOutputProperty("moveLength"));
		
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
		var holder = DisplayBaseObject.createDiv(document.body, true);
		holder.addToParent(document.body);
		holder.setElementAsTransformed();
		
		var placeTextElement = TextElement.create(holder.getElement(), true, "London");
		
		var timeTextElement = TextElement.create(holder.getElement(), true, "Text");
		timeTextElement.setPropertyInput("text", formatTimeNode.getProperty("outputValue"));
		
		//Animation
		
		var positionDiffNode = SubtractionNode.create(mouseRangeNode.getProperty("outputValue"), 0);
		
		var positionTimeline = Timeline.create(0);
		positionTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		
		var scaleTimeline = Timeline.create(0);
		scaleTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		
		var inDomTimeline = Timeline.create(false);
		inDomTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		inDomTimeline.setValueAt(true, -2);
		inDomTimeline.setValueAt(false, 1);
		
		holder.setPropertyInput("inDom", inDomTimeline.getProperty("outputValue"));
		//holder.setPropertyInput("y", positionTimeline.getProperty("outputValue"));
		
		//Debug
		
		var traceInDomNode = ReportNode.create(inDomTimeline.getProperty("outputValue"));
		traceInDomNode.start();
		
		//Updates
		timeTextElement.getProperty("display").startUpdating();
		holder.getProperty("display").startUpdating();
		
		console.log(inDomTimeline);
	});
});