/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.data.AddToArrayNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.data.AddToArrayNode");
	
	//Self reference
	var AddToArrayNode = dbm.importClass("com.developedbyme.flow.nodes.data.AddToArrayNode");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.data.AddToArrayNode::_init");
		
		this.superCall();
		
		this._index = this.createProperty("index", -1);
		this._value = this.createProperty("value", null);
		this._array = this.createProperty("array", new Array());
		
		this.createUpdateFunction("default", this._update, [this._index, this._value], [this._array]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.data.AddToArrayNode::_update");
		
		var theArray = this._array.getValueWithoutFlow();
		var theIndex = this._index.getValueWithoutFlow();
		if(theIndex !== -1) {
			theArray[theIndex] = this._value.getValueWithoutFlow();
		}
		
		this._array.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._index = null;
		this._value = null;
		this._array = null;
		
		this.superCall();
		
	};
	
	staticFunctions.create = function(aIndex, aValue) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("index", aIndex);
		newNode.setPropertyInputWithoutNull("value", aValue);
		return newNode;
	};
});