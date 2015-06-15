/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.process.joints.PropertyProcessSplit", "dbm.utils.process.ProcessObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.process.joints.PropertyProcessSplit");
	
	var PropertyProcessSplit = dbm.importClass("dbm.utils.process.joints.PropertyProcessSplit");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var EventDataObject = dbm.importClass("dbm.core.extendedevent.EventDataObject");
	var NameSwitchedNode = dbm.importClass("dbm.flow.nodes.logic.NameSwitchedNode");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	var ProcessStatusTypes = dbm.importClass("dbm.constants.status.ProcessStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.process.joints.PropertyProcessSplit::_init");
		
		this.superCall();
		
		this._splitValue = this.createProperty("splitValue", null);
		this._errorOnMissingValue = this.createProperty("errorOnMissingValue", true);
		this._updateSplitValue = this.createGhostProperty("updateSplitValue");
		
		this._switchNode = NameSwitchedNode.create(this._splitValue);
		
		this.createUpdateFunction("updateSplitValue", this._updateStartSignalFlow, [this._status, this._splitValue, this._errorOnMissingValue], [this._updateSplitValue]);
		
		return this;
	};
	
	objectFunctions._createId = function() {
		return this._createNamedId("propertyProcessSplit");
	};
	
	objectFunctions._performStartProcess = function() {
		//console.log("dbm.utils.process.joints.PropertyProcessSplit::_performStartProcess");
		
		this._updateSplitValue.startUpdating();
		this._updateSplitValue.update();
	};
	
	/**
	 * Updates the split.
	 */
	objectFunctions._updateStartSignalFlow = function() {
		
		var currentStatus = this._status.getValueWithoutFlow();
		
		if(currentStatus === ProcessStatusTypes.STARTED) {
			var currentSplitValue = this._splitValue.getValueWithoutFlow();
			
		}
		
	}; //End function _updateStartSignalFlow
	
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newPropertyProcessSplit = (new ClassReference()).init();
		return newPropertyProcessSplit;
	};
});