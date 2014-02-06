dbm.registerClass("com.developedbyme.core.globalobjects.flowmanager.FlowManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager");
	//"use strict";
	
	var FlowManager = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.FlowManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ActiveArrayIterator = dbm.importClass("com.developedbyme.utils.data.iterator.ActiveArrayIterator");
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	var UpdateFunction = dbm.importClass("com.developedbyme.core.objectparts.UpdateFunction");
	
	var FlowBaseObject = dbm.importClass("com.developedbyme.core.FlowBaseObject");
	var FlowUpdater = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdater");
	var FlowUpdateChainCreator = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.update.FlowUpdateChainCreator");
	
	var GlobalVariables = dbm.importClass("com.developedbyme.core.globalobjects.GlobalVariables");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	dbm.setClassAsSingleton("dbmFlowManager");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::_init");
		
		this.superCall();
		
		this._updatedProperties = (new ActiveArrayIterator()).init();
		this._updatedProperties.setAddRemoveWhileActive(true, true);
		
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
			
			console.log(this._updatedProperties, this._updatedProperties.array);
			var updateChains = FlowUpdateChainCreator.createAllChainsForMultipleOutputConnections(this._updatedProperties.array);
			
			console.log(updateChains);
			this._cachedFlowUpdater = FlowUpdater.create(updateChains);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "cacheUpdatedProperties", "Updated properties are alread cached. Re-caching.");
			this.recacheUpdatedProperties();
		}
	};
	
	objectFunctions.recacheUpdatedProperties = function() {
		if(this._cachedFlowUpdater !== null) {
			
			var updateChains = FlowUpdateChainCreator.createAllChainsForMultipleOutputConnections(this._updatedProperties.array);
			
			this._cachedFlowUpdater.setChains(updateChains);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "recacheUpdatedProperties", "Updated properties are not cached. Creating initial cache.");
			this.cacheUpdatedProperties();
		}
	};
	
	objectFunctions.setDependentConnectionsAsDirty = function(aConnection) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::setDependentConnectionsAsDirty");
		
		var currentArray = new Array();
		aConnection.fillWithCleanOutputConnections(currentArray);
		for(var i = 0; i < currentArray.length; i++) {
			var currentConnection = currentArray[i];
			if(VariableAliases.isSet(currentConnection.setStatus)) {
				currentConnection.setStatus(FlowStatusTypes.NEEDS_UPDATE);
			}
			currentConnection.fillWithCleanOutputConnections(currentArray);
		}
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
				if(VariableAliases.isSet(currentConnection.setStatus)) {
					currentConnection.setStatus(FlowStatusTypes.NEEDS_UPDATE);
				}
			}
		}
	};
	
	objectFunctions.updateProperty = function(aProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::updateProperty");
		//console.log(aProperty.toString());
		
		if(aProperty.isDestroyed()) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "updateProperty", "Property " + aProperty.toString() + " is destroyed and can't be updated.");
			return;
		}
		
		GlobalVariables.FLOW_UPDATE_NUMBER++;
		
		var currentArray = new Array();
		currentArray.push(aProperty);
		for(var i = 0; i < currentArray.length; i++) {
			var currentConnection = currentArray[i];
			if(currentConnection === null) {
				currentArray.splice(i, 1);
				i--;
				continue;
			}
			currentConnection.fillWithDirtyInputConnections(currentArray);
			if(i > 10000) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "updateProperty", "Number of properties to update has reached max.");
				break;
			}
		}
		
		var currentArrayLength = currentArray.length;
		
		//var numberOfSkipped = 0;
		//var nodeNames = new Array();
		for(var i = currentArray.length-1; i >= 0; i--) {
			var currentConnection = currentArray[i];
			if(VariableAliases.isSet(currentConnection.getStatus) && currentConnection.getStatus() === 1) {
				//nodeNames.push(currentConnection.name + " (skip)");
				//numberOfSkipped++;
				continue;
			}
			//try {
				currentConnection.updateFlow();
			//}
			//catch(theError) {
			//	ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "updateProperty", "Un error occured while updating " + currentConnection + " started from " + aProperty + ".");
			//	ErrorManager.getInstance().reportError(this, "updateProperty", theError);
			//}
			//nodeNames.push(currentConnection.name);
		}
		
		GlobalVariables.FLOW_UPDATE_NUMBER++;
		
		//console.log(nodeNames.join(", "));
		
		//console.log(currentArray.length, numberOfSkipped);
		//console.log("+++", aProperty);
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
		else if(aInput instanceof FlowBaseObject) {
			this.connectProperties(aInput.getObjectProperty(), aProperty);
		}
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
			this._performUpdateCachedProperties();
		}
		else {
			this._performUpdateUncachedProperties();
		}
		
		//console.log("//com.developedbyme.core.globalobjects.flowmanager.FlowManager::updateProperties");
	};
	
	objectFunctions._performUpdateCachedProperties = function() {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::_performUpdateCachedProperties");
		
		GlobalVariables.FLOW_UPDATE_NUMBER++;
		
		this._cachedFlowUpdater.update();
		
		GlobalVariables.FLOW_UPDATE_NUMBER++;
	};
	
	objectFunctions._performUpdateUncachedProperties = function() {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::_performUpdateUncachedProperties");
		
		var numberOfPropertiesUpdated = 0;
		var numberOfPropertiesSkipped = 0;
		
		this._updatedProperties.start();
		while(this._updatedProperties.isActive()) {
			var currentProperty = this._updatedProperties.getNextItem();
			//console.log(currentProperty, currentProperty.getStatus());
			if(currentProperty.getStatus() !== FlowStatusTypes.UPDATED) {
				numberOfPropertiesUpdated++;
				if(currentProperty.isDestroyed()) {
					ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "_performUpdateUncachedProperties", "Property (" + currentProperty + ") is destroyed, removing.");
					this._updatedProperties.removeItem(currentProperty);
					continue;
				}
				//try {
					this.updateProperty(currentProperty);
				//}
				//catch(theError) {
				//	ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_performUpdateUncachedProperties", "Un error occured while updating " + currentProperty +".");
				//	ErrorManager.getInstance().reportError(this, "_performUpdateUncachedProperties", theError);
				//}
			}
			else {
				numberOfPropertiesSkipped++;
			}
		}
		
		//console.log("Updated:", numberOfPropertiesUpdated, "Skipped:", numberOfPropertiesSkipped);
	};
	
	objectFunctions.addUpdatedProperty = function(aProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::addUpdatedProperty");
		//console.log(aProperty.toString());
		if(aProperty.isUpdating()) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NOTICE, this, "addUpdatedProperty", "Property (" + aProperty + ") is already updating.");
			return;
		}
		this._updatedProperties.push(aProperty);
		aProperty._linkRegistration_setAsUpdating(true);
	};
	
	objectFunctions.removeUpdatedProperty = function(aProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::removeUpdatedProperty");
		//console.log(aProperty.toString());
		this._updatedProperties.removeItem(aProperty);
		aProperty._linkRegistration_setAsUpdating(false);
	};
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});