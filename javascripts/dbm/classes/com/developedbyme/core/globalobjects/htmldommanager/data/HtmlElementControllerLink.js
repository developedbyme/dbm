dbm.registerClass("com.developedbyme.core.globalobjects.htmldommanager.data.HtmlElementControllerLink", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.htmldommanager.data.HtmlElementControllerLink");
	
	var HtmlElementControllerLink = dbm.importClass("com.developedbyme.core.globalobjects.htmldommanager.data.HtmlElementControllerLink");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.data.HtmlElementControllerLink::init");
		
		this.superCall();
		
		this.controller = null;
		this.htmlElement = null;
		
		return this;
	};
	
	objectFunctions.setObjects = function(aController, aHtmlElement) {
		//console.log("com.developedbyme.core.globalobjects.htmldommanager.data.HtmlElementControllerLink::setObjects");
		
		this.controller = aController;
		this.htmlElement = aHtmlElement;
		
		return this;
		
	};
	
	staticFunctions.create = function(aController, aHtmlElement) {
		
		return (new HtmlElementControllerLink()).init().setObjects(aController, aHtmlElement);
		
	};
});