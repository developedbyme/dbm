dbm.registerClass("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain", "com.developedbyme.utils.data.iterator.ActiveArrayIterator", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain");
	
	var UpdateChain = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
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
			var currentUpdater = this.getNextItem();
			try {
				
				currentUpdater.updateTime(aTime, aFrame);
			}
			catch(theError) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "updateTime", "Un error occured while updating " + currentUpdater +".");
				ErrorManager.getInstance().reportError(this, "updateTime", theError);
			}
		}
	};
});