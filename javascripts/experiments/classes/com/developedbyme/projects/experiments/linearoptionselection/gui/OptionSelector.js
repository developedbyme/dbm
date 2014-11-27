/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector");
	//"use strict";
	
	//Self reference
	var OptionSelector = dbm.importClass("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var CircularDistanceNode = dbm.importClass("com.developedbyme.flow.nodes.math.CircularDistanceNode");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	
	//Utils
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector::_init");
		
		this.superCall();
		
		this.setElementAsSized();
		
		this._moveSpeed = this.createProperty("moveSpeed", 4);
		this._envelope = this.createProperty("envelope", 0);
		this._selectedItem = this.createProperty("selectedItem", 0);
		this._numberOfItems = this.createProperty("numberOfItems", 0);
		this.closeButton = null;
		
		this._startMovingItemIndex = -1;
		
		this._optionsData = null;
		this._options = null;
		this._selectedOption = null;
		
		this._spacing = this.createProperty("spacing", 190);
		
		var scaleXNode = MultiplicationNode.create(this.getProperty("width"), 0.5);
		var scaleYNode = MultiplicationNode.create(this.getProperty("height"), 0.5);
	
		this._centerX = this.createProperty("centerX", scaleXNode.getProperty("outputValue"));
		this._centerY = this.createProperty("centerY", scaleYNode.getProperty("outputValue"));
		
		return this;
	};
	
	objectFunctions.setOptionsData = function(aDataArray) {
		this._optionsData = aDataArray;
		this._options = new Array(aDataArray.length);
		this._numberOfItems.setValue(aDataArray.length);
	};
	
	objectFunctions._createOption = function(aData, aIndex) {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector::_createOption");
		
		var newItem = DisplayBaseObject.createDiv(this.getElement(), true, {"style": "position: absolute; left: 0px; top: 0px; border: 1px solid #000000;"});
		newItem.setElementAsTransformed();
		newItem.setElementAsSized();
		newItem.enableAlpha();
		newItem.getProperty("width").setValue(320);
		newItem.getProperty("height").setValue(180);
		
		
		var offsetNode = CircularDistanceNode.create(aIndex, this._selectedItem, this._numberOfItems);
		
		var multipledOffsetNode = MultiplicationNode.create(offsetNode.getProperty("outputValue"), this._spacing);
		var envelopedPosition = MultiplicationNode.create(multipledOffsetNode.getProperty("outputValue"), this._envelope);
		var centeredPositionNode = AdditionNode.create(this._centerY, envelopedPosition.getProperty("outputValue"));
		
		newItem.getProperty("x").connectInput(this._centerX);
		newItem.getProperty("y").connectInput(centeredPositionNode.getProperty("outputValue"));
		
		newItem.getProperty("display").startUpdating();
		newItem.getProperty("display").update();
		
		return newItem;
	};
	
	objectFunctions._createOptions = function() {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector::_createOptions");
		var currentArray = this._optionsData;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(!VariableAliases.isSet(this._options[i])) {
				this._options[i] = this._createOption(currentArray[i], i);
			}
		}
	}
	
	objectFunctions.showOptions = function(aDelay) {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector::showOptions");
		
		this._createOptions();
		
		this._envelope.animateValue(1, 0.3, InterpolationTypes.INVERTED_QUADRATIC, aDelay);
	};
	
	objectFunctions.hideOptions = function(aDelay) {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector::hideOptions");
		
		this._envelope.animateValue(0, 0.3, InterpolationTypes.INVERTED_QUADRATIC, aDelay);
	};
	
	objectFunctions.startMoving = function() {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector::startMoving");
		
		this._startMovingItemIndex = this._selectedItem.getValue();
	};
	
	objectFunctions.updateMoving = function(aLength) {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector::updateMoving");
		
		var newItemIndex = this._startMovingItemIndex-this._moveSpeed.getValue()*aLength/this._spacing.getValue();
		
		this._selectedItem.setValue(newItemIndex);
	};
	
	objectFunctions.stopMoving = function(aLength) {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector::stopMoving");
		
		var newItemIndex = Math.round(this._startMovingItemIndex-this._moveSpeed.getValue()*aLength/this._spacing.getValue());
		
		this._selectedItem.animateValue(newItemIndex, 0.3, InterpolationTypes.INVERTED_QUADRATIC, 0);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
		
		this._selectedItem = null;
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aElement	Element		The view for the new object.
	 *
	 * @return	OptionSelector	The newly created object.
	 */
	staticFunctions.create = function(aElement) {
		//console.log("com.developedbyme.projects.experiments.linearoptionselection.gui.OptionSelector::create");
		//console.log(aElement);
		
		return ClassReference._createAndInitClassWithElement(ClassReference, aElement);
	};
	
	/**
	 * Creates a new object of this class, using the master HtmlCreator to create a new div for the view.
	 *
	 * @param	aAttributes		Object	The attriburtes to add to the new div.
	 *
	 * @return	OptionSelector	The newly created object.
	 */
	staticFunctions.createNewDiv = function(aAttributes) {
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		return ClassReference._createAndInitClassWithElement(ClassReference, htmlCreator.createDiv(aAttributes));
	};
	
	/**
	 * Creates a new object of this class, and a new div on a parent element.
	 *
	 * @param	aParentOrDocument	Element|Document	The parent or document to create the new di in.
	 * @param	aAddToParent		Boolean				If the element should be added to the DOM.
	 * @param	aAttributes			Object				The attriburtes to add to the new div.
	 *
	 * @return	OptionSelector	The newly created object.
	 */
	staticFunctions.createDiv = function(aParentOrDocument, aAddToParent, aAttributes) {
		return ClassReference.createNode("div", aParentOrDocument, aAddToParent, aAttributes);
	};
	
	/**
	 * Creates a new object of this class, and a new node on a parent element.
	 *
	 * @param	aType				String				The type of node to create.
	 * @param	aParentOrDocument	Element|Document	The parent or document to create the new di in.
	 * @param	aAddToParent		Boolean				If the element should be added to the DOM.
	 * @param	aAttributes			Object				The attriburtes to add to the new div.
	 *
	 * @return	OptionSelector	The newly created object.
	 */
	staticFunctions.createNode = function(aType, aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = ClassReference._createAndInitClass(ClassReference);
		
		newNode.setParent(DomReferenceFunctions.getDocumentVisualParent(aParentOrDocument));
		newNode.setElement(newNode.getHtmlCreator().createNode(aType, aAttributes));
		
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});