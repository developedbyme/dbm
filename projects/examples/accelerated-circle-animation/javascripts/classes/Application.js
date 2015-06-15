/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("Application", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("Application");
	//"use strict";
	
	//Self reference
	var Application = dbm.importClass("Application");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var PlaceElementNode = dbm.importClass("dbm.flow.nodes.display.PlaceElementNode");
	var RepeatedRangeNode = dbm.importClass("dbm.flow.nodes.math.range.RepeatedRangeNode");
	
	var GlobalTimeNode = dbm.importClass("dbm.flow.nodes.time.GlobalTimeNode");
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var PlaceElementNode = dbm.importClass("dbm.flow.nodes.display.PlaceElementNode");
	var PropertiesHolder = dbm.importClass("dbm.flow.PropertiesHolder");
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	var SubtractionNode = dbm.importClass("dbm.flow.nodes.math.SubtractionNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var PrintTextNode = dbm.importClass("dbm.flow.nodes.display.PrintTextNode");
	var FlowGroup = dbm.importClass("dbm.flow.FlowGroup");
	var MousePositionNode = dbm.importClass("dbm.flow.nodes.userinput.MousePositionNode");
	var SimpleSpeedNode = dbm.importClass("dbm.flow.nodes.incrementation.SimpleSpeedNode");
	var RangeNode = dbm.importClass("dbm.flow.nodes.math.range.RangeNode");
	var SinNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.SinNode");
	var CosNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.CosNode");
	var ScaleZNode = dbm.importClass("dbm.flow.nodes.math.transformation.ScaleZNode");
	var IterativeFlowGroup = dbm.importClass("dbm.flow.IterativeFlowGroup");
	var InterpolationTypes = dbm.importClass("dbm.constants.generic.InterpolationTypes");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		//this._mainTemplate = "assets/templates.html#main";
		
		//this._assetsLoader.addAssetsByPath(this._mainTemplate);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(this._contentHolder.ownerDocument);
		
		var animationTime = 2;
		
		var repeatedRangeNode = RepeatedRangeNode.create(dbm.singletons.dbmAnimationManager.globalTimeProperty, 0, animationTime+1);
		dbm.singletons.dbmAnimationManager.globalTimeProperty = repeatedRangeNode.getProperty("outputValue");
		
		//Center of page
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
		
		//Group
		var scalePoint = FlowGroup.create({x: windowSizeNode.getProperty("width"), y: windowSizeNode.getProperty("height"), scale: 0.5}, {x: 0, y: 0});
		
		var scaleXNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("scale"));
		var scaleYNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("scale"));
		
		dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		
		//Position
		var xPosition = SinNode.create(0);
		xPosition.getProperty("inputValue").animateValue(Math.PI, 0.5*animationTime, InterpolationTypes.QUADRATIC, 0);
		xPosition.getProperty("inputValue").animateValue(2*Math.PI, 0.5*animationTime, InterpolationTypes.INVERTED_QUADRATIC, 0.5*animationTime);
		var yPosition = CosNode.create(0);
		yPosition.getProperty("inputValue").animateValue(Math.PI, 0.5*animationTime, InterpolationTypes.QUADRATIC, 0);
		yPosition.getProperty("inputValue").animateValue(2*Math.PI, 0.5*animationTime, InterpolationTypes.INVERTED_QUADRATIC, 0.5*animationTime);
		
		var xScale = MultiplicationNode.create(xPosition.getProperty("outputValue"), 200);
		var yScale = MultiplicationNode.create(yPosition.getProperty("outputValue"), 200);
		
		//Center on screen
		var centerX = AdditionNode.create(xScale.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		var centerY = AdditionNode.create(yScale.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		
		//Box offset
		var halfBoxWidth = MultiplicationNode.create(50, 0.5);
		var halfBoxHeight = MultiplicationNode.create(50, 0.5);
		
		var boxCenterOffsetX = SubtractionNode.create(centerX.getProperty("outputValue"), halfBoxWidth.getProperty("outputValue"));
		var boxCenterOffsetY = SubtractionNode.create(centerY.getProperty("outputValue"), halfBoxHeight.getProperty("outputValue"));
		
		//Node
		var newNode = htmlCreator.createNode("div", {style: "position: absolute; background-color: #FF0000"});
		this._contentHolder.appendChild(newNode);
			
		var placeElementNode = PlaceElementNode.create(newNode, boxCenterOffsetX.getProperty("outputValue"), boxCenterOffsetY.getProperty("outputValue"), 0, 50, 50);
		placeElementNode.getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});