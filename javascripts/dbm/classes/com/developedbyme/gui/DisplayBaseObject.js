dbm.registerClass("com.developedbyme.gui.DisplayBaseObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var PlaceHtmlElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.PlaceElementNode");
	var ExternalCssVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalCssVariableProperty");
	var TransformElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.TransformElementNode");
	
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.gui.DisplayBaseObject::init");
		
		this.superCall();
		
		this._placementNode = null;
		
		this._alpha = this.addProperty("alpha", ExternalCssVariableProperty.createWithoutExternalObject(this._objectProperty));
		
		this._element = this.createProperty("element", null);
		this._parentElement = this.createProperty("parentElement", null);
		this._inDom = this.createProperty("inDom", false);
		
		this._inDomUpdate = this.createGhostProperty("inDomUpdate");
		this._display = this.createGhostProperty("display");
		
		this.createUpdateFunction("inDomUpdate", this._updateInDomFlow, [this._element, this._parentElement, this._inDom], [this._inDomUpdate]);
		this.createUpdateFunction("display", this._updateDisplayFlow, [this._inDomUpdate, this._alpha], [this._display]);
		
		return this;
	};
	
	objectFunctions._connectObjectToOpacity = function() {
		this._alpha.setupExternalObject(this._element.getValue(), "opacity", null, 1);
	};
	
	objectFunctions._updateInDomFlow = function(aFlowUpdateNumber) {
		var element = this._element.getValueWithoutFlow();
		var parentElement = this._parentElement.getValueWithoutFlow();
		if(element != null && parentElement != null) {
			var inDom = this._inDom.getValueWithoutFlow();
			if(inDom) {
				if(element.parentNode != parentElement) {
					if(parentElement.ownerDocument != element.ownerDocument) {
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
				if(element.parentNode != null) {
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
		if(aElement == null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setElement", "Trying to set element to null. Use removeElement() to remove element.");
			this.removeElement();
			return;
		}
		else if(this._element.getValue() != null) {
			this.removeElement();
		}
		
		this._element.setValue(aElement);
		
		if(aElement.parentNode != null) {
			this._parentElement.setValue(aElement.parentNode);
			this._inDom.setValue(true);
		}
		else if(this._inDom.getValue() && this._parentElement.getValue() != null) {
			this._parentElement.getValue().appendChild(aElement);
		}
		
		if(dbm.singletons.dbmHtmlDomManager != undefined) {
			dbm.singletons.dbmHtmlDomManager.addDisplayObject(this, aElement);
		}
		
		if(this._placementNode != null) {
			this._placementNode.getProperty("element").setValue(this._element);
			this._updateFunctions.getObject("display").addInputConnection(this._placementNode.getProperty("display"));
		}
		else {
			//METODO: browser prefixes
			var transformCssValue = aElement.style.getPropertyValue("transform");
			if(transformCssValue != null) {
				//METODO: create transform node
			}
		}
		
		this._connectObjectToOpacity();
		
		return this;
	};
	
	objectFunctions.removeElement = function() {
		//console.log("com.developedbyme.gui.DisplayBaseObject::removeElement");
		
		var currentElement = this.getElement();
		if(currentElement != null && currentElement.parentNode != null) {
			currentElement.parentNode.removeChild(currentElement);
		}
		
		if(dbm.singletons.dbmHtmlDomManager != undefined) {
			dbm.singletons.dbmHtmlDomManager.removeHtmlElement(this.getElement());
		}
		
		this._element.setValue(null);
		
		if(this._placementNode != null) {
			this._placementNode.getProperty("display").disconnectOutput();
		}
		
		return this;
	};
	
	objectFunctions.getElement = function() {
		return this._element.getValue();
	};
	
	objectFunctions.setElementAsPositioned = function() {
		
		this._placementNode = PlaceHtmlElementNode.create(this._element);
		this._updateFunctions.getObject("display").addInputConnection(this._placementNode.getProperty("display"));
		this.addDestroyableObject(this._placementNode);
		
		return this;
	};
	
	objectFunctions.setElementAsTransformed = function() {
		
		this._placementNode = TransformElementNode.create(this._element);
		this._updateFunctions.getObject("display").addInputConnection(this._placementNode.getProperty("display"));
		this.addDestroyableObject(this._placementNode);
		
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
	}
	
	objectFunctions.addToParent = function(aElement) {
		this.setParent(aElement);
		this.addToDom();
		
		return this;
	}
	
	objectFunctions.addToDom = function() {
		//console.log("com.developedbyme.core.FlowBaseObject::addToDom");
		//console.log(this._element.getValue());
		
		this._inDom.setValue(true);
		this._inDomUpdate.update();
		
		return this;
	}
	
	objectFunctions.removeFromDom = function() {
		
		this._inDom.setValue(false);
		this._inDomUpdate.update();
		
		return this;
	}
	
	objectFunctions.setStyleProperty = function(aStyleProperty, aValue) {
		
		this._element.getValue().style.setProperty(aStyleProperty, aValue, "");
		
		return this;
	};
	
	objectFunctions.removeStyleProperty = function(aStyleProperty) {
		
		this._element.getValue().style.removeProperty(aStyleProperty);
		
		return this;
	};
	
	objectFunctions.getProperty = function(aName) {
		//console.log("com.developedbyme.core.FlowBaseObject::getProperty");
		
		switch(aName) {
			case "x":
			case "y":
			case "z":
			case "width":
			case "height":
			case "scaleX":
			case "scaleY":
			case "rotate":
			case "pivotX":
			case "pivotY":
			case "cssDisplay":
				if(this._placementNode != null) {
					return this._placementNode.getProperty(aName);
				}
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getProperty", "Object " + this + " is not placed, can't get property " + aName + ".");
				return null;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.getHtmlCreator = function() {
		//console.log("com.developedbyme.core.FlowBaseObject::getHtmlCreator");
		var element = this._element.getValue();
		var parentElement = this._parentElement.getValue();
		if(element != null) {
			return dbm.singletons.dbmHtmlDomManager.getHtmlCreator(DomReferenceFunctions.getDocument(element));
		}
		else if(parentElement != null) {
			return dbm.singletons.dbmHtmlDomManager.getHtmlCreator(DomReferenceFunctions.getDocument(parentElement));
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getHtmlCreator", "Element or parent must be set before getting the html creator.");
		return null;
	};
	
	objectFunctions.performDestroy = function() {
		
		if(this._inDom != null && this._inDom.getValue()) {
			this.removeFromDom();
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._placementNode = null;
		
		this._element = null;
		this._parentElement = null;
		this._inDom = null;
		this._alpha = null;
		this._inDomUpdate = null;
		this._display = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		
		newNode.setElement(aElement);
		
		return newNode;
	};
	
	staticFunctions.createNewDiv = function(aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		newNode.setElement(htmlCreator.createDiv(aAttributes));
		
		return newNode;
	};
	
	staticFunctions.createDiv = function(aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theParent = DomReferenceFunctions.getDocumentVisualParent(aParentOrDocument);
		
		newNode.setParent(theParent);
		
		var htmlCreator = newNode.getHtmlCreator();
		
		newNode.setElement(htmlCreator.createDiv(aAttributes));
		
		if(aAddToParent != false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});