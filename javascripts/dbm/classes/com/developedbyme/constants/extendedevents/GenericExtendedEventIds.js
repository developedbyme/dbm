dbm.registerClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	//"use strict";
	
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	staticFunctions.ITEM_CREATED = "itemCreated";
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
});