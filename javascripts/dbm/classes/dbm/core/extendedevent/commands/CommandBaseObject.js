/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.commands.CommandBaseObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.commands.CommandBaseObject");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("dbm.constants.CommandStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.commands.CommandBaseObject::_init");
		
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
		this.removeAfterPerform = (aRemoveAfterPerform !== false);
		
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
		//console.log("dbm.core.extendedevent.commands.CommandBaseObject::retain");
		this._numberOfRetains++;
		
		return this;
	};
	
	objectFunctions.release = function() {
		if(this._numberOfRetains !== 0) {
			this._numberOfRetains--;
		}
		
		return this;
	};
	
	objectFunctions.releaseAndDestroy = function() {
		//console.log("dbm.core.extendedevent.commands.CommandBaseObject::releaseAndDestroy");
		this.release();
		if(this._numberOfRetains === 0) {
			this.destroy();
		}
		
		return this;
	};
	
	objectFunctions.forceReleaseAllRetains = function() {
		this._numberOfRetains = 0;
		
		return this;
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("id: " + this.id);
	};
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});