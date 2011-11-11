dbm.registerClass("com.developedbyme.flow.nodes.display.VisibilityIndexSwitchedNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.display.VisibilityIndexSwitchedNode");
	
	var VisibilityIndexSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.display.VisibilityIndexSwitchedNode");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.display.VisibilityIndexSwitchedNode::init");
		
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
		//console.log("com.developedbyme.flow.nodes.display.VisibilityIndexSwitchedNode::addItem");
		//console.log(aItem.toString());
		var selectionArray = this._array.getValue();
		var newIndex = selectionArray.length;
		selectionArray.push(aItem);
		this._array.setAsDirty();
		return newIndex;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.display.VisibilityIndexSwitchedNode::_update");
		
		var selectionArray = this._array.getValueWithoutFlow();
		var currentItem = this._currentVisibleItem.getValueWithoutFlow();
		var originalIndexValue = this._index.getValueWithoutFlow();
		if(originalIndexValue == -1) {
			if(currentItem != null) {
				currentItem.removeFromDom();
				this._currentVisibleItem.setValueWithFlow(null, aFlowUpdateNumber);
			}
			return;
		}
		var indexValue = Math.floor(Math.min(selectionArray.length-1, Math.max(0, originalIndexValue)));
		
		var newItem = selectionArray[indexValue];
		if(currentItem != null) {
			currentItem.removeFromDom();
		}
		if(newItem != null) {
			newItem.addToDom();
		}
		
		this._currentVisibleItem.setValueWithFlow(newItem, aFlowUpdateNumber);
		//console.log("//com.developedbyme.flow.nodes.display.VisibilityIndexSwitchedNode::_update");
	};
	
	objectFunctions.reset = function() {
		//console.log("com.developedbyme.flow.nodes.display.VisibilityIndexSwitchedNode::reset");
		
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
	}
});