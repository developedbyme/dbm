/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.updatemanager.objects.UpdateChain", "dbm.utils.data.iterator.ActiveArrayIterator", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.updatemanager.objects.UpdateChain");
	//"use strict";
	
	//Self reference
	var UpdateChain = dbm.importClass("dbm.core.globalobjects.updatemanager.objects.UpdateChain");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var IterationData = dbm.importClass("dbm.utils.data.iterator.IterationData");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.updatemanager.objects.UpdateChain::_init");
		
		this.superCall();
		
		this._canAddItemsWhileActive = false;
		this._canRemoveItemsWhileActive = false;
		
		this._iterationData = this.addDestroyableObject(IterationData.create(this.array));
		
		return this;
	}; //End function _init
	
	/**
	 * Interface function called from the update manager every frame.
	 *
	 * @param	aCurrentTime	The local time of the application in seconds.
	 * @param	aCurrentFrame	The current frame of the application.
	 */
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("dbm.core.globalobjects.updatemanager.objects.UpdateChain::updateTime");
		
		var iterationData = this._iterationData;
		iterationData.position = 0;
		iterationData.updateLength();
		this.addIterationData(this._iterationData);
		var currentArray = iterationData.array;
		var currentArrayLength = iterationData.length;
		for(var i = iterationData.position; i < currentArrayLength;) { //MENOTE: i and length is updated in loop
			var currentUpdater = currentArray[i];
			//try {
				currentUpdater.updateTime(aTime, aFrame);
				i = (++iterationData.position);
				currentArrayLength = iterationData.length;
			//}
			//catch(theError) {
			//	ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "updateTime", "Un error occured while updating " + currentUpdater +".");
			//	ErrorManager.getInstance().reportError(this, "updateTime", theError);
			//}
		}
		this.removeIterationData(this._iterationData);
	}; //End function updateTime
});