dbm.registerClass("com.developedbyme.core.data.generic.KeyTypeValueObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.generic.KeyTypeValueObject");
	
	var KeyTypeValueObject = dbm.importClass("com.developedbyme.core.data.generic.KeyTypeValueObject");

	/**
	 * Constructor
	 */
	objectFunctions.init = function init() {
		//console.log("com.developedbyme.core.data.generic.KeyTypeValueObject");
		
		this.superCall();
		
		this.name = null;
		this.type = null;
		this.value = null;
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function _toString_getAttributes(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("name: " + this.name);
		aReturnArray.push("type: " + this.type);
		aReturnArray.push("value: " + this.value);
		
	}
	
	staticFunctions.create = function create(aName, aType, aValue) {
		//console.log("com.developedbyme.core.data.generic.KeyTypeValueObject::create (static)");
		//console.log(aName, aType, aValue);
		var newKeyTypeValueObject = (new KeyTypeValueObject()).init();
		newKeyTypeValueObject.name = aName;
		newKeyTypeValueObject.type = aType;
		newKeyTypeValueObject.value = aValue;
		
		return newKeyTypeValueObject;
	};
});