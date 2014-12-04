/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.IterativeFlowGroup", "dbm.flow.FlowGroup", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.IterativeFlowGroup");

	//Self refernce
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependnecies
	var UpdateFunction = dbm.importClass("dbm.core.objectparts.UpdateFunction");
	var IterativeUpdateFunction = dbm.importClass("dbm.core.objectparts.IterativeUpdateFunction");
	var ActiveArrayIterator = dbm.importClass("dbm.utils.data.iterator.ActiveArrayIterator");
	var IterationObject = dbm.importClass("dbm.flow.data.IterationObject");
	var Property = dbm.importClass("dbm.core.objectparts.Property");
	
	//Utils
	
	//Constants
	var GlobalVariables = dbm.importClass("dbm.core.globalobjects.GlobalVariables");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.IterativeFlowGroup::_init");
		
		this.superCall();
		
		this._iterator = (new ActiveArrayIterator()).init();
		
		this._index = this._createInputPropertyWithoutUpdate("index", 0);
		this._length = this._createInputPropertyWithoutUpdate("length", 0);
		
		this._updateFunction = IterativeUpdateFunction.create(this, this._update, [this._index, this._length], []);
		this._updateFunction.name = "IterativeFlowGroup::default";
		
		//console.log("//dbm.flow.IterativeFlowGroup::_init");
		return this;
	};
	
	objectFunctions.createInputProperty = function(aName, aValue) {
		var newProperty = this.superCall(aName, aValue);
		//console.log(this, this._updateFunction);
		this._updateFunction.addInputConnection(newProperty);
		return newProperty;
	};
	
	objectFunctions.createOutputProperty = function(aName, aValue) {
		var newProperty = this.superCall(aName, aValue);
		this._updateFunction.addInputConnection(newProperty);
		return newProperty;
	};
	
	objectFunctions._createInputPropertyWithoutUpdate = function(aName, aValue) {
		//console.log("dbm.flow.IterativeFlowGroup::_createInputPropertyWithoutUpdate");
		var newProperty = Property.create(aValue);
		newProperty.name = "input::" + aName;
		this._inputProperties.addObject(aName, newProperty);
		//console.log("//dbm.flow.IterativeFlowGroup::_createInputPropertyWithoutUpdate");
		return newProperty;
	};
	
	objectFunctions._createOutputPropertyWithoutUpdate = function(aName, aValue) {
		//console.log("dbm.flow.IterativeFlowGroup::_createOutputPropertyWithoutUpdate");
		var newProperty = Property.create(aValue);
		newProperty.name = "output::" + aName;
		this._outputProperties.addObject(aName, newProperty);
		return newProperty;
	};
	
	objectFunctions.addIteration = function(aInputConnections, aOutputConnections) {
		
		var newIndex = this._iterator.getLength();
		
		var newIteration = (new IterationObject()).init();
		
		for(var objectName in aInputConnections) {
			var newProperty = this.createIterationInputProperty(objectName, newIndex, aInputConnections[objectName]);
			newIteration.addInput(objectName, newProperty, this.getInputProperty(objectName));
		}
		for(var objectName in aOutputConnections) {
			var newProperty = this.createIterationOutputProperty(objectName, newIndex, aOutputConnections[objectName]);
			newIteration.addOutput(objectName, this.getOutputProperty(objectName), newProperty);
		}
		
		this._iterator.push(newIteration);
		this._length.setValue(this._iterator.getLength());
		
		return newIteration;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.FlowGroup::_update");
		var currentIndex = 0;
		var iterationData = this._iterator.createIterationData();
		for(;iterationData.position < iterationData.length; iterationData.position++) {
			var currentData = iterationData.array[iterationData.position];
			GlobalVariables.FLOW_UPDATE_NUMBER++;
			this._index.setValue(currentIndex);
			currentData.updateInputs();
			currentData.updateOutputs();
			currentIndex++;
		}
		this._iterator.stopUsingIterationData(iterationData);
	};
	
	objectFunctions.createIterationInputProperty = function(aName, aIteration, aConnectedProperty) {
		var fullName = "iteration_" + aIteration + "_" + aName;
		var theProperty = this._createInputPropertyWithoutUpdate(fullName, null);
		if(!this._inputProperties.select(aName)) {
			this._createInputPropertyWithoutUpdate(aName, null);
		}
		dbm.singletons.dbmFlowManager.connectProperties(aConnectedProperty, theProperty);
		return theProperty;
	};
	
	objectFunctions.createIterationOutputProperty = function(aName, aIteration, aConnectedProperty) {
		var fullName = "iteration_" + aIteration + "_" + aName;
		var theProperty = this._createOutputPropertyWithoutUpdate(fullName, null);
		if(!this._outputProperties.select(aName)) {
			this.createOutputProperty(aName, null);
		}
		this._updateFunction.addOutputConnection(theProperty);
		dbm.singletons.dbmFlowManager.connectProperties(theProperty, aConnectedProperty);
		return theProperty;
	};
	
	
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
	
	staticFunctions.create = function(aInputProperties, aOutputProperties) {
		//console.log("dbm.flow.FlowGroup::create (static)");
		var newGroup = (new ClassReference()).init();
		for(var objectName in aInputProperties) {
			newGroup.createInputProperty(objectName, null);
			newGroup.setInputPropertyInputWithoutNull(objectName, aInputProperties[objectName]);
		}
		for(var objectName in aOutputProperties) {
			newGroup.createOutputProperty(objectName, null);
			newGroup.setOutputPropertyInputWithoutNull(objectName, aOutputProperties[objectName]);
		}
		return newGroup;
	};
});