/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for all objects that has an element representation in the DOM.
 */
dbm.registerClass("dbm.gui.DisplayBaseObject", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.DisplayBaseObject");
	//"use strict";
	
	//Self reference
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var ExternalCssVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalCssVariableProperty");
	var ExternalPrefixedCssVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalPrefixedCssVariableProperty");
	var TransformElementNode = dbm.importClass("dbm.flow.nodes.display.TransformElementNode");
	var SetElementToCssPropertiesNode = dbm.importClass("dbm.flow.nodes.internal.SetElementToCssPropertiesNode");
	var RoundNode = dbm.importClass("dbm.flow.nodes.math.round.RoundNode");
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	
	//Utils
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	var CssFunctions = dbm.importClass("dbm.utils.css.CssFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var DomManipulationFunctions = dbm.importClass("dbm.utils.htmldom.DomManipulationFunctions");
	
	//Constants
	var UnitTypes = dbm.importClass("dbm.constants.UnitTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.DisplayBaseObject::_init");
		
		this.superCall();
		
		this._element = this.createProperty("element", null);
		this._parentElement = this.createProperty("parentElement", null);
		this._inDom = this.createProperty("inDom", false);
		this._inDomOutput = this.createProperty("inDomOutput", false);
		
		this._display = this.addProperty("display", AnyChangeMultipleInputProperty.create());
		this._display.connectInput(this._inDomOutput);
		
		this.createUpdateFunctionWithArguments("inDomUpdate", DomManipulationFunctions.setElementDomStatus, [this._element, this._parentElement, this._inDom], [this._inDomOutput]);
		
		return this;
	};
	
	/**
	 * Sets the view (Element) for this object.
	 *
	 * @param	aElement	Element		The view for this object.
	 *
	 * @return	self
	 */
	objectFunctions.setElement = function(aElement) {
		//console.log("dbm.gui.DisplayBaseObject::setElement");
		if(aElement === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setElement", "Trying to set element to null. Use removeElement() to remove element.");
			this.removeElement();
			return this;
		}
		else if(this._element.getValue() !== null) {
			this.removeElement();
		}
		
		this._element.setValue(aElement);
		
		if(aElement.parentNode !== null) { //MENOTE: should this check for having another parent set already?
			this._parentElement.setValue(aElement.parentNode);
			this._inDom.setValue(true);
		}
		this._inDomOutput.update();
		
		if(dbm.singletons.dbmHtmlDomManager !== undefined) {
			dbm.singletons.dbmHtmlDomManager.addDisplayObject(this, aElement);
		}
		
		return this;
	};
	
	/**
	 * Removes the view for this object
	 *
	 * @return	self
	 */
	objectFunctions.removeElement = function() {
		//console.log("dbm.gui.DisplayBaseObject::removeElement");
		
		var currentElement = this.getElement();
		if(currentElement !== null && currentElement.parentNode !== null) {
			currentElement.parentNode.removeChild(currentElement);
		}
		
		if(dbm.singletons.dbmHtmlDomManager !== undefined) {
			dbm.singletons.dbmHtmlDomManager.removeHtmlElement(this.getElement());
		}
		
		this._element.setValue(null);
		this._inDomOutput.update();
		
		return this;
	};
	
	/**
	 * Gets the view for this object.
	 *
	 * @return	Element		The view for this object.
	 */
	objectFunctions.getElement = function() {
		return this._element.getValue();
	};
	
	/**
	 * Adds properties x and y to control the css for left and top.
	 *
	 * @return	self
	 */
	objectFunctions.setElementAsPositioned = function() {
		
		this.createRoundedCssProperty("x", "roundedX", "left", UnitTypes.PX, 0);
		this.createRoundedCssProperty("y", "roundedY", "top", UnitTypes.PX, 0);
		
		return this;
	};
	
	/**
	 * Adds properties to control the css transform of this object.
	 *
	 * @return	self
	 */
	objectFunctions.setElementAsTransformed = function() {
		
		var x = this.createProperty("x", 0);
		var y = this.createProperty("y", 0);
		var scaleX = this.createProperty("scaleX", 1);
		var scaleY = this.createProperty("scaleY", 1);
		var rotate = this.createProperty("rotate", 0);
		var pivotX = this.createProperty("pivotX", 0.5);
		var pivotY = this.createProperty("pivotY", 0.5);
		
		var placementNode = TransformElementNode.create(this._element, x, y, scaleX, scaleY, rotate, pivotX, pivotY);
		this._display.connectInput(placementNode.getProperty("display"));
		this.addDestroyableObject(placementNode);
		
		return this;
	};
	
	/**
	 * Adds properties width and height to control the css for size.
	 *
	 * @return	self
	 */
	objectFunctions.setElementAsSized = function() {
		
		this.createCssProperty("width", "width", UnitTypes.PX, null);
		this.createCssProperty("height", "height", UnitTypes.PX, null);
		
		return this;
	};
	
	/**
	 * Sets the parent of this object.
	 *
	 * @param	aElement	Element|DisplayBaseObject	The parent of this object.
	 *
	 * @return	self
	 */
	objectFunctions.setParent = function(aElement) {
		
		if(aElement instanceof DisplayBaseObject) {
			this.setPropertyInput("parentElement", aElement.getProperty("element"));
		}
		else {
			this.setPropertyInput("parentElement", aElement);
		}
		
		return this;
	};
	
	/**
	 * Sets the parent of this object and adds the view to DOM.
	 *
	 * @param	aElement	Element|DisplayBaseObject	The parent of this object.
	 *
	 * @return	self
	 */
	objectFunctions.addToParent = function(aElement) {
		this.setParent(aElement);
		this.addToDom();
		
		return this;
	};
	
	/**
	 * Adds the view to the DOM. This function can be called before either the lement or the parent is set.
	 *
	 * @return	self
	 */
	objectFunctions.addToDom = function() {
		//console.log("dbm.core.FlowBaseObject::addToDom");
		//console.log(this._element.getValue());
		
		this._inDom.setValue(true);
		this._inDomOutput.update();
		
		return this;
	};
	
	/**
	 * Removes the view from the DOM. This function can be called before either the lement or the parent is set.
	 *
	 * @return	self
	 */
	objectFunctions.removeFromDom = function() {
		
		this._inDom.setValue(false);
		this._inDomOutput.update();
		
		return this;
	};
	
	/**
	 * Sets a css style property on the element of this object.
	 *
	 * @param	aStyleProperty	String	The name of the property to set.
	 * @param	aValue			*		The value to set the property to.
	 *
	 * @return	self
	 */
	objectFunctions.setStyleProperty = function(aStyleProperty, aValue) {
		
		this._element.getValue().style.setProperty(aStyleProperty, aValue, "");
		
		return this;
	};
	
	/**
	 * Removes a css style property from the element of this object.
	 *
	 * @param	aStyleProperty	String	The name of the property to remove.
	 *
	 * @return	self
	 */
	objectFunctions.removeStyleProperty = function(aStyleProperty) {
		
		this._element.getValue().style.removeProperty(aStyleProperty);
		
		return this;
	};
	
	/**
	 * Adds a property (alpha) to control the css opacity.
	 *
	 * @return	self
	 */
	objectFunctions.enableAlpha = function() {
		this.createCssProperty("alpha", "opacity", null, 1);
		
		return this;
	};
	
	/**
	 * Adds a property (z) to control the css z-index.
	 *
	 * @return	self
	 */
	objectFunctions.enableZIndex = function() {
		this.createRoundedCssProperty("z", "roundedZ", "z-index", null, 0);
		
		return this;
	};
	
	/**
	 * Creates a property that controls a css style property after being rounded.
	 *
	 * @param	aName			String		The name of the new property.
	 * @param	aRoundedName	String		The name of the rounded value property.
	 * @param	aCssProperty	String		The name of the css style property to set.
	 * @param	aUnit			UnitTypes	The unit for the css style property. (Optional, default UnitTypes.PX)
	 * @param	aDefaultValue	*			The default value. (Optional)
	 *
	 * @return	ExternalCssVariableProperty		The newly created property.
	 */
	objectFunctions.createRoundedCssProperty = function(aName, aRoundedName, aCssProperty, aUnit, aDefaultValue) {
		var inputProperty = this.createProperty(aName, aDefaultValue);
		var roundedProperty = this.createCssProperty(aRoundedName, aCssProperty, aUnit, aDefaultValue);
		
		var roundNode = this.addDestroyableObject(RoundNode.create(inputProperty));
		roundedProperty.connectInput(roundNode.getProperty("outputValue"));
		
		return inputProperty;
	};
	
	/**
	 * Creates a property that controls a css style property.
	 *
	 * @param	aName			String		The name of the new property.
	 * @param	aCssProperty	String		The name of the css style property to set.
	 * @param	aUnit			UnitTypes	The unit for the css style property. (Optional, default UnitTypes.PX)
	 * @param	aDefaultValue	*			The default value. (Optional)
	 *
	 * @return	ExternalCssVariableProperty		The newly created property.
	 */
	objectFunctions.createCssProperty = function(aName, aCssProperty, aUnit, aDefaultValue) {
		if(!VariableAliases.isSet(aUnit)) {
			aUnit = CssFunctions.isLengthProperty(aCssProperty) ? UnitTypes.PX : null;
		}
		aDefaultValue = VariableAliases.valueWithDefault(aDefaultValue, null);
		
		var newProperty;
		if(CssFunctions.isPrefixedProperty(aCssProperty)) {
			newProperty = ExternalPrefixedCssVariableProperty.createWithoutExternalObject();
		}
		else {
			newProperty = ExternalCssVariableProperty.createWithoutExternalObject();
		}
		
		newProperty.setup(aCssProperty, aUnit, aDefaultValue);
		this.addProperty(aName, newProperty);
		this._display.connectInput(newProperty);
		
		var setElementNode = SetElementToCssPropertiesNode.create(this._element).addUpdateProperty(newProperty);
		this._display.connectInput(setElementNode.getProperty("elementSet"));
		this.addDestroyableObject(setElementNode);
		
		return newProperty;
	};
	
	/**
	 * Gets the HtmlCreator that can generate new elements in the same document as this object.
	 *
	 * @return	HtmlCreator		The HtmlCreator for the document that this object is located in. Null if this object doesn't have either element or parent.
	 */
	objectFunctions.getHtmlCreator = function() {
		//console.log("dbm.core.FlowBaseObject::getHtmlCreator");
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
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		
		if(this._inDom !== null && this._inDom.getValue()) {
			this.removeFromDom();
		}
		
		this.superCall();
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._element = null;
		this._parentElement = null;
		this._inDom = null;
		this._inDomOutput = null;
		this._display = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of a class and sets an element as the view.
	 *
	 * @param	aClass		Function	The class constructor function.
	 * @param	aElement	Element		The view for the new object.
	 *
	 * @return	*	The newly created object of the class.
	 */
	staticFunctions._createAndInitClassWithElement = function(aClass, aElement) {
		return ClassReference._createAndInitClass(aClass).setElement(aElement);
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aElement	Element		The view for the new object.
	 *
	 * @return	DisplayBaseObject	The newly created object.
	 */
	staticFunctions.create = function(aElement) {
		//console.log("dbm.gui.DisplayBaseObject::create");
		//console.log(aElement);
		
		return ClassReference._createAndInitClassWithElement(ClassReference, aElement);
	};
	
	/**
	 * Creates a new object of this class, using the master HtmlCreator to create a new div for the view.
	 *
	 * @param	aAttributes		Object	The attriburtes to add to the new div.
	 *
	 * @return	DisplayBaseObject	The newly created object.
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
	 * @return	DisplayBaseObject	The newly created object.
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
	 * @return	DisplayBaseObject	The newly created object.
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