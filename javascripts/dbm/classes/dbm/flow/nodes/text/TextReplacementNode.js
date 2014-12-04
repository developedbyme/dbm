/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.text.TextReplacementNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.text.TextReplacementNode");
	
	//Self reference
	var TextReplacementNode = dbm.importClass("dbm.flow.nodes.text.TextReplacementNode");
	
	//Error report
	
	//Dependencies
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	var KeyValuePropertyPair = dbm.importClass("dbm.flow.data.KeyValuePropertyPair");
	var ArrayHolder = dbm.importClass("dbm.utils.data.ArrayHolder");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.text.TextReplacementNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", "");
		this._outputValue = this.createProperty("outputValue", "");
		this._replacementUpdate = this.addProperty("replacementUpdate", AnyChangeMultipleInputProperty.create());
		
		this._textReplacements = ArrayHolder.create(true);
		this.addDestroyableObject(this._textReplacements);
		
		this.createUpdateFunction("default", this._update, [this._inputValue, this._replacementUpdate], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions.addReplacement = function(aKeyValue, aDataValue) {
		var newKeyValuePair = KeyValuePropertyPair.create(aKeyValue, aDataValue);
		this._replacementUpdate.connectInput(newKeyValuePair.keyValue);
		this._replacementUpdate.connectInput(newKeyValuePair.dataValue);
		this._textReplacements.array.push(newKeyValuePair);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.text.TextReplacementNode::_update");
		
		var currentText = this._inputValue.getValueWithoutFlow().toString();
		
		var currentArray = this._textReplacements.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentReplacement = currentArray[i];
			var keyValue = currentReplacement.keyValue.getValueWithoutFlow().toString();
			var dataValue = currentReplacement.dataValue.getValueWithoutFlow().toString();
			currentText = currentText.split(keyValue).join(dataValue);
		}
		
		this._outputValue.setValueWithFlow(currentText, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue = null;
		this._outputValue = null;
		this._replacementUpdate = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInput) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		return newNode;
	};
});