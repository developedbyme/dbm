/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A named value with a type.
 */
dbm.registerClass("com.developedbyme.core.data.generic.KeyTypeValueObject", "com.developedbyme.core.data.generic.KeyValueObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.generic.KeyTypeValueObject");
	
	//Self reference
	var KeyTypeValueObject = dbm.importClass("com.developedbyme.core.data.generic.KeyTypeValueObject");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.generic.KeyTypeValueObject::_init");
		
		this.superCall();
		
		this.type = null;
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("type: " + this.type);
		
	};
	
	staticFunctions.create = function(aName, aType, aValue) {
		//console.log("com.developedbyme.core.data.generic.KeyTypeValueObject::create (static)");
		//console.log(aName, aType, aValue);
		var newKeyTypeValueObject = (new KeyTypeValueObject()).init();
		newKeyTypeValueObject.name = aName;
		newKeyTypeValueObject.type = aType;
		newKeyTypeValueObject.value = aValue;
		
		return newKeyTypeValueObject;
	};
});