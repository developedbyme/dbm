/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.flowmanager.update.FlowUpdater", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.flowmanager.update.FlowUpdater");
	//"use strict";
	
	var FlowUpdater = dbm.importClass("dbm.core.globalobjects.flowmanager.update.FlowUpdater");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	var GlobalVariables = dbm.importClass("dbm.core.globalobjects.GlobalVariables");
	
	var FlowStatusTypes = dbm.importClass("dbm.constants.status.FlowStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.flowmanager.update.FlowUpdater::_init");
		
		this.superCall();
		
		this._updateChains = new Array();
		
		return this;
	};
	
	objectFunctions.setChains = function(aArray) {
		this._updateChains = aArray;
	};
	
	objectFunctions.update = function() {
		//console.log("dbm.core.globalobjects.flowmanager.update.FlowUpdater::update");
		var currentArray = this._updateChains;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			currentArray[i].update();
		}
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		
		GlobalVariables.FLOW_UPDATE_NUMBER++;
		
		this.update();
		
		GlobalVariables.FLOW_UPDATE_NUMBER++;
	};
	
	staticFunctions.create = function(aChainsArray) {
		
		var newFlowUpdater = (new ClassReference()).init();
		newFlowUpdater.setChains(aChainsArray);
		return newFlowUpdater;
	};
});