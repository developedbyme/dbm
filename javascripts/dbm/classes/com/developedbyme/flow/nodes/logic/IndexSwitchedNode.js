/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.logic.IndexSwitchedNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.logic.IndexSwitchedNode");
	
	//Self reference
	var IndexSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.IndexSwitchedNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.logic.IndexSwitchedNode::_init");
		
		this.superCall();
		
		this._index = this.createProperty("index", -1);
		this._indexOffset = this.createProperty("indexOffset", 0);
		this._array = this.createProperty("array", new Array());
		this._outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [this._index, this._indexOffset, this._array], [this._outputValue]);
		
		return this;
	};
	
	staticFunctions._update = function(aIndex, aIndexOffset, aArray) {
		//console.log("com.developedbyme.flow.nodes.logic.IndexSwitchedNode::_update");
		
		var newIndex = aIndex+aIndexOffset;
		
		if(newIndex < 0) {
			return null;
		}
		
		var theLength = aArray.length;
		if(newIndex >= theLength) {
			return null;
		}
		
		return aArray[Math.floor(newIndex)];
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
		this._indexOffset = null;
		this._array = null;
		this._outputValue = null;
	};
	
	staticFunctions.create = function(aIndex, aIndexOffset, aArray) {
		var newNode = (new ClassReference()).init();
		
		newNode.setPropertyInputWithoutNull("index", aIndex);
		newNode.setPropertyInputWithoutNull("indexOffset", aIndexOffset);
		newNode.setPropertyInputWithoutNull("array", aArray);
		
		return newNode;
	};
});