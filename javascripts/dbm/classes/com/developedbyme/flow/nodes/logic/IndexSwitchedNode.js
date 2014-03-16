/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.logic.IndexSwitchedNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.logic.IndexSwitchedNode");
	
	var IndexSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.IndexSwitchedNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.logic.IndexSwitchedNode::_init");
		
		this.superCall();
		
		this._index = this.createProperty("index", -1);
		this._array = this.createProperty("array", new Array());
		this._outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [this._index, this._array], [this._outputValue]);
		
		return this;
	};
	
	staticFunctions._update = function(aIndex, aArray) {
		//console.log("com.developedbyme.flow.nodes.logic.IndexSwitchedNode::_update");
		
		if(aIndex === -1) {
			return null;
		}
		return aArray[Math.floor(Math.min(aArray.length-1, Math.max(0, aIndex)))];
	};
	
	objectFunctions.reset = function() {
		//console.log("com.developedbyme.flow.nodes.logic.IndexSwitchedNode::reset");
		
		var selectionArray = this._array.getValueWithoutFlow();
		selectionArray.splice(0, selectionArray.length);
		this._array.setAsDirty();
		
		if(this._index.canBeSet()) {
			this._index.setValue(-1);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
		
		this._index = null;
		this._array = null;
		this._outputValue = null;
	};
});