dbm.registerClass("com.developedbyme.core.data.generic.ValueChangeObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.generic.ValueChangeObject");
	
	var ValueChangeObject = dbm.importClass("com.developedbyme.core.data.generic.ValueChangeObject");

	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.generic.ValueChangeObject::_init");
		
		this.superCall();
		
		this.oldValue = null;
		this.newValue = null;
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("oldValue: " + this.oldValue);
		aReturnArray.push("newValue: " + this.newValue);
		
	};
	
	staticFunctions.create = function(aOldValue, aNewValue) {
		//console.log("com.developedbyme.core.data.generic.ValueChangeObject::create (static)");
		//console.log(aOldValue, aNewValue);
		var newValueChangeObject = (new ValueChangeObject()).init();
		newValueChangeObject.oldValue = aOldValue;
		newValueChangeObject.newValue = aNewValue;
		
		return newValueChangeObject;
	};
});