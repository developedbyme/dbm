/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.data.iterator.ActiveRetainArrayIterator", "dbm.utils.data.iterator.ActiveArrayIterator", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.iterator.ActiveRetainArrayIterator");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.iterator.ActiveRetainArrayIterator::_init");
		
		this.superCall();
		
		this.ownsObjects = false;
		
		return this;
	};
	
	
	objectFunctions._verifyItem = function(aObject) {
		//METODO
		
		return true;
	};
	
	objectFunctions._itemPreAdded = function(aObject) {
		//console.log("dbm.utils.data.iterator.ActiveRetainArrayIterator::_itemPreAdded");
		aObject.retain();
		this.superCall(aObject);
	};
	
	objectFunctions._itemRemoved = function(aObject) {
		//console.log("dbm.utils.data.iterator.ActiveRetainArrayIterator::_itemRemoved");
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