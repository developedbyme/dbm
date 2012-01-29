dbm.registerClass("com.developedbyme.core.globalobjects.updatemanager.objects.CallFunctionUpdater", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.updatemanager.objects.CallFunctionUpdater");
	
	var CallFunctionUpdater = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.objects.CallFunctionUpdater");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.objects.CallFunctionUpdater::init");
		
		this.superCall();
		
		this._updateObject = null;
		this._updateFunction = null;
		
		return this;
	};
	
	objectFunctions.setup = function(aObject, aFunction) {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.objects.CallFunctionUpdater::setup");
		
		this._updateObject = aObject;
		this._updateFunction = aFunction;
		
		return this;
	};
	
	objectFunctions.isUpdaterFor = function(aObject, aFunction) {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.objects.CallFunctionUpdater::isUpdaterFor");
		
		return (this._updateObject == aObject && this._updateFunction == aFunction);
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.objects.CallFunctionUpdater::updateTime");
		
		this._updateFunction.call(this._updateObject, aTime, aFrame);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._updateObject = null;
		this._updateFunction = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObject, aFunction) {
		var newCallFunctionUpdater = (new CallFunctionUpdater()).init();
		newCallFunctionUpdater.setup(aObject, aFunction);
		return newCallFunctionUpdater;
	};
});