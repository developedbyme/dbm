dbm.registerClass("com.developedbyme.core.globalobjects.flowmanager.FlowManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ActiveArrayIterator = dbm.importClass("com.developedbyme.utils.data.iterator.ActiveArrayIterator");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	dbm.setClassAsSingleton("dbmFlowManager");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::init");
		
		this.superCall();
		
		this._flowUpdateNumber = 1;
		this._updatedProperties = (new ActiveArrayIterator()).init();
		this._updatedProperties.setAddRemoveWhileActive(false, false);
		
		return this;
	};
	
	objectFunctions.getFlowUpdateNumber = function() {
		return this._flowUpdateNumber;
	};
	
	objectFunctions.increaseFlowUpdateNumber = function() {
		this._flowUpdateNumber++;
		return this._flowUpdateNumber;
	};
	
	objectFunctions.start = function() {
		dbm.singletons.dbmUpdateManager.addUpdater(this, "updateFlow");
	};
	
	objectFunctions.stop = function() {
		dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateFlow");
	};
	
	objectFunctions.setDependentConnectionsAsDirty = function(aConnection) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::setDependentConnectionsAsDirty");
		var currentArray = new Array();
		aConnection.fillWithCleanOutputConnections(currentArray);
		for(var i = 0; i < currentArray.length; i++) {
			var currentConnection = currentArray[i];
			if(currentConnection.setStatus != null) {
				currentConnection.setStatus(FlowStatusTypes.NEEDS_UPDATE);
			}
			currentConnection.fillWithCleanOutputConnections(currentArray);
		}
	};
	
	objectFunctions.updateProperty = function(aProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::updateProperty");
		//console.log(aProperty);
		
		this._flowUpdateNumber++;
		
		var currentArray = new Array();
		currentArray.push(aProperty);
		for(var i = 0; i < currentArray.length; i++) {
			var currentConnection = currentArray[i];
			if(currentConnection == null) {
				currentArray.splice(i, 1);
				i--;
				continue;
			}
			currentConnection.fillWithDirtyInputConnections(currentArray);
			if(i > 1000) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "updateProperty", "Number of properties to update has reached max.");
				break;
			}
		}
		
		var currentArrayLength = currentArray.length;
		
		//var numberOfSkipped = 0;
		//var nodeNames = new Array();
		for(var i = currentArray.length-1; i >= 0; i--) {
			var currentConnection = currentArray[i];
			if(currentConnection.getStatus != null && currentConnection.getStatus() == 1) {
				//nodeNames.push(currentConnection.name + " (skip)");
				//numberOfSkipped++;
				continue;
			}
			currentConnection.updateFlow();
			//nodeNames.push(currentConnection.name);
		}
		
		this._flowUpdateNumber++;
		
		//console.log(nodeNames.join(", "));
		
		//console.log(currentArray.length, numberOfSkipped);
		//console.log("+++", aProperty);
	};
	
	objectFunctions.connectProperties = function(aOutputProperty, aInputProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::connectProperties");
		if(aOutputProperty == null || aInputProperty == null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "connectProperties", "One object is not a property (" + aOutputProperty + ", " + aInputProperty + ").");
			return;
		}
		aOutputProperty._linkRegistration_addConnectedOutput(aInputProperty);
		aInputProperty._linkRegistration_setInputConnection(aOutputProperty);
	};
	
	objectFunctions.disconnectProperties = function(aOutputProperty, aInputProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::disconnectProperties");
		if(aOutputProperty == null || aInputProperty == null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "disconnectProperties", "One object is not a property (" + aOutputProperty + ", " + aInputProperty + ").");
			return;
		}
		aOutputProperty._linkRegistration_removeConnectedOutput(aInputProperty);
		aInputProperty._linkRegistration_removeInputConnection();
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::updateTime");
		this.updateProperties();
	};
	
	objectFunctions.updateProperties = function() {
		this._updatedProperties.start();
		while(this._updatedProperties.isActive()) {
			currentProperty = this._updatedProperties.getNextItem();
			//console.log(currentProperty);
			if(currentProperty.getStatus() != FlowStatusTypes.UPDATED) {
				this.updateProperty(currentProperty);
			}
		}
	};
	
	objectFunctions.addUpdatedProperty = function(aProperty) {
		this._updatedProperties.push(aProperty);
		aProperty._linkRegistration_setAsUpdating(true);
	};
	
	objectFunctions.removeUpdatedProperty = function(aProperty) {
		//console.log("com.developedbyme.core.globalobjects.flowmanager.FlowManager::removeUpdatedProperty");
		//console.log(aProperty);
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