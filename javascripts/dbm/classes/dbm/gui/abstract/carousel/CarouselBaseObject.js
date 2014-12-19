/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.carousel.CarouselBaseObject", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.abstract.carousel.CarouselBaseObject");
	
	//Self reference
	var CarouselBaseObject = dbm.importClass("dbm.gui.abstract.carousel.CarouselBaseObject");
	
	//Error report
	
	//Dependencies
	var CarouselItem = dbm.importClass("dbm.gui.abstract.carousel.CarouselItem");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.carousel.CarouselBaseObject::_init");
		
		this.superCall();
		
		this._items = new Array();
		
		this._selectedItem = this.createProperty("selectedItem", 0);
		this._currentPosition = this.createProperty("currentPosition", 0);
		this._numberOfItems = this.createProperty("numberOfItems", 0);
		
		return this;
	};
	
	objectFunctions.addItem = function(aItem) {
		
		var currentPosition = this._numberOfItems.getValue();
		this._numberOfItems.setValue(currentPosition+1);
		
		var newItem = CarouselItem.create(aItem, currentPosition);
		this._items.push(aItem);
		
		if(this.getExtendedEvent().hasEvent(GenericExtendedEventIds.ITEM_ADDED)) {
			this.getExtendedEvent().perform(GenericExtendedEventIds.ITEM_ADDED, newItem);
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case GenericExtendedEventIds.ITEM_ADDED:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._items = null;
		
		this._selectedItem = null;
		this._currentPosition = null;
		this._numberOfItems = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newCarouselBaseObject = (new CarouselBaseObject()).init();
		
		return newCarouselBaseObject;
	};
});