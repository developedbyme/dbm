/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.data.generic.KeyValueObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.data.generic.KeyValueObject");
	
	var KeyValueObject = dbm.importClass("dbm.core.data.generic.KeyValueObject");

	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.data.generic.KeyValueObject::_init");
		
		this.superCall();
		
		this.name = null;
		this.value = null;
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("name: " + this.name);
		aReturnArray.push("value: " + this.value);
		
	};
	
	staticFunctions.create = function(aName, aValue) {
		//console.log("dbm.core.data.generic.KeyValueObject::create (static)");
		//console.log(aName, aType, aValue);
		var newKeyValueObject = (new KeyValueObject()).init();
		newKeyValueObject.name = aName;
		newKeyValueObject.value = aValue;
		
		return newKeyValueObject;
	};
});