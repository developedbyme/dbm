/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.logic.NameSwitchedNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.logic.NameSwitchedNode");
	
	var NameSwitchedNode = dbm.importClass("dbm.flow.nodes.logic.NameSwitchedNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.logic.NameSwitchedNode::_init");
		
		this.superCall();
		
		this._name = this.createProperty("name", null);
		this._defaultValue = this.createProperty("defaultValue", null);
		this._objects = this.createProperty("objects", new Object());
		this._outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunction("default", this._update, [this._name, this._objects, this._defaultValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.logic.NameSwitchedNode::_update");
		
		var name = this._name.getValueWithoutFlow();
		var objects = this._objects.getValueWithoutFlow();
		
		if(name === null) {
			//METODO: error message
			this._outputValue.setValueWithFlow(this._defaultValue.getValueWithoutFlow(), aFlowUpdateNumber);
		}
		
		if(objects[name] !== undefined) {
			this._outputValue.setValueWithFlow(objects[name], aFlowUpdateNumber);
		}
		else {
			this._outputValue.setValueWithFlow(this._defaultValue.getValueWithoutFlow(), aFlowUpdateNumber);
		}
	};
	
	objectFunctions.addItem = function(aName, aValue) {
		//console.log("dbm.flow.nodes.logic.NameSwitchedNode::addItem");
		
		var object = this._objects.getValue();
		object[aName] = aValue;
		this._objects.setAsDirty();
		
		return this;
	};
	
	objectFunctions.reset = function() {
		//console.log("dbm.flow.nodes.logic.NameSwitchedNode::reset");
		
		var selectionArray = this._array.getValueWithoutFlow();
		selectionArray.splice(0, selectionArray.length);
		this._array.setAsDirty();
		
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