dbm.registerClass("com.developedbyme.gui.DisplayBaseObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var PlaceHtmlElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.PlaceElementNode");
	
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.gui.DisplayBaseObject::init");
		
		this.superCall();
		
		this._htmlElement = null;
		this._parentHtmlElement = null;
		this._placementNode = null;
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		//console.log("com.developedbyme.gui.DisplayBaseObject::setElement");
		if(aElement == null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setElement", "Trying to set element to null. Use removeElement() to remove element.");
			this.removeElement();
			return;
		}
		this._htmlElement = aElement;
		if(this._htmlElement.parentNode != null) {
			this._parentHtmlElement = this._htmlElement.parentNode;
		}
		
		if(dbm.singletons.dbmHtmlDomManager != undefined) {
			dbm.singletons.dbmHtmlDomManager.addDisplayObject(this, this._htmlElement);
		}
		
		return this;
	};
	
	objectFunctions.removeElement = function(aElement) {
		//console.log("com.developedbyme.gui.DisplayBaseObject::removeElement");
		if(this._htmlElement == aElement) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "removeElement", "Element is not set.");
			return;
		}
		
		if(dbm.singletons.dbmHtmlDomManager != undefined) {
			dbm.singletons.dbmHtmlDomManager.removeHtmlObject(this, this._htmlElement);
		}
		
		if(this._parentHtmlElement != null) {
			this.removeFromDom();
			this._parentHtmlElement = null;
		}
		
		if(this._placementNode != null) {
			this._placementNode.getProperty("element").disconnectOutput();
		}
		
		this._htmlElement = null;
		
		return this;
	};
	
	objectFunctions.getElement = function() {
		return this._htmlElement;
	};
	
	objectFunctions.setElementAsPositioned = function() {
		
		this._placementNode = PlaceHtmlElementNode.create(this._htmlElement);
		this.addDestroyableObject(this._placementNode);
		
		return this;
	};
	
	
	objectFunctions.setParent = function(aElement) {
		this._parentHtmlElement = aElement;
		
		return this;
	}
	
	objectFunctions.addToParent = function(aElement) {
		this.setParent(aElement);
		this.addToDom();
		
		return this;
	}
	
	objectFunctions.addToDom = function() {
		if(this._parentHtmlElement != null) {
			try{
				this._parentHtmlElement.appendChild(this._htmlElement);
			}
			catch(theError) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addToDom", "Un error occured while adding to dom.");
				ErrorManager.getInstance().reportError(this, "addToDom", theError);
			}
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "addToDom", "Object " + this + " doesn't have a parent.");
		}
		
		return this;
	}
	
	objectFunctions.removeFromDom = function() {
		if(this._parentHtmlElement != null) {
			try{
				if(this._htmlElement.parentNode == this._parentHtmlElement) {
					this._htmlElement.parentNode.removeChild(this._htmlElement);
				}
				else if(this._htmlElement.parentNode != null) {
					ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "removeFromDom", "Object " + this + " doesn't have the correct parent.");
					this._htmlElement.parentNode.removeChild(this._htmlElement);
				}
			}
			catch(theError) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "removeFromDom", "Un error occured while removing dom.");
				ErrorManager.getInstance().reportError(this, "remvoeFromDom", theError);
			}
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "removeFromDom", "Object " + this + " doesn't have a parent.");
		}
		
		return this;
	}
	
	objectFunctions.setStyleProperty = function(aStyleProperty, aValue) {
		
		this._htmlElement.style.setProperty(aStyleProperty, aValue, "");
		
		return this;
	};
	
	objectFunctions.removeStyleProperty = function(aStyleProperty) {
		
		this._htmlElement.style.removeProperty(aStyleProperty);
		
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
			case "display":
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
		if(this._htmlElement != null) {
			return dbm.singletons.dbmHtmlDomManager.getHtmlCreator(DomReferenceFunctions.getDocument(this._htmlElement));
		}
		else if(this._parentHtmlElement != null) {
			return dbm.singletons.dbmHtmlDomManager.getHtmlCreator(DomReferenceFunctions.getDocument(this._parentHtmlElement));
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getHtmlCreator", "Element or parent must be set before getting the html creator.");
		return null;
	};
	
	objectFunctions.performDestroy = function() {
		
		if(this._parentHtmlElement != null && this._htmlElement != null) {
			this.removeFromDom();
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._htmlElement = null;
		this._parentHtmlElement = null;
		this._placementNode = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		
		newNode.setElement(aElement);
		
		return newNode;
	};
	
	staticFunctions.createDiv = function(aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theParent = DomReferenceFunctions.getDocumentVisualParent(aParentOrDocument);
		
		newNode.setParent(theParent);
		
		var htmlCreator = newNode.getHtmlCreator();
		
		newNode.setElement(htmlCreator.createNode("div", aAttributes));
		
		if(aAddToParent != false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});