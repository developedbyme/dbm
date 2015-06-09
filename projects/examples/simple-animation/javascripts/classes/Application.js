/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("Application", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("Application");
	//"use strict";
	
	//Self reference
	var Application = dbm.importClass("Application");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var PlaceElementNode = dbm.importClass("dbm.flow.nodes.display.PlaceElementNode");
	var RepeatedRangeNode = dbm.importClass("dbm.flow.nodes.math.range.RepeatedRangeNode");
	
	//Utils
	
	//Constants
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.getDocument());
		
		var numberOfItems = 15;
		
		var repeatedRangeNode = RepeatedRangeNode.create(dbm.singletons.dbmAnimationManager.globalTimeProperty, 0, ((numberOfItems-1)*0.5*0.25+1+1));
		dbm.singletons.dbmAnimationManager.globalTimeProperty = repeatedRangeNode.getProperty("outputValue");
		
		for(var i = 0; i < numberOfItems; i++) {
			
			var newNode = htmlCreator.createNode("div", {style: "position: absolute; background-color: #FF0000"});
			this._contentHolder.appendChild(newNode);
			
			var placeElementNode = PlaceElementNode.create(newNode);
			placeElementNode.getProperty("y").setValue(50*i);
			placeElementNode.getProperty("width").setValue(200);
			placeElementNode.getProperty("height").setValue(50);
			
			var newTimeline = dbm.singletons.dbmAnimationManager.createTimeline(0, placeElementNode.getProperty("x"));
			
			newTimeline.animateValue(800, 1, InterpolationTypes.QUADRATIC, i*0.5*0.25);
			newTimeline.animateValue(0, 1, InterpolationTypes.INVERTED_QUADRATIC, i*0.5*0.25+1);
			
			placeElementNode.getProperty("display").startUpdating();
		}	
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});