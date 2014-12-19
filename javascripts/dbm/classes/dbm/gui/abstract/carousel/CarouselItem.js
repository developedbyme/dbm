/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.carousel.CarouselItem", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.abstract.carousel.CarouselItem");
	
	//Self reference
	var CarouselItem = dbm.importClass("dbm.gui.abstract.carousel.CarouselItem");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.carousel.CarouselItem::_init");
		
		this.superCall();
		
		this.item = null;
		this._position = this.createProperty("position", 0);
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.item = null;
		this._position = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aItem, aPosition) {
		var newCarouselItem = (new CarouselItem()).init();
		
		newCarouselItem.item = aItem;
		newCarouselItem.setPropertyInput("position", aPosition);
		
		return newCarouselItem;
	};
});