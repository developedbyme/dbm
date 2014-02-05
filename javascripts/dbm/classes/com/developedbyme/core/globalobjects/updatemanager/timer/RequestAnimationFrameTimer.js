dbm.registerClass("com.developedbyme.core.globalobjects.updatemanager.timer.RequestAnimationFrameTimer", "com.developedbyme.core.globalobjects.updatemanager.timer.TimerBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.RequestAnimationFrameTimer");
	
	var RequestAnimationFrameTimer = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.timer.RequestAnimationFrameTimer");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.updatemanager.timer.RequestAnimationFrameTimer::_init");
		
		this.superCall();
		
		this._updateRequestObject = null;
		this._updateRequestFunction = null;
		
		return this;
	};
	
	objectFunctions.setUpdateRequestFunction = function(aObject, aFunction) {
		
		this._updateRequestObject = aObject;
		this._updateRequestFunction = aFunction;
		
		return this;
	};
	
	objectFunctions._requestNextFrame = function() {
		this._updateRequestFunction.call(this._updateRequestObject, this._callbackFunction);
	};
	
	objectFunctions._performStart = function() {
		this._requestNextFrame();
	};
	
	objectFunctions._performStop = function() {
		//METODO
	};
	
	objectFunctions._preUpdate = function() {
		this._requestNextFrame();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._updateRequestObject = null;
		this._updateRequestFunction = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aUpdateObject, aUpdateRequestObject, aUpdatedRequestFunction) {
		var newRequestAnimationFrameTimer = (new ClassReference()).init();
		newRequestAnimationFrameTimer.setUpdateObject(aUpdateObject);
		newRequestAnimationFrameTimer.setUpdateRequestFunction(aUpdateRequestObject, aUpdatedRequestFunction);
		return newRequestAnimationFrameTimer;
	};
});