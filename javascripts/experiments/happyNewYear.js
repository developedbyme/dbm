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
	var SizeOfElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.SizeOfElementNode");
	
	var DateStringToTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.DateStringToTimeNode");
	var CurrentTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.CurrentTimeNode");
	var TimeBreakdownNode = dbm.importClass("com.developedbyme.flow.nodes.time.TimeBreakdownNode");
	var PadNumberNode = dbm.importClass("com.developedbyme.flow.nodes.text.PadNumberNode");
	var TextReplacementNode = dbm.importClass("com.developedbyme.flow.nodes.text.TextReplacementNode");
	var ReportNode = dbm.importClass("com.developedbyme.flow.nodes.debug.ReportNode");
	
	var ValuesFromRectangleNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.ValuesFromRectangleNode");
	var PositionRectangleNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.PositionRectangleNode");
	var RectangleFromValuesNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.RectangleFromValuesNode");
	
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
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
		var scalePoint = FlowGroup.create({x: windowSizeNode.getProperty("width"), y: windowSizeNode.getProperty("height"), scale: 0.5, moveLengthScale: 0.4, maxWidthScale: 0.8}, {x: 0, y: 0, moveLength: 0, maxWidth: 0, halfMaxWidth: 0});
		
		var scaleXNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("scale"));
		var scaleYNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("scale"));
		
		var scaleLengthNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("moveLengthScale"));
		var scaleMaxWidthNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("maxWidthScale"));
		var halfMaxWidthNode = MultiplicationNode.create(scaleMaxWidthNode.getProperty("outputValue"), 0.5);
		
		dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleLengthNode.getProperty("outputValue"), scalePoint.getOutputProperty("moveLength"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleMaxWidthNode.getProperty("outputValue"), scalePoint.getOutputProperty("maxWidth"));
		dbm.singletons.dbmFlowManager.connectProperties(halfMaxWidthNode.getProperty("outputValue"), scalePoint.getOutputProperty("halfMaxWidth"));
		
		//Current time
		
		var currentDateNode = CurrentTimeNode.create();
		currentDateNode.start();
		
		//Parsed time
		
		var dateNode = DateStringToTimeNode.create("2012-12-21T11:11:00Z");
		
		//Time diff
		
		var timeDiffNode = SubtractionNode.create(dateNode.getProperty("time"), currentDateNode.getProperty("time"));
		
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
		var holder = DisplayBaseObject.createDiv(document.body, false, {"class": "timezoneHolder"});
		holder.addToParent(document.body);
		holder.setElementAsTransformed();
		holder.setElementAsSized();
		
		var placeTextHolder = DisplayBaseObject.createNode("span", holder.getElement(), true, {"class": "textHolder"});
		placeTextHolder.setElementAsTransformed();
		var placeTextElement = TextElement.create(placeTextHolder.getElement(), true, "London");
		
		var timeTextHolder = DisplayBaseObject.createNode("span", holder.getElement(), true, {"class": "textHolder"});
		timeTextHolder.setElementAsTransformed();
		var timeTextElement = TextElement.create(timeTextHolder.getElement(), true, "00:00:00");
		timeTextElement.setPropertyInput("text", formatTimeNode.getProperty("outputValue"));
		
		//Text scale
		
		var placeSizeOfNode = SizeOfElementNode.create(placeTextHolder.getElement(), holder.getProperty("inDomOutput"));
		var timeSizeOfNode = SizeOfElementNode.create(timeTextHolder.getElement(), holder.getProperty("inDomOutput"));
		
		var placeScaleNode = DivisionNode.create(scalePoint.getOutputProperty("maxWidth"), placeSizeOfNode.getProperty("width"));
		var timeScaleNode = DivisionNode.create(scalePoint.getOutputProperty("maxWidth"), timeSizeOfNode.getProperty("width"));
		
		var placeScaledHeightNode = MultiplicationNode.create(placeSizeOfNode.getProperty("height"), placeScaleNode.getProperty("outputValue"));
		var timeScaledHeightNode = MultiplicationNode.create(timeSizeOfNode.getProperty("height"), timeScaleNode.getProperty("outputValue"));
		
		var totalHeightNode = AdditionNode.create(placeScaledHeightNode.getProperty("outputValue"), timeScaledHeightNode.getProperty("outputValue"));
		var totalHeightWithSpacingNode = AdditionNode.create(totalHeightNode.getProperty("outputValue"), -40);
		
		var boundsRectangle = RectangleFromValuesNode.create(0, 0, scalePoint.getOutputProperty("maxWidth"), totalHeightWithSpacingNode.getProperty("outputValue"));
		
		var placeTextRectangle = RectangleFromValuesNode.create(0, 0, scalePoint.getOutputProperty("maxWidth"), placeScaledHeightNode.getProperty("outputValue"));
		var placePositionNode = PositionRectangleNode.create(boundsRectangle.getProperty("outputRectangle"), placeTextRectangle.getProperty("outputRectangle"), 0, 0, 0, -0.5, 0, 0);
		var placeValuesFromRectangleNode = ValuesFromRectangleNode.create(placePositionNode.getProperty("outputRectangle"));
		var timeTextRectangle = RectangleFromValuesNode.create(0, 0, scalePoint.getOutputProperty("maxWidth"), timeScaledHeightNode.getProperty("outputValue"));
		var timePositionNode = PositionRectangleNode.create(boundsRectangle.getProperty("outputRectangle"), timeTextRectangle.getProperty("outputRectangle"), 0, 1, 0, 0.5, 0, 0);
		var timeValuesFromRectangleNode = ValuesFromRectangleNode.create(timePositionNode.getProperty("outputRectangle"));
		
		placeTextHolder.setPropertyInput("x", scalePoint.getOutputProperty("halfMaxWidth"));
		placeTextHolder.setPropertyInput("y", placeValuesFromRectangleNode.getProperty("y"));
		placeTextHolder.setPropertyInput("scaleX", placeScaleNode.getProperty("outputValue"));
		placeTextHolder.setPropertyInput("scaleY", placeScaleNode.getProperty("outputValue"));
		
		timeTextHolder.setPropertyInput("x", scalePoint.getOutputProperty("halfMaxWidth"));
		timeTextHolder.setPropertyInput("y", timeValuesFromRectangleNode.getProperty("y"));
		timeTextHolder.setPropertyInput("scaleX", timeScaleNode.getProperty("outputValue"));
		timeTextHolder.setPropertyInput("scaleY", timeScaleNode.getProperty("outputValue"));
		
		//Animation
		
		var positionDiffNode = SubtractionNode.create(mouseRangeNode.getProperty("outputValue"), 0);
		
		var positionTimeline = Timeline.create(1);
		positionTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		positionTimeline.animateValueAt(0, 0.75, InterpolationTypes.INVERTED_QUADRATIC, -0.75);
		positionTimeline.animateValueAt(-1, 0.75, InterpolationTypes.QUADRATIC, 0);
		
		var scaleTimeline = Timeline.create(0);
		scaleTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		scaleTimeline.animateValueAt(0.10, 0.5, InterpolationTypes.INVERTED_QUADRATIC, -1.5);
		scaleTimeline.animateValueAt(1, 0.75, InterpolationTypes.QUADRATIC, -0.75);
		scaleTimeline.animateValueAt(0, 0.75, InterpolationTypes.INVERTED_QUADRATIC, 0);
		
		var inDomTimeline = Timeline.create(false);
		inDomTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		inDomTimeline.setValueAt(true, -1.5);
		inDomTimeline.setValueAt(false, 0.75);
		
		var positionMultiplierNode = MultiplicationNode.create(positionTimeline.getProperty("outputValue"), scalePoint.getOutputProperty("moveLength"));
		var centeredAnimationNode = AdditionNode.create(scalePoint.getOutputProperty("y"), positionMultiplierNode.getProperty("outputValue"));
		
		holder.setPropertyInput("inDom", inDomTimeline.getProperty("outputValue"));
		holder.setPropertyInput("y", centeredAnimationNode.getProperty("outputValue"));
		holder.setPropertyInput("x", scalePoint.getOutputProperty("x"));
		holder.setPropertyInput("scaleX", scaleTimeline.getProperty("outputValue"));
		holder.setPropertyInput("scaleY", scaleTimeline.getProperty("outputValue"));
		
		holder.setPropertyInput("width", scalePoint.getOutputProperty("maxWidth"));
		holder.setPropertyInput("height", totalHeightWithSpacingNode.getProperty("outputValue"));
		
		//Updates
		placeTextHolder.getProperty("display").startUpdating();
		timeTextHolder.getProperty("display").startUpdating();
		timeTextElement.getProperty("display").startUpdating();
		holder.getProperty("display").startUpdating();
		
		//Debug
		//var traceInDomNode = ReportNode.create(inDomTimeline.getProperty("outputValue"));
		//traceInDomNode.start();
		
		
		
		
		
		
		//Parsed time
		
		var dateNode = DateStringToTimeNode.create("2012-12-21T11:11:00+0100");
		
		//Time diff
		
		var timeDiffNode = SubtractionNode.create(dateNode.getProperty("time"), currentDateNode.getProperty("time"));
		
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
		var holder = DisplayBaseObject.createDiv(document.body, false, {"class": "timezoneHolder"});
		holder.addToParent(document.body);
		holder.setElementAsTransformed();
		holder.setElementAsSized();
		
		var placeTextHolder = DisplayBaseObject.createNode("span", holder.getElement(), true, {"class": "textHolder"});
		placeTextHolder.setElementAsTransformed();
		var placeTextElement = TextElement.create(placeTextHolder.getElement(), true, "Stockholm");
		
		var timeTextHolder = DisplayBaseObject.createNode("span", holder.getElement(), true, {"class": "textHolder"});
		timeTextHolder.setElementAsTransformed();
		var timeTextElement = TextElement.create(timeTextHolder.getElement(), true, "00:00:00");
		timeTextElement.setPropertyInput("text", formatTimeNode.getProperty("outputValue"));
		
		//Text scale
		
		var placeSizeOfNode = SizeOfElementNode.create(placeTextHolder.getElement(), holder.getProperty("inDomOutput"));
		var timeSizeOfNode = SizeOfElementNode.create(timeTextHolder.getElement(), holder.getProperty("inDomOutput"));
		
		var placeScaleNode = DivisionNode.create(scalePoint.getOutputProperty("maxWidth"), placeSizeOfNode.getProperty("width"));
		var timeScaleNode = DivisionNode.create(scalePoint.getOutputProperty("maxWidth"), timeSizeOfNode.getProperty("width"));
		
		var placeScaledHeightNode = MultiplicationNode.create(placeSizeOfNode.getProperty("height"), placeScaleNode.getProperty("outputValue"));
		var timeScaledHeightNode = MultiplicationNode.create(timeSizeOfNode.getProperty("height"), timeScaleNode.getProperty("outputValue"));
		
		var totalHeightNode = AdditionNode.create(placeScaledHeightNode.getProperty("outputValue"), timeScaledHeightNode.getProperty("outputValue"));
		var totalHeightWithSpacingNode = AdditionNode.create(totalHeightNode.getProperty("outputValue"), -40);
		
		var boundsRectangle = RectangleFromValuesNode.create(0, 0, scalePoint.getOutputProperty("maxWidth"), totalHeightWithSpacingNode.getProperty("outputValue"));
		
		var placeTextRectangle = RectangleFromValuesNode.create(0, 0, scalePoint.getOutputProperty("maxWidth"), placeScaledHeightNode.getProperty("outputValue"));
		var placePositionNode = PositionRectangleNode.create(boundsRectangle.getProperty("outputRectangle"), placeTextRectangle.getProperty("outputRectangle"), 0, 0, 0, -0.5, 0, 0);
		var placeValuesFromRectangleNode = ValuesFromRectangleNode.create(placePositionNode.getProperty("outputRectangle"));
		var timeTextRectangle = RectangleFromValuesNode.create(0, 0, scalePoint.getOutputProperty("maxWidth"), timeScaledHeightNode.getProperty("outputValue"));
		var timePositionNode = PositionRectangleNode.create(boundsRectangle.getProperty("outputRectangle"), timeTextRectangle.getProperty("outputRectangle"), 0, 1, 0, 0.5, 0, 0);
		var timeValuesFromRectangleNode = ValuesFromRectangleNode.create(timePositionNode.getProperty("outputRectangle"));
		
		placeTextHolder.setPropertyInput("x", scalePoint.getOutputProperty("halfMaxWidth"));
		placeTextHolder.setPropertyInput("y", placeValuesFromRectangleNode.getProperty("y"));
		placeTextHolder.setPropertyInput("scaleX", placeScaleNode.getProperty("outputValue"));
		placeTextHolder.setPropertyInput("scaleY", placeScaleNode.getProperty("outputValue"));
		
		timeTextHolder.setPropertyInput("x", scalePoint.getOutputProperty("halfMaxWidth"));
		timeTextHolder.setPropertyInput("y", timeValuesFromRectangleNode.getProperty("y"));
		timeTextHolder.setPropertyInput("scaleX", timeScaleNode.getProperty("outputValue"));
		timeTextHolder.setPropertyInput("scaleY", timeScaleNode.getProperty("outputValue"));
		
		//Animation
		
		var positionDiffNode = SubtractionNode.create(mouseRangeNode.getProperty("outputValue"), -1);
		
		var positionTimeline = Timeline.create(1);
		positionTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		positionTimeline.animateValueAt(0, 0.75, InterpolationTypes.INVERTED_QUADRATIC, -0.75);
		positionTimeline.animateValueAt(-1, 0.75, InterpolationTypes.QUADRATIC, 0);
		
		var scaleTimeline = Timeline.create(0);
		scaleTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		scaleTimeline.animateValueAt(0.10, 0.5, InterpolationTypes.INVERTED_QUADRATIC, -1.5);
		scaleTimeline.animateValueAt(1, 0.75, InterpolationTypes.QUADRATIC, -0.75);
		scaleTimeline.animateValueAt(0, 0.75, InterpolationTypes.INVERTED_QUADRATIC, 0);
		
		var inDomTimeline = Timeline.create(false);
		inDomTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		inDomTimeline.setValueAt(true, -1.5);
		inDomTimeline.setValueAt(false, 0.75);
		
		var positionMultiplierNode = MultiplicationNode.create(positionTimeline.getProperty("outputValue"), scalePoint.getOutputProperty("moveLength"));
		var centeredAnimationNode = AdditionNode.create(scalePoint.getOutputProperty("y"), positionMultiplierNode.getProperty("outputValue"));
		
		holder.setPropertyInput("inDom", inDomTimeline.getProperty("outputValue"));
		holder.setPropertyInput("y", centeredAnimationNode.getProperty("outputValue"));
		holder.setPropertyInput("x", scalePoint.getOutputProperty("x"));
		holder.setPropertyInput("scaleX", scaleTimeline.getProperty("outputValue"));
		holder.setPropertyInput("scaleY", scaleTimeline.getProperty("outputValue"));
		
		holder.setPropertyInput("width", scalePoint.getOutputProperty("maxWidth"));
		holder.setPropertyInput("height", totalHeightWithSpacingNode.getProperty("outputValue"));
		
		//Updates
		placeTextHolder.getProperty("display").startUpdating();
		timeTextHolder.getProperty("display").startUpdating();
		timeTextElement.getProperty("display").startUpdating();
		holder.getProperty("display").startUpdating();
		
		
		
		
		
		
		
		
		
		//Parsed time
		
		var dateNode = DateStringToTimeNode.create("2012-12-21T11:11:00-0017");
		
		//Time diff
		
		var timeDiffNode = SubtractionNode.create(dateNode.getProperty("time"), currentDateNode.getProperty("time"));
		
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
		var holder = DisplayBaseObject.createDiv(document.body, false, {"class": "timezoneHolder"});
		holder.addToParent(document.body);
		holder.setElementAsTransformed();
		holder.setElementAsSized();
		
		var placeTextHolder = DisplayBaseObject.createNode("span", holder.getElement(), true, {"class": "textHolder"});
		placeTextHolder.setElementAsTransformed();
		var placeTextElement = TextElement.create(placeTextHolder.getElement(), true, "Heathrow Terminal 5");
		
		var timeTextHolder = DisplayBaseObject.createNode("span", holder.getElement(), true, {"class": "textHolder"});
		timeTextHolder.setElementAsTransformed();
		var timeTextElement = TextElement.create(timeTextHolder.getElement(), true, "00:00:00");
		timeTextElement.setPropertyInput("text", formatTimeNode.getProperty("outputValue"));
		
		//Text scale
		
		var placeSizeOfNode = SizeOfElementNode.create(placeTextHolder.getElement(), holder.getProperty("inDomOutput"));
		var timeSizeOfNode = SizeOfElementNode.create(timeTextHolder.getElement(), holder.getProperty("inDomOutput"));
		
		var placeScaleNode = DivisionNode.create(scalePoint.getOutputProperty("maxWidth"), placeSizeOfNode.getProperty("width"));
		var timeScaleNode = DivisionNode.create(scalePoint.getOutputProperty("maxWidth"), timeSizeOfNode.getProperty("width"));
		
		var placeScaledHeightNode = MultiplicationNode.create(placeSizeOfNode.getProperty("height"), placeScaleNode.getProperty("outputValue"));
		var timeScaledHeightNode = MultiplicationNode.create(timeSizeOfNode.getProperty("height"), timeScaleNode.getProperty("outputValue"));
		
		var totalHeightNode = AdditionNode.create(placeScaledHeightNode.getProperty("outputValue"), timeScaledHeightNode.getProperty("outputValue"));
		var totalHeightWithSpacingNode = AdditionNode.create(totalHeightNode.getProperty("outputValue"), -40);
		
		var boundsRectangle = RectangleFromValuesNode.create(0, 0, scalePoint.getOutputProperty("maxWidth"), totalHeightWithSpacingNode.getProperty("outputValue"));
		
		var placeTextRectangle = RectangleFromValuesNode.create(0, 0, scalePoint.getOutputProperty("maxWidth"), placeScaledHeightNode.getProperty("outputValue"));
		var placePositionNode = PositionRectangleNode.create(boundsRectangle.getProperty("outputRectangle"), placeTextRectangle.getProperty("outputRectangle"), 0, 0, 0, -0.5, 0, 0);
		var placeValuesFromRectangleNode = ValuesFromRectangleNode.create(placePositionNode.getProperty("outputRectangle"));
		var timeTextRectangle = RectangleFromValuesNode.create(0, 0, scalePoint.getOutputProperty("maxWidth"), timeScaledHeightNode.getProperty("outputValue"));
		var timePositionNode = PositionRectangleNode.create(boundsRectangle.getProperty("outputRectangle"), timeTextRectangle.getProperty("outputRectangle"), 0, 1, 0, 0.5, 0, 0);
		var timeValuesFromRectangleNode = ValuesFromRectangleNode.create(timePositionNode.getProperty("outputRectangle"));
		
		placeTextHolder.setPropertyInput("x", scalePoint.getOutputProperty("halfMaxWidth"));
		placeTextHolder.setPropertyInput("y", placeValuesFromRectangleNode.getProperty("y"));
		placeTextHolder.setPropertyInput("scaleX", placeScaleNode.getProperty("outputValue"));
		placeTextHolder.setPropertyInput("scaleY", placeScaleNode.getProperty("outputValue"));
		
		timeTextHolder.setPropertyInput("x", scalePoint.getOutputProperty("halfMaxWidth"));
		timeTextHolder.setPropertyInput("y", timeValuesFromRectangleNode.getProperty("y"));
		timeTextHolder.setPropertyInput("scaleX", timeScaleNode.getProperty("outputValue"));
		timeTextHolder.setPropertyInput("scaleY", timeScaleNode.getProperty("outputValue"));
		
		//Animation
		
		var positionDiffNode = SubtractionNode.create(mouseRangeNode.getProperty("outputValue"), 1);
		
		var positionTimeline = Timeline.create(1);
		positionTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		positionTimeline.animateValueAt(0, 0.75, InterpolationTypes.INVERTED_QUADRATIC, -0.75);
		positionTimeline.animateValueAt(-1, 0.75, InterpolationTypes.QUADRATIC, 0);
		
		var scaleTimeline = Timeline.create(0);
		scaleTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		scaleTimeline.animateValueAt(0.10, 0.5, InterpolationTypes.INVERTED_QUADRATIC, -1.5);
		scaleTimeline.animateValueAt(1, 0.75, InterpolationTypes.QUADRATIC, -0.75);
		scaleTimeline.animateValueAt(0, 0.75, InterpolationTypes.INVERTED_QUADRATIC, 0);
		
		var inDomTimeline = Timeline.create(false);
		inDomTimeline.setPropertyInput("time", positionDiffNode.getProperty("outputValue"));
		inDomTimeline.setValueAt(true, -1.5);
		inDomTimeline.setValueAt(false, 0.75);
		
		var positionMultiplierNode = MultiplicationNode.create(positionTimeline.getProperty("outputValue"), scalePoint.getOutputProperty("moveLength"));
		var centeredAnimationNode = AdditionNode.create(scalePoint.getOutputProperty("y"), positionMultiplierNode.getProperty("outputValue"));
		
		holder.setPropertyInput("inDom", inDomTimeline.getProperty("outputValue"));
		holder.setPropertyInput("y", centeredAnimationNode.getProperty("outputValue"));
		holder.setPropertyInput("x", scalePoint.getOutputProperty("x"));
		holder.setPropertyInput("scaleX", scaleTimeline.getProperty("outputValue"));
		holder.setPropertyInput("scaleY", scaleTimeline.getProperty("outputValue"));
		
		holder.setPropertyInput("width", scalePoint.getOutputProperty("maxWidth"));
		holder.setPropertyInput("height", totalHeightWithSpacingNode.getProperty("outputValue"));
		
		//Updates
		placeTextHolder.getProperty("display").startUpdating();
		timeTextHolder.getProperty("display").startUpdating();
		timeTextElement.getProperty("display").startUpdating();
		holder.getProperty("display").startUpdating();
	});
});