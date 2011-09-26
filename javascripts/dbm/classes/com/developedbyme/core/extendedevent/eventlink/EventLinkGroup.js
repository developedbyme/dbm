dbm.registerClass("com.developedbyme.core.extendedevent.eventlink.EventLinkGroup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.eventlink.EventLinkGroup");
	
	
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLinkGroup::init");
		
		this.superCall();
		
		this.name = null;
		this.linksArray = new Array();
		
		this._isActive = false;
		
		return this;
	};
	
	objectFunctions.addLink = function(aEventLink) {
		this.linksArray.push(aEventLink);
		if(this._isActive) {
			aEventLink.activate();
		}
	};
	
	objectFunctions.activateAll = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLinkGroup::activateAll");
		this._isActive = true;
		
		var currentArray = this.linksArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLink = currentArray[i];
			currentLink.activate();
		}
	};
	
	objectFunctions.deactivateAll = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLinkGroup::deactivateAll");
		this._isActive = false;
		
		var currentArray = this.linksArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLink = currentArray[i];
			currentLink.deactivate();
		}
	};
	
	
	objectFunctions.performDestroy = function() {
		
		if(this._isActive) {
			this.deactivateAll();
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.linksArray = null;
		
		this.superCall();
	};
});