dbm.registerClass("com.developedbyme.flow.data.IterationObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.data.IterationObject");
	
	var IterationObject = dbm.importClass("com.developedbyme.flow.data.IterationObject");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var IterationConnection = dbm.importClass("com.developedbyme.flow.data.IterationConnection");
	
	/**
	 * Constructor
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.data.IterationObject::init");
		
		this.superCall();
		
		this._inputs = (new NamedArray()).init();
		this._outputs = (new NamedArray()).init();
		
		return this;
	};
	
	objectFunctions.addInput = function(aName, aInProperty, aOutProperty) {
		var newConnection = IterationConnection.create(aInProperty, aOutProperty);
		this._inputs.addObject(aName, newConnection);
		return newConnection;
	}
	
	objectFunctions.addOutput = function(aName, aInProperty, aOutProperty) {
		var newConnection = IterationConnection.create(aInProperty, aOutProperty);
		this._outputs.addObject(aName, newConnection);
		return newConnection;
	}
	
	objectFunctions.updateInputs = function() {
		//console.log("com.developedbyme.flow.data.IterationObject::updateInputs");
		var currentArray = this._inputs.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentConnection = currentArray[i];
			//console.log(currentConnection.inputProperty, currentConnection.outputProperty);
			currentConnection.outputProperty.setValue(currentConnection.inputProperty.getValue());
		}
	}
	
	objectFunctions.updateOutputs = function() {
		//console.log("com.developedbyme.flow.data.IterationObject::updateOutputs");
		var currentArray = this._outputs.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentConnection = currentArray[i];
			currentConnection.outputProperty.setValue(currentConnection.inputProperty.getValue());
		}
	}
	
	/**
	 * Performs the destruction of this class.
	 */
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});