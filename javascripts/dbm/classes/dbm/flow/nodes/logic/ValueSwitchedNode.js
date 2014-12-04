/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.logic.ValueSwitchedNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.logic.ValueSwitchedNode");
	
	var ValueSwitchedNode = dbm.importClass("dbm.flow.nodes.logic.ValueSwitchedNode");
	
	var KeyValuePropertyArray = dbm.importClass("dbm.utils.data.KeyValuePropertyArray");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.logic.ValueSwitchedNode::_init");
		
		this.superCall();
		
		this._name = this.createProperty("name", null);
		this._defaultValue = this.createProperty("defaultValue", null);
		this._objects = KeyValuePropertyArray.create(true);
		this.addDestroyableObject(this._objects);
		this._outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunction("default", this._update, [this._name, this._objects.getProperty("anyChange"), this._defaultValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.logic.ValueSwitchedNode::_update");
		
		var name = this._name.getValueWithoutFlow();
		
		if(name === null) {
			//METODO: error message
			this._outputValue.setValueWithFlow(this._defaultValue.getValueWithoutFlow(), aFlowUpdateNumber);
		}
		
		//console.log(name, this._objects.select(name));
		if(this._objects.select(name)) {
			var currentValue = this._objects.currentSelectedItem.dataValue.getValue();
			//console.log(currentValue);
			this._outputValue.setValueWithFlow(currentValue, aFlowUpdateNumber);
		}
		else {
			this._outputValue.setValueWithFlow(this._defaultValue.getValueWithoutFlow(), aFlowUpdateNumber);
		}
	};
	
	objectFunctions.addItem = function(aInputValue, aOutputValue) {
		//console.log("dbm.flow.nodes.logic.ValueSwitchedNode::addItem");
		
		this._objects.addObject(aInputValue, aOutputValue);
		
		return;
	};
	
	objectFunctions.reset = function() {
		//console.log("dbm.flow.nodes.logic.ValueSwitchedNode::reset");
		
		//METODO: reset array
		
		if(this._name.canBeSet()) {
			this._name.setValue(null);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
		
		this._name = null;
		this._defaultValue = null;
		this._objects = null;
		this._outputValue = null;
	};
	
	staticFunctions.create = function(aName, aDefaultValue) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("name", aName);
		newNode.setPropertyInputWithoutNull("defaultValue", aDefaultValue);
		return newNode;
	};
});