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
	var CarouselBaseObject = dbm.importClass("dbm.gui.abstract.carousel.CarouselBaseObject");
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var CircularDistanceNode = dbm.importClass("dbm.flow.nodes.math.CircularDistanceNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
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
		
		var carousel = CarouselBaseObject.create();
		var holder = DisplayBaseObject.createDiv(this._contentHolder, true, {"style": "position: relative; overflow: hidden;"});
		holder.setElementAsSized();
		holder.getProperty("width").setValue(1024);
		holder.getProperty("height").setValue(768);
		holder.getProperty("display").update();
		
		carousel.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ITEM_ADDED, CallFunctionCommand.createCommand(this, this._setupItem, [GetVariableObject.createSelectPerformingObjectCommand(), GetVariableObject.createSelectDataCommand(), holder.getProperty("width"), holder.getProperty("height")]));
		
		var currentArray = ["#FF0000", "#00FF00", "#0000FF"];
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var newElement = DisplayBaseObject.createDiv(holder.getElement(), true, {"style": "position: absolute; background-color: " + currentArray[i] + ";"});
			newElement.setElementAsSized();
			newElement.setPropertyInput("width", holder.getProperty("width"));
			newElement.setPropertyInput("height", holder.getProperty("height"));
			carousel.addItem(newElement);
			newElement.getProperty("display").startUpdating();
			console.log(newElement.getProperty("display"));
		}
		
		carousel.getProperty("currentPosition").animateValue(15, 10, InterpolationTypes.LINEAR, 0);
		
		console.log(carousel);
	};
	
	objectFunctions._setupItem = function(aCarousel, aCarouselItem, aHolderWidth, aHolderHeight) {
		console.log("Application::_setupItem");
		
		var currentDisplayObject = aCarouselItem.item;
		currentDisplayObject.setElementAsPositioned();
		
		var offsetNode = CircularDistanceNode.create(aCarouselItem.getProperty("position"), aCarousel.getProperty("currentPosition"), aCarousel.getProperty("numberOfItems"));
		aCarouselItem.addDestroyableObject(offsetNode);
		
		var multipledOffsetNode = MultiplicationNode.create(offsetNode.getProperty("outputValue"), aHolderWidth);
		aCarouselItem.addDestroyableObject(multipledOffsetNode);
		
		currentDisplayObject.getProperty("x").connectInput(multipledOffsetNode.getProperty("outputValue"));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});