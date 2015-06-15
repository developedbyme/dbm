/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.flowmanager.update.FlowUpdateChain", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.flowmanager.update.FlowUpdateChain");
	//"use strict";
	
	var FlowUpdateChain = dbm.importClass("dbm.core.globalobjects.flowmanager.update.FlowUpdateChain");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var FlowStatusTypes = dbm.importClass("dbm.constants.status.FlowStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.flowmanager.update.FlowUpdateChain::_init");
		
		this.superCall();
		
		this.inputConnection = null;
		this.outputConnection = null;
		this.connections = new Array();
		
		return this;
	};
	
	objectFunctions.setInputConnection = function(aConnection) {
		this.inputConnection = aConnection;
		
		return this;
	};
	
	objectFunctions.setOutputConnection = function(aConnection) {
		this.outputConnection = aConnection;
		
		return this;
	};
	
	objectFunctions.addConnection = function(aConnection) {
		this.connections.push(aConnection);
		
		return this;
	};
	
	objectFunctions.update = function() {
		//console.log("dbm.core.globalobjects.flowmanager.update.FlowUpdateChain::update");
		
		var currentArray = this.connections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentConnection = currentArray[currentArrayLength-1-i];
			//console.log(currentConnection.name, VariableAliases.isSet(currentConnection.getStatus) && currentConnection.getStatus() === 1);
			if(VariableAliases.isSet(currentConnection.getStatus) && currentConnection.getStatus() === 1) {
				continue;
			}
			//try {
				currentConnection.updateFlow();
			//}
			//catch(theError) {
			//	ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "update", "Un error occured while updating " + currentConnection + ".");
			//	ErrorManager.getInstance().reportError(this, "updateProperty", theError);
			//}
		}
	};
	
	staticFunctions.create = function() {
		
		var newFlowUpdateChain = (new ClassReference()).init();
		
		return newFlowUpdateChain;
	};
});