/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.data.CachedValueNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.data.CachedValueNode");
	
	var CachedValueNode = dbm.importClass("com.developedbyme.flow.nodes.data.CachedValueNode");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CircularBuffer = dbm.importClass("com.developedbyme.utils.data.CircularBuffer");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.data.CachedValueNode::_init");
		
		this.superCall();
		
		var defaultOffset = -1;
		var defaultMaxLength = 2;
		
		this._buffer = CircularBuffer.create(defaultMaxLength);
		
		this._inputValue = this.createProperty("inputValue", null).setAlwaysUpdateFlow();
		this._outputValue = this.createProperty("outputValue", null).setAlwaysUpdateFlow();
		this._maxLength = this.createProperty("maxLength", defaultMaxLength);
		this._offset = this.createProperty("offset", defaultOffset);
		
		this._inputUpdate = this.createGhostProperty("inputUpdate");
		this._lengthUpdate = this.createGhostProperty("lengthUpdate");
		
		this.createUpdateFunction("default", this._update, [this._offset, this._inputUpdate, this._lengthUpdate], [this._outputValue]);
		this.createUpdateFunction("updateInput", this._updateInput, [this._inputValue], [this._inputUpdate]);
		this.createUpdateFunction("updateLength", this._updateLength, [this._maxLength], [this._lengthUpdate]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.CachedValueNode::_update");
		
		var offset = this._offset.getValueWithoutFlow();
		
		this._length.setValueWithFlow(this._buffer.getData(offset), aFlowUpdateNumber);
		
	};
	
	objectFunctions._updateLength = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.CachedValueNode::_updateLength");
		
		this._buffer.setNewData(this._inputValue.getValueWithoutFlow());
	};
	
	objectFunctions._updateLength = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.CachedValueNode::_updateLength");
		
		this._buffer.setLength(this._maxLength.getValueWithoutFlow());
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue = null;
		this._outputValue = null;
		this._maxLength = null;
		this._offset = null;
		
		this.superCall();
		
	};
	
	staticFunctions.create = function(aInputValue, aMaxLength, aOffset) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInputValue);
		newNode.setPropertyInputWithoutNull("maxLength", aMaxLength);
		newNode.setPropertyInputWithoutNull("offset", aOffset);
		return newNode;
	};
});