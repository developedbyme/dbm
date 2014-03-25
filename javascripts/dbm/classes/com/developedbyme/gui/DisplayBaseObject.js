/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.gui.DisplayBaseObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.DisplayBaseObject");
	//"use strict";
	
	//Self reference
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ExternalCssVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalCssVariableProperty");
	var ExternalPrefixedCssVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalPrefixedCssVariableProperty");
	var TransformElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.TransformElementNode");
	var SetElementToCssPropertiesNode = dbm.importClass("com.developedbyme.flow.nodes.internal.SetElementToCssPropertiesNode");
	var RoundNode = dbm.importClass("com.developedbyme.flow.nodes.math.round.RoundNode");
	
	//Utils
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	var CssFunctions = dbm.importClass("com.developedbyme.utils.css.CssFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var UnitTypes = dbm.importClass("com.developedbyme.constants.UnitTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.DisplayBaseObject::_init");
		
		this.superCall();
		
		this._element = this.createProperty("element", null);
		this._parentElement = this.createProperty("parentElement", null);
		this._inDom = this.createProperty("inDom", false);
		this._inDomOutput = this.createProperty("inDomOutput", false);
		
		this._display = this.createGhostProperty("display");
		
		this.createUpdateFunction("inDomUpdate", this._updateInDomFlow, [this._element, this._parentElement, this._inDom], [this._inDomOutput]);
		this.createUpdateFunction("display", this._updateDisplayFlow, [this._inDomOutput], [this._display]);
		
		return this;
	};
	
	objectFunctions._updateInDomFlow = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.gui.DisplayBaseObject::_updateInDomFlow");
		var element = this._element.getValueWithoutFlow();
		var parentElement = this._parentElement.getValueWithoutFlow();
		if(element !== null && parentElement !== null) {
			var inDom = this._inDom.getValueWithoutFlow();
			this._inDomOutput.setValueWithFlow(inDom, aFlowUpdateNumber);
			if(inDom) {
				if(element.parentNode !== parentElement) {
					if(parentElement.ownerDocument !== element.ownerDocument) {
						try{
							//console.log("com.developedbyme.gui.DisplayBaseObject::_updateInDomFlow");
							//console.log(element);
							parentElement.ownerDocument.adoptNode(element);
						}
						catch(theError) {
							ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_updateInDomFlowFlow", "Un error occured while adopting node.");
							ErrorManager.getInstance().reportError(this, "_updateInDomFlowFlow", theError);
							return;
						}
					}
					
					try{
						parentElement.appendChild(element);
					}
					catch(theError) {
						ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_updateInDomFlowFlow", "Un error occured while adding to dom.");
						ErrorManager.getInstance().reportError(this, "_updateInDomFlowFlow", theError);
						return;
					}
				}
			}
			else {
				if(element.parentNode !== null) {
					try{
						element.parentNode.removeChild(element);
					}
					catch(theError) {
						ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_updateInDomFlowFlow", "Un error occured while removing from dom.");
						ErrorManager.getInstance().reportError(this, "_updateInDomFlowFlow", theError);
						return;
					}
				}
			}
		}
	};
	
	objectFunctions._updateDisplayFlow = function(aFlowUpdateNumber) {
		//MENOTE: should be overridden
	};
	
	objectFunctions.setElement = function(aElement) {
		//console.log("com.developedbyme.gui.DisplayBaseObject::setElement");
		if(aElement === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setElement", "Trying to set element to null. Use removeElement() to remove element.");
			this.removeElement();
			return;
		}
		else if(this._element.getValue() !== null) {
			this.removeElement();
		}
		
		this._element.setValue(aElement);
		
		if(aElement.parentNode !== null) {
			this._parentElement.setValue(aElement.parentNode);
			this._inDom.setValue(true);
		}
		else if(this._inDom.getValue() && this._parentElement.getValue() !== null) {
			this._parentElement.getValue().appendChild(aElement);
		}
		
		if(dbm.singletons.dbmHtmlDomManager !== undefined) {
			dbm.singletons.dbmHtmlDomManager.addDisplayObject(this, aElement);
		}
		
		return this;
	};
	
	objectFunctions.removeElement = function() {
		//console.log("com.developedbyme.gui.DisplayBaseObject::removeElement");
		
		var currentElement = this.getElement();
		if(currentElement !== null && currentElement.parentNode !== null) {
			currentElement.parentNode.removeChild(currentElement);
		}
		
		if(dbm.singletons.dbmHtmlDomManager !== undefined) {
			dbm.singletons.dbmHtmlDomManager.removeHtmlElement(this.getElement());
		}
		
		this._element.setValue(null);
		
		return this;
	};
	
	objectFunctions.getElement = function() {
		return this._element.getValue();
	};
	
	objectFunctions.setElementAsPositioned = function() {
		
		this.createRoundedCssProperty("x", "roundedX", "left", UnitTypes.PX, 0);
		this.createRoundedCssProperty("y", "roundedY", "top", UnitTypes.PX, 0);
		
		return this;
	};
	
	objectFunctions.setElementAsTransformed = function() {
		
		var x = this.createProperty("x", 0);
		var y = this.createProperty("y", 0);
		var scaleX = this.createProperty("scaleX", 1);
		var scaleY = this.createProperty("scaleY", 1);
		var rotate = this.createProperty("rotate", 0);
		var pivotX = this.createProperty("pivotX", 0.5);
		var pivotY = this.createProperty("pivotY", 0.5);
		
		var placementNode = TransformElementNode.create(this._element, x, y, scaleX, scaleY, rotate, pivotX, pivotY);
		this._updateFunctions.getObject("display").addInputConnection(placementNode.getProperty("display"));
		this.addDestroyableObject(placementNode);
		
		return this;
	};
	
	objectFunctions.setElementAsSized = function() {
		
		this.createCssProperty("width", "width", UnitTypes.PX, null);
		this.createCssProperty("height", "height", UnitTypes.PX, null);
		
		return this;
	};
	
	objectFunctions.setParent = function(aElement) {
		
		if(aElement instanceof DisplayBaseObject) {
			this.setPropertyInput("parentElement", aElement.getProperty("element"));
		}
		else {
			this.setPropertyInput("parentElement", aElement);
		}
		
		return this;
	};
	
	objectFunctions.addToParent = function(aElement) {
		this.setParent(aElement);
		this.addToDom();
		
		return this;
	};
	
	objectFunctions.addToDom = function() {
		//console.log("com.developedbyme.core.FlowBaseObject::addToDom");
		//console.log(this._element.getValue());
		
		this._inDom.setValue(true);
		this._inDomOutput.update();
		
		return this;
	};
	
	objectFunctions.removeFromDom = function() {
		
		this._inDom.setValue(false);
		this._inDomOutput.update();
		
		return this;
	};
	
	objectFunctions.setStyleProperty = function(aStyleProperty, aValue) {
		
		this._element.getValue().style.setProperty(aStyleProperty, aValue, "");
		
		return this;
	};
	
	objectFunctions.removeStyleProperty = function(aStyleProperty) {
		
		this._element.getValue().style.removeProperty(aStyleProperty);
		
		return this;
	};
	
	objectFunctions.enableAlpha = function() {
		this.createCssProperty("alpha", "opacity", null, 1);
		
		return this;
	};
	
	objectFunctions.enableZIndex = function() {
		this.createRoundedCssProperty("z", "roundedZ", "z-index", null, 0);
		
		return this;
	};
	
	objectFunctions.createRoundedCssProperty = function(aName, aRoundedName, aCssProperty, aUnit, aDefaultValue) {
		var inputProperty = this.createProperty(aName, aDefaultValue);
		var roundedProperty = this.createCssProperty(aRoundedName, aCssProperty, aUnit, aDefaultValue);
		
		var roundNode = this.addDestroyableObject(RoundNode.create(inputProperty));
		roundedProperty.connectInput(roundNode.getProperty("outputValue"));
		
		return inputProperty;
	};
	
	objectFunctions.createCssProperty = function(aName, aCssProperty, aUnit, aDefaultValue) {
		if(!VariableAliases.isSet(aUnit)) {
			aUnit = CssFunctions.isLengthProperty(aCssProperty) ? UnitTypes.PX : null;
		}
		aDefaultValue = VariableAliases.valueWithDefault(aDefaultValue, null);
		
		var newProperty;
		if(CssFunctions.isPrefixedProperty(aCssProperty)) {
			newProperty = ExternalPrefixedCssVariableProperty.createWithoutExternalObject(this._objectProperty);
		}
		else {
			newProperty = ExternalCssVariableProperty.createWithoutExternalObject(this._objectProperty);
		}
		
		newProperty.setup(aCssProperty, aUnit, aDefaultValue);
		this.addProperty(aName, newProperty);
		this._updateFunctions.getObject("display").addInputConnection(newProperty);
		
		var setElementNode = SetElementToCssPropertiesNode.create(this._element).addUpdateProperty(newProperty);
		this._updateFunctions.getObject("display").addInputConnection(setElementNode.getProperty("elementSet"));
		this.addDestroyableObject(setElementNode);
		
		return newProperty;
	};
	
	objectFunctions.getHtmlCreator = function() {
		//console.log("com.developedbyme.core.FlowBaseObject::getHtmlCreator");
		var element = this._element.getValue();
		if(element !== null) {
			return dbm.singletons.dbmHtmlDomManager.getHtmlCreator(DomReferenceFunctions.getDocument(element));
		}
		
		var parentElement = this._parentElement.getValue();
		if(parentElement !== null) {
			return dbm.singletons.dbmHtmlDomManager.getHtmlCreator(DomReferenceFunctions.getDocument(parentElement));
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getHtmlCreator", "Element or parent must be set before getting the html creator.");
		return null;
	};
	
	objectFunctions.performDestroy = function() {
		
		if(this._inDom !== null && this._inDom.getValue()) {
			this.removeFromDom();
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._element = null;
		this._parentElement = null;
		this._inDom = null;
		this._inDomOutput = null;
		this._display = null;
		
		this.superCall();
	};
	
	staticFunctions._createAndInitClassWithElement = function(aClass, aElement) {
		return ClassReference._createAndInitClass(aClass).setElement(aElement);
	};
	
	staticFunctions.create = function(aElement) {
		//console.log("com.developedbyme.gui.DisplayBaseObject::create");
		//console.log(aElement);
		
		return ClassReference._createAndInitClassWithElement(ClassReference, aElement);
	};
	
	staticFunctions.createNewDiv = function(aAttributes) {
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		return ClassReference._createAndInitClassWithElement(ClassReference, htmlCreator.createDiv(aAttributes));
	};
	
	staticFunctions.createDiv = function(aParentOrDocument, aAddToParent, aAttributes) {
		
		return ClassReference.createNode("div", aParentOrDocument, aAddToParent, aAttributes);
	};
	
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