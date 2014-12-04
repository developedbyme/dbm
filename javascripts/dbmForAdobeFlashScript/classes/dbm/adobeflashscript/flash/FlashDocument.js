/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeflashscript.flash.FlashDocument", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeflashscript.flash.FlashDocument");
	//"use strict";
	
	//Self reference
	var FlashDocument = dbm.importClass("dbm.adobeflashscript.flash.FlashDocument");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var TimelineItem = dbm.importClass("dbm.adobeflashscript.flash.items.TimelineItem");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeflashscript.flash.FlashDocument::_init");
		
		this.superCall();
		
		this._nativeDocument = null;
		this._activeItem = null;
		
		return this;
	};
	
	objectFunctions.setNativeDocument = function(aNativeDocument) {
		this._nativeDocument = aNativeDocument;
		
		return this;
	};
	
	objectFunctions.setupItems = function() {
		//console.log("dbm.adobeflashscript.flash.FlashDocument::setupItems");
		
		
		return this;
	};
	
	objectFunctions.getActiveItem = function() {
		//METODO: do a setup instead of this
		if(this._activeItem === null) {
			this._activeItem = TimelineItem.create(this._nativeDocument.getTimeline());
		}
		
		return this._activeItem;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		/*
		switch(aName) {
			case "":
				return true;
		}
		*/
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function() {
		//console.log("dbm.adobeflashscript.flash.FlashDocument::create");
		//console.log(aPort);
		
		var newFlashDocument = (new ClassReference()).init();
		
		newFlashDocument.setNativeDocument(fl.getDocumentDOM());
		newFlashDocument.setupItems();
		
		return newFlashDocument;
	};
});