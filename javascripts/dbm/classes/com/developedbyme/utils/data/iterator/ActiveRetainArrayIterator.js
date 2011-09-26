dbm.registerClass("com.developedbyme.utils.data.iterator.ActiveRetainArrayIterator", "com.developedbyme.utils.data.iterator.ActiveArrayIterator", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.iterator.ActiveRetainArrayIterator");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.data.iterator.ActiveRetainArrayIterator::init");
		
		this.superCall();
		
		this.ownsObjects = false;
		
		return this;
	};
	
	
	objectFunctions._verifyItem = function(aObject) {
		//METODO
		
		return true;
	};
	
	objectFunctions._itemPreAdded = function(aObject) {
		aObject.retain();
		this.superCall(aObject);
	};
	
	objectFunctions._itemRemoved = function(aObject) {
		aObject.releaseAndDestroy();
		this.superCall(aObject);
	};
	
	objectFunctions.performDestroy = function() {
		
		
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		
		
		this.superCall();
	};
});