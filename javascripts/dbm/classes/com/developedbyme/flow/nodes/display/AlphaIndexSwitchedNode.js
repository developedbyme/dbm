dbm.registerClass("com.developedbyme.flow.nodes.display.AlphaIndexSwitchedNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.AlphaIndexSwitchedNode");
	
	var AlphaIndexSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.display.AlphaIndexSwitchedNode");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.display.AlphaIndexSwitchedNode::_init");
		
		this.superCall();
		
		this._index = this.createProperty("index", -1);
		this._array = this.createProperty("array", new Array());
		this._currentVisibleItem = this.createProperty("currentVisibleItem", null);
		
		this.createUpdateFunction("default", this._update, [this._index, this._array], [this._currentVisibleItem]);
		
		return this;
	};
	
	objectFunctions.getIndexForItem = function(aItem) {
		var selectionArray = this._array.getValue();
		return ArrayFunctions.indexOfInArray(selectionArray, aItem);
	};
	
	objectFunctions.addItem = function(aItem) {
		//console.log("com.developedbyme.flow.nodes.display.AlphaIndexSwitchedNode::addItem");
		//console.log(aItem.toString());
		var selectionArray = this._array.getValue();
		var newIndex = selectionArray.length;
		selectionArray.push(aItem);
		this._array.setAsDirty();
		return newIndex;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.AlphaIndexSwitchedNode::_update");
		
		var selectionArray = this._array.getValueWithoutFlow();
		var currentItem = this._currentVisibleItem.getValueWithoutFlow();
		var originalIndexValue = this._index.getValueWithoutFlow();
		if(originalIndexValue === -1) {
			if(currentItem !== null) {
				currentItem.getProperty("alpha").setValue(0);
				this._currentVisibleItem.setValueWithFlow(null, aFlowUpdateNumber);
			}
			return;
		}
		var indexValue = Math.floor(Math.min(selectionArray.length-1, Math.max(0, originalIndexValue)));
		
		var newItem = selectionArray[indexValue];
		if(currentItem !== null) {
			currentItem.getProperty("alpha").setValue(0);
		}
		if(newItem !== null) {
			newItem.getProperty("alpha").setValue(1);
		}
		
		this._currentVisibleItem.setValueWithFlow(newItem, aFlowUpdateNumber);
		//console.log("//com.developedbyme.flow.nodes.display.AlphaIndexSwitchedNode::_update");
	};
	
	objectFunctions.reset = function() {
		//console.log("com.developedbyme.flow.nodes.display.AlphaIndexSwitchedNode::reset");
		
		var selectionArray = this._array.getValueWithoutFlow();
		selectionArray.splice(0, selectionArray.length);
		this._array.setAsDirty();
		
		if(this._index.canBeSet()) {
			this._index.setValue(-1);
		}
		this._currentVisibleItem.setValue(null);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._index = null;
		this._array = null;
		this._currentVisibleItem = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		return newNode;
	};
});