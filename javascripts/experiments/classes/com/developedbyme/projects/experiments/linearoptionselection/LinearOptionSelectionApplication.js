/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.experiments.linearoptionselection.LinearOptionSelectionApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.projects.experiments.linearoptionselection.LinearOptionSelectionApplication");
	//"use strict";
	
	//Self reference
	var LinearOptionSelectionApplication = dbm.importClass("com.developedbyme.projects.experiments.linearoptionselection.LinearOptionSelectionApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var FlowGroup = dbm.importClass("com.developedbyme.flow.FlowGroup");
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var SubtractionNode = dbm.importClass("com.developedbyme.flow.nodes.math.SubtractionNode");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var OneTouchOrMouseDetector = dbm.importClass("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector");
	var OptionSelector = dbm.importClass("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("com.developedbyme.projects.experiments.linearoptionselection.LinearOptionSelectionApplication::_init");
		
		this.superCall();
		
		this._options = new Array();
		this._addButton = null;
		this._touchDetector = null;
		
		this._showingItemIndex = -1;
		this._interactiveItemIndex = -1;
		this._touchStartItemIndex = -1;
		
		this._centerX = this.createProperty("centerX", 0);
		this._centerY = this.createProperty("centerY", 0);
		
		this._numberOfItems = this.createProperty("numberOfItems", 1);
		this._selectedItem = this.createProperty("selectedItem", 0);
		
		var positionOffsetNode = this.addDestroyableObject(SubtractionNode.create(this._numberOfItems, this._selectedItem));
		this._positionOffset = this.createProperty("positionOffset", positionOffsetNode.getProperty("outputValue"));
		
		this._spacing = this.createProperty("spacing", 330);
		
		this.addCssLink("../styles/utils/display.css");
		this.addCssLink("../styles/experiments/linearOptionSelection/main.css");
		
		//this._assetsLoader.addAssetsByPath();
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		
		//Center of page
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
	
		var scaleXNode = MultiplicationNode.create(windowSizeNode.getProperty("width"), 0.5);
		var scaleYNode = MultiplicationNode.create(windowSizeNode.getProperty("height"), 0.5);
	
		this._centerX.connectInput(scaleXNode.getProperty("outputValue"));
		this._centerY.connectInput(scaleYNode.getProperty("outputValue"));
		
		this._addButton = BaseButton.createDiv(dbm.getDocument(), true, {"class": "nextButton", "style": "position: absolute; left: 0px; top: 0px;"});
		this._addButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this._createNewOption, []));
		this._addButton.setElementAsTransformed();
		this._addButton.activate();
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		var buttonContent = htmlCreator.createDiv({"class": "content nonInteractive"},
			htmlCreator.createDiv({"class": "icon"}),
			htmlCreator.createDiv({"class": "text"},
				htmlCreator.createDiv({"class": "title"}, htmlCreator.createText("Select")),
				htmlCreator.createDiv({"class": "description"}, htmlCreator.createText("and move to next item"))
			)
		);
		this._addButton.getElement().appendChild(buttonContent);
		
		var buttonMultipledOffsetNode = MultiplicationNode.create(this._positionOffset, this._spacing);
		var buttonCenteredPositionNode = AdditionNode.create(this._centerX, buttonMultipledOffsetNode.getProperty("outputValue"));
		
		this._addButton.getProperty("x").connectInput(buttonCenteredPositionNode.getProperty("outputValue"));
		this._addButton.getProperty("y").connectInput(this._centerY);
		this._addButton.getProperty("display").startUpdating();
		
		this._createNewOption();
		
		this._touchDetector = OneTouchOrMouseDetector.create(dbm.getDocument().body);
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this._touchStarted, []));
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.UPDATE, CallFunctionCommand.createCommand(this, this._touchUpdate, []));
		this._touchDetector.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.END, CallFunctionCommand.createCommand(this, this._touchEnded, []));
		this._touchDetector.activate();
	};
	
	objectFunctions._changeShowingItem = function(aIndex, aDelay) {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.LinearOptionSelectionApplication::_changeShowingItem");
		//console.log(aIndex);
		
		if(aIndex === this._showingItemIndex) return;
		
		if(this._showingItemIndex !== -1) {
			this._options[this._showingItemIndex].hideOptions(0);
		}
		this._showingItemIndex = aIndex;
		if(this._showingItemIndex !== -1) {
			this._options[this._showingItemIndex].showOptions(aDelay);
		}
	};
	
	objectFunctions._createNewOption = function() {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.LinearOptionSelectionApplication::_createNewOption");
		
		var position = this._options.length;
		
		var newItem = OptionSelector.createDiv(dbm.getDocument(), true, {"style": "position: absolute; left: 0px; top: 0px;"});
		newItem.setOptionsData([
			"../assets/copyrightMaterial/car_640x360/car.001.jpg",
			"../assets/copyrightMaterial/car_640x360/car.002.jpg",
			"../assets/copyrightMaterial/car_640x360/car.003.jpg",
			"../assets/copyrightMaterial/car_640x360/car.004.jpg",
			"../assets/copyrightMaterial/car_640x360/car.005.jpg",
			"../assets/copyrightMaterial/car_640x360/car.006.jpg"
		]);
		newItem.setElementAsTransformed();
		newItem.enableAlpha();
		newItem.getProperty("width").setValue(320);
		newItem.getProperty("height").setValue(180);
		
		var offsetNode = SubtractionNode.create(position, this._selectedItem);
		var multipledOffsetNode = MultiplicationNode.create(offsetNode.getProperty("outputValue"), this._spacing);
		var centeredPositionNode = AdditionNode.create(this._centerX, multipledOffsetNode.getProperty("outputValue"));
		
		newItem.getProperty("x").connectInput(centeredPositionNode.getProperty("outputValue"));
		newItem.getProperty("y").connectInput(this._centerY);
		newItem.getProperty("alpha").setValue(0);
		newItem.getProperty("alpha").animateValue(1, 0.3, InterpolationTypes.INVERTED_QUADRATIC, 0.15);
		newItem.getProperty("scaleX").setValue(0.5);
		newItem.getProperty("scaleX").animateValue(1, 0.3, InterpolationTypes.INVERTED_QUADRATIC, 0.15);
		newItem.getProperty("scaleY").setValue(0.5);
		newItem.getProperty("scaleY").animateValue(1, 0.3, InterpolationTypes.INVERTED_QUADRATIC, 0.15);
		newItem.getProperty("display").startUpdating();
		newItem.getProperty("display").update();
		
		this._numberOfItems.animateValue(position+1, 0.3, InterpolationTypes.INVERTED_QUADRATIC, 0);
		this._selectedItem.animateValue(position, 0.3, InterpolationTypes.INVERTED_QUADRATIC, 0);
		
		this._options.push(newItem);
		
		this._changeShowingItem(position, 0.3);
	};
	
	objectFunctions._touchStarted = function() {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.LinearOptionSelectionApplication::_touchStarted");
		
		this._touchStartItemIndex = this._selectedItem.getValue();
		
		var touchPoint = this._touchDetector.getSelectionPoint();
		var x = touchPoint.getProperty("startX").getValue();
		
		var centerX = this._centerX.getValue();
		var spacing = this._spacing.getValue();
		var selectedItem = Math.round(this._touchStartItemIndex+(x-centerX)/spacing);
		
		var minItem = 0;
		var maxItem = this._options.length-1;
		
		if(selectedItem >= minItem && selectedItem <= maxItem) {
			this._interactiveItemIndex = selectedItem;
			this._changeShowingItem(this._interactiveItemIndex, 0);
			this._options[this._interactiveItemIndex].startMoving();
		}
		else {
			this._interactiveItemIndex = -1;
		}
	};
	
	objectFunctions._touchUpdate = function() {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.LinearOptionSelectionApplication::_touchUpdate");
		
		var touchPoint = this._touchDetector.getSelectionPoint();
		var x = touchPoint.getProperty("currentX").getValue()-touchPoint.getProperty("startX").getValue();
		var y = touchPoint.getProperty("currentY").getValue()-touchPoint.getProperty("startY").getValue();
		
		var spacing = this._spacing.getValue();
		var selectedItem = this._touchStartItemIndex-x/spacing;
		
		var minItem = 0;
		var maxItem = this._options.length-1;
		
		if(selectedItem < minItem) {
			selectedItem = 0.5*(selectedItem+minItem);
		}
		if(selectedItem > maxItem) {
			selectedItem = 0.5*(selectedItem+maxItem);
		}
		
		this._selectedItem.setValue(selectedItem);
		
		if(this._interactiveItemIndex !== -1) {
			this._options[this._interactiveItemIndex].updateMoving(y);
		}
	};
	
	objectFunctions._touchEnded = function() {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.LinearOptionSelectionApplication::_touchEnded");
		
		var touchPoint = this._touchDetector.getSelectionPoint();
		var x = touchPoint.getProperty("currentX").getValue()-touchPoint.getProperty("startX").getValue();
		var y = touchPoint.getProperty("currentY").getValue()-touchPoint.getProperty("startY").getValue();
		
		var spacing = this._spacing.getValue();
		var selectedItem = this._touchStartItemIndex-x/spacing;
		
		var minItem = 0;
		var maxItem = this._options.length-1;
		
		if(this._interactiveItemIndex !== -1) {
			this._options[this._interactiveItemIndex].stopMoving(y);
		}
		
		if(selectedItem < minItem) {
			this._selectedItem.animateValue(minItem, 0.3, InterpolationTypes.QUADRATIC, 0);
			this._changeShowingItem(minItem, 0);
		}
		else if(selectedItem > maxItem) {
			this._selectedItem.animateValue(maxItem, 0.3, InterpolationTypes.QUADRATIC, 0);
			this._changeShowingItem(maxItem, 0);
		}
		else if(x !== 0) {
			this._selectedItem.animateValue(Math.round(selectedItem), 0.3, InterpolationTypes.INVERTED_QUADRATIC, 0);
			this._changeShowingItem(Math.round(selectedItem), 0);
		}
		
		this._touchStartItemIndex = -1;
		this._interactiveItemIndex = -1;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});