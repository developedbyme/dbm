dbm.registerClass("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdater", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdater");
	//"use strict";
	
	var FlowUpdater = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdater");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdater::_init");
		
		this.superCall();
		
		this._updateChains = new Array();
		
		return this;
	};
	
	objectFunctions.setChains = function(aArray) {
		this._updateChains = aArray;
	};
	
	objectFunctions.update = function() {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdater::update");
		var currentArray = this._updateChains;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			currentArray[i].update();
		}
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		
		dbm.singletons.dbmFlowManager.increaseFlowUpdateNumber();
		
		this.update();
		
		dbm.singletons.dbmFlowManager.increaseFlowUpdateNumber();
	};
	
	staticFunctions.create = function(aChainsArray) {
		
		var newFlowUpdater = (new ClassReference()).init();
		newFlowUpdater.setChains(aChainsArray);
		return newFlowUpdater;
	};
});