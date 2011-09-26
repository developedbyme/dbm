dbm.registerClass("com.developedbyme.core.extendedevent.commands.CommandBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.CommandBaseObject");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.CommandBaseObject::init");
		
		this.superCall();
		
		this.id = null;
		this._numberOfRetains = 0;
		this.removeAfterPerform = false;
		
		return this;
	};
	
	objectFunctions.setId = function(aId) {
		this.id = aId;
		
		return this;
	};
	
	objectFunctions.setAsRemovable = function(aRemoveAfterPerform) {
		this.removeAfterPerform = (aRemoveAfterPerform != false);
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "perform", "Method should have been overridden.");
		
		aEventDataObject.addResult(null);
		
		return CommandStatusTypes.CONTINUE;
	};
	
	objectFunctions.getNumberOfRetains = function() {
		return this._numberOfRetains;
	};
	
	
	objectFunctions.retain = function() {
		this._numberOfRetains++;
	};
	
	objectFunctions.release = function() {
		if(this._numberOfRetains != 0) {
			this._numberOfRetains--;
		}
	};
	
	objectFunctions.releaseAndDestroy = function() {
		this.release();
		if(this._numberOfRetains == 0) {
			this.destroy();
		}
	};
	
	objectFunctions.forceReleaseAllRetains = function() {
		this._numberOfRetains = 0;
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});