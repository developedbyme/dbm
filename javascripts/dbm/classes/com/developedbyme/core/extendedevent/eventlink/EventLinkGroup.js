dbm.registerClass("com.developedbyme.core.extendedevent.eventlink.EventLinkGroup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.eventlink.EventLinkGroup");
	
	
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLinkGroup::_init");
		
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
	
	objectFunctions.reactivateAll = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLinkGroup::reactivateAll");
		if(this._isActive) {
			var currentArray = this.linksArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentLink = currentArray[i];
				currentLink.reactivate();
			}
		}
	};
	
	objectFunctions.performDestroy = function() {
		//console.log("com.developedbyme.core.extendedevent.eventlink.EventLinkGroup::performDestroy");
		if(this._isActive) {
			this.deactivateAll();
		}
		
		ClassReference.softDestroyArrayIfExists(this.linksArray);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.linksArray = null;
		
		this.superCall();
	};
});