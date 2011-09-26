dbm.registerClass("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain", "com.developedbyme.utils.data.iterator.ActiveArrayIterator", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain::init");
		
		this.superCall();
		
		this._canAddItemsWhileActive = false;
		this._canRemoveItemsWhileActive = false;
		
		return this;
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain::updateTime");
		
		this.start();
		while(this.isActive()) {
			currentUpdater = this.getNextItem();
			currentUpdater.updateTime(aTime, aFrame);
		}
	};
});