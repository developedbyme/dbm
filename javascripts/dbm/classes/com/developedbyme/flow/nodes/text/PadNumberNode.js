dbm.registerClass("com.developedbyme.flow.nodes.text.PadNumberNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.text.PadNumberNode");
	
	var PadNumberNode = dbm.importClass("com.developedbyme.flow.nodes.text.PadNumberNode");
	
	var NumberFunctions = dbm.importClass("com.developedbyme.utils.native.number.NumberFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.text.PadNumberNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", "");
		this._paddingLength = this.createProperty("paddingLength", 0);
		this._outputValue = this.createProperty("outputValue", "");
		
		this.createUpdateFunction("default", this._update, [this._inputValue, this._paddingLength], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.text.PadNumberNode::_update");
		this._outputValue.setValueWithFlow(NumberFunctions.getPaddedNumber(this._inputValue.getValueWithoutFlow(), this._paddingLength.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue = null;
		this._paddingLength = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInput, aPaddingLength) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		newNode.setPropertyInputWithoutNull("paddingLength", aPaddingLength);
		return newNode;
	};
});