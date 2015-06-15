/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A gate that holds the propagation of flow dirty message.
 */
dbm.registerClass("dbm.flow.FlowGate", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.FlowGate");
	//"use strict";
	
	//Self refernce
	var FlowGate = dbm.importClass("dbm.flow.FlowGate");
	
	//Error report
	
	//Dependnecies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var FlowStatusTypes = dbm.importClass("dbm.constants.status.FlowStatusTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.FlowGate::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", null);
		this._outputValue = this.createProperty("outputValue", null);
		
		return this;
	};
	
	/**
	 * Updates the flow over this gate.
	 */
	objectFunctions.updateFlow = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.FlowGate::updateFlow");
		//console.log(this._inputValue.getValue());
		
		if(this._inputValue.status === FlowStatusTypes.NEEDS_UPDATE) {
			var newValue = this._inputValue.getValue();
			if(this._inputValue.flowUpdateNumber > this._outputValue.flowUpdateNumber) {
				this._outputValue.setValue(newValue);
			}
		}
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aInputConnection	Property	The property that is the input to this gate. (Optional)
	 * @param	aOutputConnection	Property	The property that is the output from this gate. (Optional)
	 *
	 * @return	FlowGate	The newly created object.
	 */
	staticFunctions.create = function(aInputConnection, aOutputConnection) {
		//console.log("dbm.flow.FlowGate::create");
		var newNode = ClassReference._createAndInitClass(ClassReference);
		if(VariableAliases.isSet(aInputConnection)) {
			newNode.getProperty("inputValue").connectInput(aInputConnection);
		}
		if(VariableAliases.isSet(aOutputConnection)) {
			newNode.getProperty("outputValue").connectOutput(aOutputConnection);
		}
		return newNode;
	};
});