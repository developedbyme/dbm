/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Global object for controlling flow through the application.
 */
dbm.registerClass("com.developedbyme.core.globalobjects.flowmanager.FlowManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager");
	//"use strict";
	
	//Self refernce
	var FlowManager = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.FlowManager");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ActiveArrayIterator = dbm.importClass("com.developedbyme.utils.data.iterator.ActiveArrayIterator");
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	var UpdateFunction = dbm.importClass("com.developedbyme.core.objectparts.UpdateFunction");
	var FlowBaseObject = dbm.importClass("com.developedbyme.core.FlowBaseObject");
	var FlowUpdater = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdater");
	
	var PositionedArrayHolder = dbm.importClass("com.developedbyme.utils.data.PositionedArrayHolder");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	//Utils
	var FlowUpdateChainCreator = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator");
	
	//Constants
	var GlobalVariables = dbm.importClass("com.developedbyme.core.globalobjects.GlobalVariables");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	
	dbm.setClassAsSingleton("dbmFlowManager");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::_init");
		
		this.superCall();
		
		this._updateProperty = this.addProperty("update", AnyChangeMultipleInputProperty.create());
		
		this._cachedFlowUpdater = null;
		
		return this;
	};
	
	objectFunctions.getFlowUpdateNumber = function() {
		return GlobalVariables.FLOW_UPDATE_NUMBER;
	};
	
	objectFunctions.increaseFlowUpdateNumber = function() {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::increaseFlowUpdateNumber");
		return (++GlobalVariables.FLOW_UPDATE_NUMBER);
	};
	
	objectFunctions.start = function() {
		dbm.singletons.dbmUpdateManager.addUpdater(this, "updateFlow");
	};
	
	objectFunctions.stop = function() {
		dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateFlow");
	};
	
	objectFunctions.cacheUpdatedProperties = function() {
		console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::cacheUpdatedProperties");
		
		if(this._cachedFlowUpdater === null) {
			
			var updateChains = FlowUpdateChainCreator.createAllChainsForMultipleOutputConnections(this._updatedProperties.array);
			
			this._cachedFlowUpdater = FlowUpdater.create(updateChains);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "cacheUpdatedProperties", "Updated properties are alread cached. Re-caching.");
			this.recacheUpdatedProperties();
		}
	};
	
	objectFunctions.recacheUpdatedProperties = function() {
		if(this._cachedFlowUpdater !== null) {
			
			var updateChains = FlowUpdateChainCreator.createAllChainsForMultipleOutputConnections(this._updateProperty._inputConnections);
			
			this._cachedFlowUpdater.setChains(updateChains);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "recacheUpdatedProperties", "Updated properties are not cached. Creating initial cache.");
			this.cacheUpdatedProperties();
		}
	};
	
	objectFunctions.setDependentConnectionsAsDirty = function(aConnection) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::setDependentConnectionsAsDirty");
		//console.log(aConnection);
		
		ClassReference.propagateDirtyStatus(aConnection);
	};
	
	objectFunctions.setUpdateChainsAsDirty = function(aUpdateChains) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::setUpdateChainsAsDirty");
		//console.log(aUpdateChains);
		var currentArray = aUpdateChains;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChain = currentArray[i];
			var currentArray2 = currentChain.connections;
			var currentArray2Length = currentArray2.length;
			for(var j = 0; j < currentArray2Length; j++) {
				var currentConnection = currentArray2[j];
				//console.log(currentConnection);
				currentConnection.status = FlowStatusTypes.NEEDS_UPDATE;
			}
		}
	};
	
	objectFunctions._fillWithDirtyInputFromConnection = function(aConnection, aReturnArray) {
		aConnection.fillWithDirtyInputConnections(aReturnArray);
	};
	
	objectFunctions._cleanConnection = function(aConnection) {
		if(aConnection.status !== FlowStatusTypes.UPDATED) {
			aConnection.updateFlow();
		}
	};
	
	objectFunctions.updateProperty = function(aProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::updateProperty");
		//console.log(aProperty);
		
		if(aProperty.isDestroyed()) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "updateProperty", "Property " + aProperty.toString() + " is destroyed and can't be updated.");
			return;
		}
		
		GlobalVariables.FLOW_UPDATE_NUMBER++;
		
		var positionedArrayHolder = PositionedArrayHolder.create(false);
		
		var currentArray = positionedArrayHolder.array;
		positionedArrayHolder.push(aProperty);
		
		for(var i = 0; i < positionedArrayHolder.position;) {
			this._fillWithDirtyInputFromConnection(currentArray[i++], positionedArrayHolder);
		}
		for(var i = positionedArrayHolder.position-1; i >= 0;) {
			this._cleanConnection(currentArray[i--]);
		}
		
		GlobalVariables.FLOW_UPDATE_NUMBER++;
		
		positionedArrayHolder.destroy();
	};
	
	objectFunctions.connectProperties = function(aOutputProperty, aInputProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::connectProperties");
		if(!((aOutputProperty instanceof Property || aOutputProperty instanceof UpdateFunction) && (aInputProperty instanceof Property || aInputProperty instanceof UpdateFunction))) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "connectProperties", "One object is not a property (" + aOutputProperty + ", " + aInputProperty + ").");
			return;
		}
		aOutputProperty._linkRegistration_addConnectedOutput(aInputProperty);
		aInputProperty._linkRegistration_setInputConnection(aOutputProperty);
	};
	
	objectFunctions.disconnectProperties = function(aOutputProperty, aInputProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::disconnectProperties");
		if(!((aOutputProperty instanceof Property || aOutputProperty instanceof UpdateFunction) && (aInputProperty instanceof Property || aInputProperty instanceof UpdateFunction))) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "disconnectProperties", "One object is not a property (" + aOutputProperty + ", " + aInputProperty + ").");
			return;
		}
		aOutputProperty._linkRegistration_removeConnectedOutput(aInputProperty);
		aInputProperty._linkRegistration_removeInputConnection(aOutputProperty);
	};
	
	objectFunctions.setPropertyInput = function(aProperty, aInput) {
		if(aInput instanceof Property) {
			this.connectProperties(aInput, aProperty);
		}
		//else if(aInput instanceof FlowBaseObject) {
		//	//METODO: should this have add a node to check for any change
		//}
		else {
			aProperty.setValue(aInput);
		}
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::updateTime");
		
		this.updateProperties();
	};
	
	objectFunctions.updateProperties = function() {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::updateProperties");
		
		if(this._cachedFlowUpdater !== null) {
			GlobalVariables.FLOW_UPDATE_NUMBER++;
			this._cachedFlowUpdater.update();
			GlobalVariables.FLOW_UPDATE_NUMBER++;
		}
		else {
			this.updateProperty(this._updateProperty);
		}
		
		//console.log("//com.developedbyme.core.globalobjects.flowmanager.FlowManager::updateProperties");
	};
	
	objectFunctions.addUpdatedProperty = function(aProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::addUpdatedProperty");
		//console.log(aProperty.toString());
		if(aProperty.isUpdating()) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NOTICE, this, "addUpdatedProperty", "Property (" + aProperty + ") is already updating.");
			return;
		}
		this._updateProperty.connectInput(aProperty);
		//this._updatedProperties.push(aProperty);
		aProperty._linkRegistration_setAsUpdating(true);
	};
	
	objectFunctions.removeUpdatedProperty = function(aProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::removeUpdatedProperty");
		//console.log(aProperty.toString());
		this._updateProperty.disconnectInput(aProperty);
		//this._updatedProperties.removeItem(aProperty);
		aProperty._linkRegistration_setAsUpdating(false);
	};
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	/**
	 * Propagates a dirty message spreading through the flow. The difference from fillWithCleanOutputConnections is that the status is updated as the connections are collected.
	 *
	 * @param	aConnection		Property|UpdateFunction		The connection to propagate through.
	 */
	staticFunctions.propagateDirtyStatus = function(aConnection) {
		//console.log("com.developedbyme.core.objectparts.Property::propagateDirtyStatus");
		var currentArray = aConnection._outputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.status === FlowStatusTypes.UPDATED) {
				currentObject.status = FlowStatusTypes.NEEDS_UPDATE;
				ClassReference.propagateDirtyStatus(currentObject);
			}
		}
	};
});