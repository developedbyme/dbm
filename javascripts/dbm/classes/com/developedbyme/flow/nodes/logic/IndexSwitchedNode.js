dbm.registerClass("com.developedbyme.flow.nodes.logic.IndexSwitchedNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.logic.IndexSwitchedNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.logic.IndexSwitchedNode::init");
		
		this.superCall();
		
		this._index = this.createProperty("index", -1);
		this._array = this.createProperty("array", new Array());
		this._outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunction("default", this._update, [this._index, this._array], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.logic.IndexSwitchedNode::_update");
		
		var selectionArray = this._array.getValueWithoutFlow();
		var originalIndexValue = this._index.getValueWithoutFlow();
		if(originalIndexValue == -1) {
			this._outputValue.setValueWithFlow(selectionArray[indexValue], null);
			return;
		}
		var indexValue = Math.floor(Math.min(selectionArray.length-1, Math.max(0, originalIndexValue)));
		
		this._outputValue.setValueWithFlow(selectionArray[indexValue], aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
		
		this._index = null;
		this._array = null;
		this._outputValue = null;
	};
});