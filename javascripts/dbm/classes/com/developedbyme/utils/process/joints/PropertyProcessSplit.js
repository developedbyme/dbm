/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.process.joints.PropertyProcessSplit", "com.developedbyme.utils.process.ProcessObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.process.joints.PropertyProcessSplit");
	
	var PropertyProcessSplit = dbm.importClass("com.developedbyme.utils.process.joints.PropertyProcessSplit");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	var NameSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.NameSwitchedNode");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var ProcessStatusTypes = dbm.importClass("com.developedbyme.constants.ProcessStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.process.joints.PropertyProcessSplit::_init");
		
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
		//console.log("com.developedbyme.utils.process.joints.PropertyProcessSplit::_performStartProcess");
		
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