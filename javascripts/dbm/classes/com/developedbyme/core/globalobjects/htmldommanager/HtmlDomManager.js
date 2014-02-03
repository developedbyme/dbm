dbm.registerClass("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager");
	//"use strict";
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var HtmlElementControllerLink = dbm.importClass("com.developedbyme.core.globalobjects.htmldommanager.data.HtmlElementControllerLink");
	var HtmlCreator = dbm.importClass("com.developedbyme.core.globalobjects.htmldommanager.objects.HtmlCreator");
	var SvgCreator = dbm.importClass("com.developedbyme.core.globalobjects.htmldommanager.objects.SvgCreator");
	
	dbm.setClassAsSingleton("dbmHtmlDomManager");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager::_init");
		
		this.superCall();
		
		this._displayObjects = new Array();
		this._htmlCreators = new Array();
		this._svgCreators = new Array();
		
		this._tempCanvas = document.createElement("canvas");
		this._masterWindowHtmlCreator = HtmlCreator.create(dbm.getDocument());
		this._htmlCreators.push(this._masterWindowHtmlCreator);
		this._masterWindowSvgCreator = SvgCreator.create(dbm.getDocument());
		this._svgCreators.push(this._masterWindowSvgCreator);
		
		return this;
	};
	
	objectFunctions.addDisplayObject = function(aController, aHtmlElement) {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager::addDisplayObject");
		//console.log(aController, aHtmlElement.nodeName);
		this._displayObjects.push(HtmlElementControllerLink.create(aController, aHtmlElement));
	};
	
	objectFunctions.removeHtmlElement = function(aHtmlElement) {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager::removeHtmlElement");
		
		var currentArray = this._displayObjects;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLink = currentArray[i];
			if(currentLink.htmlElement === aHtmlElement) {
				currentArray.splice(i, 1);
				return;
			}
		}
		
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MINOR, this, "removeHtmlElement", "Controller for " + aHtmlElement + " doesn't exist.");
	};
	
	objectFunctions.getControllerForHtmlElement = function(aHtmlElement) {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager::getControllerForHtmlElement");
		
		var returnObject = this.getControllerForHtmlElementIfExists(aHtmlElement);
		
		if(returnObject === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "getControllerForHtmlElement", "Controller for " + aHtmlElement + " doesn't exist.");
		}
		return returnObject;
	};
	
	objectFunctions.getControllerForHtmlElementIfExists = function(aHtmlElement) {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager::getControllerForHtmlElementIfExists");
		
		var currentArray = this._displayObjects;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLink = currentArray[i];
			if(currentLink.htmlElement === aHtmlElement) {
				return currentLink.controller;
			}
		}
		
		return null;
	};
	
	objectFunctions.getParentControllerForHtmlElementByClass = function(aHtmlElement, aClass) {
		var currentElement = aHtmlElement;
		var debugCounter = 0;
		while(currentElement !== null) {
			if(debugCounter++ > 1000) {
				//METODO: error message
				return null;
			}
			var currentController = this.getControllerForHtmlElementIfExists(currentElement);
			if(currentController !== null) {
				if(currentController instanceof aClass) {
					return currentController;
				}
				else {
					currentElement = currentController.getProperty("parentElement").getValue();
				}
			}
			else {
				currentElement = currentElement.parentNode;
			}
			
		}
		//METODO: error message
		return null;
	};
	
	objectFunctions.reactivateForNewDocument = function(aDocument) {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager::reactivateForNewDocument");
		//console.log(aDocument)
		
		var currentArray = this._displayObjects;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLink = currentArray[i];
			try {
				if(currentLink.htmlElement.ownerDocument === aDocument) {
					//console.log(currentLink.controller, currentLink.htmlElement.nodeName);
					currentLink.controller.reactivateForNewDocument();
				}
			}
			catch(theError) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "reactivateForNewDocument", "Error occured while reactivating " + currentLink.controller);
				ErrorManager.getInstance().reportError(this, "reactivateForNewDocument", theError);
			}
		}
	};
	
	objectFunctions.fullAdopt = function(aFromDocument, aToDocument) {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager::fullAdopt");
		//console.log(aFromDocument, aToDocument)
		
		var currentArray = this._displayObjects;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLink = currentArray[i];
			try {
				if(currentLink.htmlElement.ownerDocument === aFromDocument) {
					//console.log(currentLink.htmlElement.nodeName);
					aToDocument.adoptNode(currentLink.htmlElement);
				}
			}
			catch(theError) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "fullAdopt", "Error occured while adopting " + currentLink.controller);
				ErrorManager.getInstance().reportError(this, "fullAdopt", theError);
			}
		}
	};
	
	objectFunctions.getHtmlCreator = function(aDocument) {
		var currentArray = this._htmlCreators;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentCreator = currentArray[i];
			if(currentCreator.ownerDocument === aDocument) {
				return currentCreator;
			}
		}
		var newCreator = HtmlCreator.create(aDocument);
		this._htmlCreators.push(newCreator);
		return newCreator;
	};
	
	objectFunctions.getSvgCreator = function(aDocument) {
		var currentArray = this._svgCreators;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentCreator = currentArray[i];
			if(currentCreator.ownerDocument === aDocument) {
				return currentCreator;
			}
		}
		var newCreator = SvgCreator.create(aDocument);
		this._svgCreators.push(newCreator);
		return newCreator;
	};
	
	objectFunctions.getMasterHtmlCreator = function() {
		return this._masterWindowHtmlCreator;
	};
	
	objectFunctions.getMasterSvgCreator = function() {
		return this._masterWindowSvgCreator;
	};
	
	objectFunctions.setAttributesToNode = function(aElement, aAttributes) {
		if(aAttributes !== null) {
			for(var objectName in aAttributes) {
				aElement.setAttribute(objectName, aAttributes[objectName]);
			}
		}
	};
	
	objectFunctions.copyStyle = function(aFromElement, aToElement) {
		var currentArray = aFromElement.style;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentName = aFromElement.style[i];
			aToElement.style.setProperty(currentName, aFromElement.style.getPropertyValue(currentName), aFromElement.style.getPropertyPriority(currentName));
		}
	};
	
	objectFunctions.getTempCanvas = function() {
		return this._tempCanvas;
	};
});