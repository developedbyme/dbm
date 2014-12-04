/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.htmldommanager.data.HtmlElementControllerLink", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.htmldommanager.data.HtmlElementControllerLink");
	//"use strict";
	
	var HtmlElementControllerLink = dbm.importClass("dbm.core.globalobjects.htmldommanager.data.HtmlElementControllerLink");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.htmldommanager.data.HtmlElementControllerLink::_init");
		
		this.superCall();
		
		this.controller = null;
		this.htmlElement = null;
		
		return this;
	};
	
	objectFunctions.setObjects = function(aController, aHtmlElement) {
		//console.log("dbm.core.globalobjects.htmldommanager.data.HtmlElementControllerLink::setObjects");
		
		this.controller = aController;
		this.htmlElement = aHtmlElement;
		
		return this;
		
	};
	
	staticFunctions.create = function(aController, aHtmlElement) {
		
		return (new HtmlElementControllerLink()).init().setObjects(aController, aHtmlElement);
		
	};
});