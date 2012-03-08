dbm.registerClass("com.developedbyme.core.globalobjects.flowmanager.selection.GroupSelectionResult", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.flowmanager.selection.GroupSelectionResult");
	//"use strict";
	
	var GroupSelectionResult = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.selection.GroupSelectionResult");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.selection.GroupSelectionResult::_init");
		
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