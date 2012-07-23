dbm.registerClass("com.developedbyme.flow.nodes.logic.ValueSwitchedNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.logic.ValueSwitchedNode");
	
	var ValueSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.ValueSwitchedNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.logic.ValueSwitchedNode::_init");
		
		this.superCall();
		
		this._name = this.createProperty("name", null);
		this._defaultValue = this.createProperty("defaultValue", null);
		this._objects; //METODO this should be a key value array
		this._outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunction("default", this._update, [this._name, this._objects, this._defaultValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.logic.ValueSwitchedNode::_update");
		
		var name = this._name.getValueWithoutFlow();
		var objects; //MENOTE: this should be a key value array
		
		if(name == null) {
			//METODO: error message
			this._outputValue.setValueWithFlow(this._defaultValue.getValueWithoutFlow(), aFlowUpdateNumber);
		}
		
		if(objects[name] !== undefined) { //MENOTE: this should be a key value array lookup
			this._outputValue.setValueWithFlow(objects[name], aFlowUpdateNumber);
		}
		else {
			this._outputValue.setValueWithFlow(this._defaultValue.getValueWithoutFlow(), aFlowUpdateNumber);
		}
	};
	
	objectFunctions.addItem = function(aInputValue, aOutputValue) {
		//console.log("com.developedbyme.flow.nodes.logic.ValueSwitchedNode::addItem");
		
		//METODO: this should be a key value array
	};
	
	objectFunctions.reset = function() {
		//console.log("com.developedbyme.flow.nodes.logic.ValueSwitchedNode::reset");
		
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