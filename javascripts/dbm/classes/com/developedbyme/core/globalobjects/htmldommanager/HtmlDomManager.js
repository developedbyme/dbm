dbm.registerClass("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var HtmlElementControllerLink = dbm.importClass("com.developedbyme.core.globalobjects.htmldommanager.data.HtmlElementControllerLink");
	var HtmlCreator = dbm.importClass("com.developedbyme.core.globalobjects.htmldommanager.objects.HtmlCreator");
	
	dbm.setClassAsSingleton("dbmHtmlDomManager");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager::init");
		
		this.superCall();
		
		this._displayObjects = new Array();
		this._htmlCreators = new Array();
		
		this._tempCanvas = document.createElement("canvas");
		
		return this;
	};
	
	objectFunctions.addDisplayObject = function(aController, aHtmlElement) {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager::addDisplayObject");
		this._displayObjects.push(HtmlElementControllerLink.create(aController, aHtmlElement));
	};
	
	objectFunctions.removeHtmlElement = function(aHtmlElement) {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager::removeHtmlElement");
		
		var currentArray = this._displayObjects;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLink = currentArray[i];
			if(currentLink.htmlElement = aHtmlElement) {
				currentArray.splice(i, 1);
				return;
			}
		}
		
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MINOR, this, "removeHtmlElement", "Controller for " + aHtmlElement + " doesn't exist.");
	};
	
	objectFunctions.getControllerForHtmlElement = function(aHtmlElement) {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager::getControllerForHtmlElement");
		
		var currentArray = this._displayObjects;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLink = currentArray[i];
			if(currentLink.htmlElement = aHtmlElement) {
				return currentLink.controller;
			}
		}
		
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "getControllerForHtmlElement", "Controller for " + aHtmlElement + " doesn't exist.");
		return null;
	};
	
	objectFunctions.getHtmlCreator = function(aDocument) {
		var currentArray = this._htmlCreators;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentCreator = currentArray[i];
			if(currentCreator.ownerDocument = aDocument) {
				return currentCreator;
			}
		}
		var newCreator = HtmlCreator.create(aDocument);
		this._htmlCreators.push(newCreator);
		return newCreator;
	};
	
	objectFunctions.getTempCanvas = function() {
		return this._tempCanvas;
	};
});