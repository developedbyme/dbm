/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.extendedevents.GenericExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.extendedevents.GenericExtendedEventIds");
	//"use strict";
	
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	staticFunctions.ITEM_CREATED = "itemCreated";
	staticFunctions.ITEM_ADDED = "itemAdded";
	staticFunctions.ITEM_REMOVED = "itemRemoved";
	staticFunctions.ORDER_CHANGED = "orderedChanged";
	
	staticFunctions.NAME_CHANGED = "nameChanged";
	staticFunctions.VALUE_CHANGED = "valueChanged";
	
	staticFunctions.NEW = "new";
	staticFunctions.UPDATE = "update";
	staticFunctions.END = "end";
	staticFunctions.CANCEL = "cancel";
	
	staticFunctions.OPEN = "open";
	staticFunctions.CLOSE = "close";
	staticFunctions.ERROR = "error";
	staticFunctions.TIMEOUT = "timeout";
	
	staticFunctions.RAW_DATA = "rawData";
});