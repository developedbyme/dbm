/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.flowmanager.selection.GroupSelectionResult", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.flowmanager.selection.GroupSelectionResult");
	//"use strict";
	
	var GroupSelectionResult = dbm.importClass("dbm.core.globalobjects.flowmanager.selection.GroupSelectionResult");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	var FlowStatusTypes = dbm.importClass("dbm.constants.status.FlowStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.flowmanager.selection.GroupSelectionResult::_init");
		
		this.superCall();
		
		this.inputNodes = null;
		this.outputNodes = null;
		this.externalNodes = null;
		
		return this;
	};
	
	staticFunctions.create = function() {
		var newGroupSelectionResult = (new ClassReference()).init();
		return newGroupSelectionResult;
	};
});