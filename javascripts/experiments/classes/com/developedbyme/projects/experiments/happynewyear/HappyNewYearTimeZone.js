dbm.registerClass("com.developedbyme.projects.experiments.happynewyear.HappyNewYearTimeZone", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.projects.experiments.happynewyear.HappyNewYearTimeZone");
	//"use strict";
	
	var HappyNewYearTimeZone = dbm.importClass("com.developedbyme.projects.experiments.happynewyear.HappyNewYearTimeZone");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
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
	var BooleanSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.BooleanSwitchedNode");
	var ConditionNode = dbm.importClass("com.developedbyme.flow.nodes.logic.ConditionNode");
	
	var DateStringToTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.DateStringToTimeNode");
	var CurrentTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.CurrentTimeNode");
	var TimeBreakdownNode = dbm.importClass("com.developedbyme.flow.nodes.time.TimeBreakdownNode");
	var PadNumberNode = dbm.importClass("com.developedbyme.flow.nodes.text.PadNumberNode");
	var TextReplacementNode = dbm.importClass("com.developedbyme.flow.nodes.text.TextReplacementNode");
	var ReportNode = dbm.importClass("com.developedbyme.flow.nodes.debug.ReportNode");
	var UpdateSwitchNode = dbm.importClass("com.developedbyme.flow.nodes.update.UpdateSwitchNode");
	
	var ValuesFromRectangleNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.ValuesFromRectangleNode");
	var PositionRectangleNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.PositionRectangleNode");
	var RectangleFromValuesNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.RectangleFromValuesNode");
	
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	var EvaluateTimelineNode = dbm.importClass("com.developedbyme.flow.nodes.animation.EvaluateTimelineNode");
	
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.experiments.happynewyear.HappyNewYearTimeZone::_init");
		
		this.superCall();
		
		this.soundId = "normal";
		
		this._dateNode = null;
		this._holder = null;
		this._placeTextHolder = null;
		this._timeTextHolder = null;
		this._timeTextElement = null;
		
		this._selectedIndex = this.createProperty("selectedIndex", -1);
		this._currentIndex = this.createProperty("currentIndex", -1);
		this._currentIndex.createTimelineControl();
		this._moveLength = this.createProperty("moveLength", 0);
		this._maxWidth = this.createProperty("maxWidth", 0);
		this._halfMaxWidth = this.createProperty("halfMaxWidth", 0);
		this._centerX = this.createProperty("centerX", 0);
		this._centerY = this.createProperty("centerY", 0);
		this._currentDate = this.createProperty("currentDate", 0);
		
		this._positionTimeline = this.createProperty("positionTimeline", null).setAlwaysUpdateFlow(true);
		this._scaleTimeline = this.createProperty("scaleTimeline", null).setAlwaysUpdateFlow(true);
		this._inDomTimeline = this.createProperty("inDomTimeline", null).setAlwaysUpdateFlow(true);
		
		this._updateSwitchNode = null;
		
		return this;
	};
	
	objectFunctions.setIndex = function(aIndex) {
		this._currentIndex.setValue(aIndex);
	};
	
	objectFunctions.changeIndex = function(aIndex) {
		this._currentIndex.animateValue(aIndex, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0);
		//METODO: animation
	};
	
	objectFunctions.getCompareTime = function() {
		
		return this._dateNode.getProperty("time").getValue();
		
	};
	
	objectFunctions.setup = function(aName, aTimeString) {
		this._createGui(aName, aTimeString);
		
		return this;
	};
	
	objectFunctions._createGui = function(aName, aTimeString) {
		
		//Parsed time
		
		this._dateNode = DateStringToTimeNode.create(aTimeString);
		
		//Time diff
		
		var timeDiffNode = SubtractionNode.create(this._dateNode.getProperty("time"), this._currentDate);
		
		//Time output
		
		var timeBreakdownNode = TimeBreakdownNode.create(timeDiffNode.getProperty("outputValue"));
		
		var hoursPadNumberNode = PadNumberNode.create(timeBreakdownNode.getProperty("hours"), 2);
		var minutesPadNumberNode = PadNumberNode.create(timeBreakdownNode.getProperty("minutes"), 2);
		var secondsPadNumberNode = PadNumberNode.create(timeBreakdownNode.getProperty("seconds"), 2);
		
		var formatTimeNode = TextReplacementNode.create("HH:MM:SS");
		formatTimeNode.addReplacement("HH", hoursPadNumberNode.getProperty("outputValue"));
		formatTimeNode.addReplacement("MM", minutesPadNumberNode.getProperty("outputValue"));
		formatTimeNode.addReplacement("SS", secondsPadNumberNode.getProperty("outputValue"));
		
		var pastDateCondition = ConditionNode.create(">", timeDiffNode.getProperty("outputValue"), 0);
		
		var outputTextSelection = BooleanSwitchedNode.create(pastDateCondition.getProperty("outputValue"), formatTimeNode.getProperty("outputValue"), "00:00:00");
		
		//GUI
		this._holder = DisplayBaseObject.createDiv(document.body, false, {"class": "timezoneHolder", "style": "width: 1000px;"});
		this._holder.addToParent(document.body);
		this._holder.setElementAsTransformed();
		this._holder.setElementAsSized();
		
		this._placeTextHolder = DisplayBaseObject.createNode("span", this._holder.getElement(), true, {"class": "textHolder"});
		this._placeTextHolder.setElementAsTransformed();
		var placeTextElement = TextElement.create(this._placeTextHolder.getElement(), true, aName);
		placeTextElement.getProperty("display").update();
		
		this._timeTextHolder = DisplayBaseObject.createNode("span", this._holder.getElement(), true, {"class": "textHolder"});
		this._timeTextHolder.setElementAsTransformed();
		this._timeTextElement = TextElement.create(this._timeTextHolder.getElement(), true, "00:00:00");
		this._timeTextElement.getProperty("display").update();
		this._timeTextElement.setPropertyInput("text", outputTextSelection.getProperty("outputValue"));
		
		
		//Text scale
		
		var placeSizeOfNode = SizeOfElementNode.create(this._placeTextHolder.getElement(), this._holder.getProperty("inDomOutput"));
		var timeSizeOfNode = SizeOfElementNode.create(this._timeTextHolder.getElement(), this._holder.getProperty("inDomOutput"));
		
		var placeScaleNode = DivisionNode.create(this._maxWidth, placeSizeOfNode.getProperty("width"));
		var timeScaleNode = DivisionNode.create(this._maxWidth, timeSizeOfNode.getProperty("width"));
		
		var placeScaledHeightNode = MultiplicationNode.create(placeSizeOfNode.getProperty("height"), placeScaleNode.getProperty("outputValue"));
		var timeScaledHeightNode = MultiplicationNode.create(timeSizeOfNode.getProperty("height"), timeScaleNode.getProperty("outputValue"));
		
		var totalHeightNode = AdditionNode.create(placeScaledHeightNode.getProperty("outputValue"), timeScaledHeightNode.getProperty("outputValue"));
		var totalHeightWithSpacingNode = AdditionNode.create(totalHeightNode.getProperty("outputValue"), -40);
		
		var boundsRectangle = RectangleFromValuesNode.create(0, 0, this._maxWidth, totalHeightWithSpacingNode.getProperty("outputValue"));
		
		var placeTextRectangle = RectangleFromValuesNode.create(0, 0, this._maxWidth, placeScaledHeightNode.getProperty("outputValue"));
		var placePositionNode = PositionRectangleNode.create(boundsRectangle.getProperty("outputRectangle"), placeTextRectangle.getProperty("outputRectangle"), 0, 0, 0, -0.5, 0, 0);
		var placeValuesFromRectangleNode = ValuesFromRectangleNode.create(placePositionNode.getProperty("outputRectangle"));
		var timeTextRectangle = RectangleFromValuesNode.create(0, 0, this._maxWidth, timeScaledHeightNode.getProperty("outputValue"));
		var timePositionNode = PositionRectangleNode.create(boundsRectangle.getProperty("outputRectangle"), timeTextRectangle.getProperty("outputRectangle"), 0, 1, 0, 0.5, 0, 0);
		var timeValuesFromRectangleNode = ValuesFromRectangleNode.create(timePositionNode.getProperty("outputRectangle"));
		
		this._placeTextHolder.setPropertyInput("x", this._halfMaxWidth);
		this._placeTextHolder.setPropertyInput("y", placeValuesFromRectangleNode.getProperty("y"));
		this._placeTextHolder.setPropertyInput("scaleX", placeScaleNode.getProperty("outputValue"));
		this._placeTextHolder.setPropertyInput("scaleY", placeScaleNode.getProperty("outputValue"));
		
		this._timeTextHolder.setPropertyInput("x", this._halfMaxWidth);
		this._timeTextHolder.setPropertyInput("y", timeValuesFromRectangleNode.getProperty("y"));
		this._timeTextHolder.setPropertyInput("scaleX", timeScaleNode.getProperty("outputValue"));
		this._timeTextHolder.setPropertyInput("scaleY", timeScaleNode.getProperty("outputValue"));
		
		//Animation
		
		var positionDiffNode = SubtractionNode.create(this._selectedIndex, this._currentIndex);
		
		var positionTimelineEvalutationNode = EvaluateTimelineNode.create(this._positionTimeline, positionDiffNode.getProperty("outputValue"));
		var scaleTimelineEvalutationNode = EvaluateTimelineNode.create(this._scaleTimeline, positionDiffNode.getProperty("outputValue"));
		var inDomTimelineEvalutationNode = EvaluateTimelineNode.create(this._inDomTimeline, positionDiffNode.getProperty("outputValue"));
		
		var positionMultiplierNode = MultiplicationNode.create(positionTimelineEvalutationNode.getProperty("outputValue"), this._moveLength);
		var centeredAnimationNode = AdditionNode.create(this._centerY, positionMultiplierNode.getProperty("outputValue"));
		
		this._holder.setPropertyInput("inDom", inDomTimelineEvalutationNode.getProperty("outputValue"));
		this._holder.setPropertyInput("y", centeredAnimationNode.getProperty("outputValue"));
		this._holder.setPropertyInput("x", this._centerX);
		this._holder.setPropertyInput("scaleX", scaleTimelineEvalutationNode.getProperty("outputValue"));
		this._holder.setPropertyInput("scaleY", scaleTimelineEvalutationNode.getProperty("outputValue"));
		
		this._holder.setPropertyInput("width", this._maxWidth);
		this._holder.setPropertyInput("height", totalHeightWithSpacingNode.getProperty("outputValue"));
		
		//Updates
		this._updateSwitchNode = UpdateSwitchNode.createWithGlobalTicker(this._holder.getProperty("inDomOutput"));
		this._updateSwitchNode.getProperty("update").startUpdating();
		
		this._updateSwitchNode.addUpdateProperty(placeTextElement.getProperty("text"));
		this._updateSwitchNode.addUpdateProperty(this._timeTextElement.getProperty("text"));
		this._updateSwitchNode.addUpdateProperty(this._placeTextHolder.getProperty("display"));
		this._updateSwitchNode.addUpdateProperty(this._timeTextHolder.getProperty("display"));
		this._updateSwitchNode.addUpdateProperty(this._timeTextElement.getProperty("display"));
		this._updateSwitchNode.addUpdateProperty(this._holder.getProperty("display"));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aName, aTimeString) {
		//console.log("com.developedbyme.projects.experiments.happynewyear.HappyNewYearTimeZone::create");
		//console.log(aElement);
		
		var newNode = (new ClassReference()).init();
		
		newNode.setup(aName, aTimeString);
		
		return newNode;
	};
});