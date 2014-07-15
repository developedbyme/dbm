/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A node that constructs an array from properties.
 */
dbm.registerClass("com.developedbyme.flow.nodes.data.PropertiesToArrayNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.data.PropertiesToArrayNode");
	
	//Self reference
	var PropertiesToArrayNode = dbm.importClass("com.developedbyme.flow.nodes.data.PropertiesToArrayNode");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.data.PropertiesToArrayNode::_init");
		
		this.superCall();
		
		this._arrayProperties = this.addDestroyableObject(ArrayHolder.create(true));
		
		this._outputLength = this.createProperty("outputLength", 0);
		this._array = this.createProperty("array", new Array());
		
		this._updateFunction = this.createUpdateFunction("default", this._update, [this._outputLength], [this._array]);
		
		return this;
	};
	
	/**
	 * Pushes a new property to the array.
	 *
	 * @param	aValue	Any	Property or value to add to the array.
	 *
	 * @return	ExternalVariableProperty	The newly created property.
	 */
	objectFunctions.push = function(aValue) {
		//console.log("com.developedbyme.flow.nodes.data.PropertiesToArrayNode::push");
		//console.log(aValue);
		
		var outputArray = this._array.getValueWithoutFlow();
		outputArray.push(null);
		var newLength = outputArray.length;
		this._outputLength.setValue(newLength);
		
		var newProperty = ExternalVariableProperty.create(this._objectProperty, outputArray, newLength-1);
		ExternalVariableProperty.setInputOrValueToProperty(newProperty, aValue);
		
		this._updateFunction.addInputConnection(newProperty);
		this._arrayProperties.array.push(newProperty);
		
		return newProperty;
	};
	
	/**
	 * Pops a property from the array.
	 */
	objectFunctions.pop = function() {
		var outputArray = this._array.getValueWithoutFlow();
		outputArray.pop();
		this._outputLength.setValue(outputArray.length);
		
		var removedProperty = this._arrayProperties.array.pop();
		removedProperty.destroy();
	};
	
	/**
	 * Removes an entry based on the input.
	 *
	 * @param	aValue	Any	Property or value that was add to the array.
	 */
	objectFunctions.removeByInput = function(aValue) {
		var isFound = false;
		var outputArray = this._array.getValueWithoutFlow();
		var currentArray = this._arrayProperties.array;
		var currentArrayLength = currentArray.length;
		var i = 0;
		for(; i < currentArrayLength; i++) { //MENOTE: i is reused
			var currentProperty = currentArray[i];
			if(currentProperty.getInputProperty() === aValue || currentProperty.getValueWithoutFlow() === aValue) {
				currentArray.splice(i, 1);
				outputArray.splice(i, 1);
				currentArrayLength--;
				isFound = true;
				currentProperty.destroy();
				break;
			}
		}
		
		if(isFound) {
			for(; i < currentArrayLength; i++) { //MENOTE: i is reused
				var currentProperty = currentArray[i];
				currentProperty._internalFunctionality_setExternalVariableName(i);
			}
		}
		else {
			//METODO: error message
		}
	};
	
	/**
	 * Updates the flow for this node.
	 *
	 * @param	aFlowUpdateNumber	uint	The current update number of the flow.
	 */
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.data.PropertiesToArrayNode::_update");
		
		this._array.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._arrayProperties = null;
		this._array = null;
		
		this.superCall();
		
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		return newNode;
	};
});