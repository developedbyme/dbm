dbm.registerClass("com.developedbyme.flow.FlowGroupWithCustomUpdateFunction", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.FlowGroupWithCustomUpdateFunction");
	//"use strict";
	
	var FlowGroupWithCustomUpdateFunction = dbm.importClass("com.developedbyme.flow.FlowGroupWithCustomUpdateFunction");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var ObjectProperty = dbm.importClass("com.developedbyme.core.objectparts.ObjectProperty");
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.FlowGroupWithCustomUpdateFunction::_init");
		
		this.superCall();
		
		this._customFlowFunction = null;
		
		this._updateFlowUpdateFunction = this.createUpdateFunction("default", this._updateFlow, [], []);
		
		//console.log("//com.developedbyme.flow.FlowGroupWithCustomUpdateFunction::_init");
		return this;
	};
	
	objectFunctions.createInputProperty = function(aName, aValue) {
		var newProperty = this.superCall(aName, aValue);
		
		this._updateFlowUpdateFunction.addInputConnection(newProperty);
	};
	
	objectFunctions.createOutputProperty = function(aName, aValue) {
		var newProperty = this.superCall(aName, aValue);
		
		this._updateFlowUpdateFunction.addOutputConnection(newProperty);
	};
	
	objectFunctions.setCustomUpdateFunction = function(aFunction) {
		this._customFlowFunction = aFunction;
		
		return this;
	}
	
	objectFunctions._updateFlow = function(aFlowUpdateNumber) {
		if(this._customFlowFunction !== null) {
			this._customFlowFunction(aFlowUpdateNumber);
		}
		else {
			//METODO: error message
		}
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._customFlowFunction = null;
		this._updateFlowUpdateFunction = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInputProperties, aOutputProperties) {
		//console.log("com.developedbyme.flow.FlowGroupWithCustomUpdateFunction::create (static)");
		var newGroup = (new ClassReference()).init();
		for(var objectName in aInputProperties) {
			newGroup.createInputProperty(objectName, null);
			newGroup.setInputPropertyInputWithoutNull(objectName, aInputProperties[objectName]);
		}
		for(var objectName in aOutputProperties) {
			newGroup.createOutputProperty(objectName, null);
			newGroup.setOutputPropertyInputWithoutNull(objectName, aOutputProperties[objectName]);
		}
		return newGroup;
	}
});