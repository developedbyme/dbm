dbm.registerClass("com.developedbyme.utils.data.ArrayHolder", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.ArrayHolder");
	
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.data.ArrayHolder::init");
		
		this.superCall();
		
		this.array = new Array();
		this.ownsObjects = false;
		
		return this;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		if(this.ownsObjects) {
			//METODO: destroy items
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		
		
		this.superCall();
	};
	
	/**
	 * Creates a new holder
	 */
	 staticFunctions.create = function(aOwnsObjects) {
		//trace("breel.utils.data.ArrayHolder.create");
		var newArrayHolder = (new ArrayHolder()).init();
		newArrayHolder.ownsObjects = aOwnsObjects;
		return newArrayHolder;
	} //End function create
	
	/**
	 * Creates anew holder from array
	 */
	 staticFunctions.createFromArray = function(aArray, aOwnsObjects) {
		//trace("breel.utils.data.ArrayHolder.createFromArray");
		var newArrayHolder = (new ArrayHolder()).init();
		newArrayHolder.array = aArray;
		newArrayHolder.ownsObjects = aOwnsObjects;
		return newArrayHolder;
	} //End function createFromArray
});