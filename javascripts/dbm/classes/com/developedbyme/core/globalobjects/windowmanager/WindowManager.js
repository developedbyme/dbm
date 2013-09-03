dbm.registerClass("com.developedbyme.core.globalobjects.windowmanager.WindowManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager");
	
	var WindowManager = dbm.importClass("com.developedbyme.core.globalobjects.windowmanager.WindowManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Window = dbm.importClass("com.developedbyme.core.globalobjects.windowmanager.objects.Window");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ScreenSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.ScreenSizeNode");
	var Margins = dbm.importClass("com.developedbyme.core.globalobjects.windowmanager.data.Margins");
	
	var WindowExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.WindowExtendedEventIds");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	dbm.setClassAsSingleton("dbmWindowManager");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::_init");
		
		this.superCall();
		
		this._windows = (new NamedArray()).init();
		this._windowsOrder = new Array();
		this._masterWindow = null;
		
		this._lastMouseTime = 0;
		this._lastMouseScreenX = 0;
		this._lastMouseScreenY = 0;
		
		this._isUpdatingDepths = false;
		this._currentDepthOrder = this.createGhostProperty("currentDepthOrder");
		this._depth = this.createGhostProperty("depth");
		this._updateFlowDepthFunction = this.createUpdateFunction("depth", this._updateFlowDepth, [this._currentDepthOrder], [this._depth]);
		
		this._defaultMargins = null;
		this._currentFocusedWindow = null;
		
		return this;
	};
	
	objectFunctions.setMasterWindow = function(aWindow) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::setMasterWindow");
		
		var newWindow = (new Window()).init();
		newWindow.setupFromExistingWindow(aWindow);
		newWindow.name = "master";
		
		this._masterWindow = newWindow;
		
		//MENOTE: master windows doesn't give focus events so it shouldn't be included in the ordering
		//newWindow.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.OPEN, CallFunctionCommand.createCommand(this, this.setWindowAsHighestDepth, [GetVariableObject.createSelectPerformingObjectCommand()]));
		//newWindow.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.FOCUS, CallFunctionCommand.createCommand(this, this.setWindowAsHighestDepth, [GetVariableObject.createSelectPerformingObjectCommand()]));
		//this._windowsOrder.push(newWindow);
		//this._windows.addObject("master", newWindow);
		
		return newWindow;
	};
	
	objectFunctions.getMasterWindow = function() {
		return this._masterWindow;
	};
	
	objectFunctions.getWindow = function(aName) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::getWindow");
		
		return this._windows.getObject(aName);
	};
	
	objectFunctions.getWindowForDocument = function(aDocument) {
		if(this._masterWindow !== null && aDocument === this._masterWindow.getDocument()) {
			return this._masterWindow;
		}
		
		var currentArray = this._windows.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentWindow = currentArray[i];
			if(currentWindow.isOpen() && aDocument === currentWindow.getDocument()) {
				return currentWindow;
			}
		}
		
		return null;
	};
	
	objectFunctions.getScreenSizeNode = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::getScreenSizeNode");
		
		if(this._screenSizeNode === null) {
			this._screenSizeNode = ScreenSizeNode.create();
		}
		
		return this._screenSizeNode;
	};
	
	objectFunctions.setDefaultMargins = function(aWidth, aHeight, aLeft, aTop, aRight, aBottom) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::setDefaultMargins");
		//console.log(aWidth, aHeight, aLeft, aTop, aRight, aBottom);
		
		this._defaultMargins = Margins.create(aWidth, aHeight, aLeft, aTop, aRight, aBottom);
		
	};
	
	objectFunctions.getDefaultMargins = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::getDefaultMargins");
		
		return this._defaultMargins;
		
	};
	
	objectFunctions.hasDefaultMargins = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::hasDefaultMargins");
		
		return (this._defaultMargins !== null);
		
	};
	
	objectFunctions.createWindow = function(aName, aUrl, aWidth, aHeight) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::createWindow");
		
		var newWindow = Window.create(aName, aUrl, aWidth, aHeight);
		newWindow.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.OPEN, CallFunctionCommand.createCommand(this, this._setWindowAsHighestDepth, [GetVariableObject.createSelectPerformingObjectCommand()]));
		newWindow.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.FOCUS, CallFunctionCommand.createCommand(this, this._setWindowAsHighestDepth, [GetVariableObject.createSelectPerformingObjectCommand()]));
		newWindow.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.CLOSE, CallFunctionCommand.createCommand(this, this._windowClosed, [GetVariableObject.createSelectPerformingObjectCommand()]));
		this._windows.addObject(aName, newWindow);
		
		this._updateFlowDepthFunction.addInputConnection(newWindow.getProperty("z"));
		
		return newWindow;
	};
	
	objectFunctions._linkRegistration_removeWindow = function(aWindow) {
		var windowName = this._windows.identifyObject(aWindow);
		if(windowName !== null) {
			this._windows.removeObject(windowName);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "_linkRegistration_removeWindow", "Window " + aWindow + " already removed.");
		}
	};
	
	objectFunctions._setWindowAsHighestDepth = function(aWindow) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::_setWindowAsHighestDepth");
		var position = ArrayFunctions.indexOfInArray(this._windowsOrder, aWindow);
		if(position !== -1) {
			if(position !== this._windowsOrder.length-1 && !this._isUpdatingDepths) {
				this._currentDepthOrder.setAsDirty();
			}
			this._windowsOrder.splice(position, 1);
		}
		
		this._windowsOrder.push(aWindow);
		if(this._currentFocusedWindow !== null) {
			this._currentFocusedWindow.getProperty("hasFocus").setValue(false);
			this._currentFocusedWindow.getExtendedEvent().perform(WindowExtendedEventIds.BLUR);
			this._currentFocusedWindow._checkForLastPosition();
		}
		this._currentFocusedWindow = aWindow;
		this._currentFocusedWindow.getProperty("hasFocus").setValue(true);
		
		//console.log(this._windowsOrder);
	};
	
	objectFunctions._windowClosed = function(aWindow) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::_windowClosed");
		var position = ArrayFunctions.indexOfInArray(this._windowsOrder, aWindow);
		if(position !== -1) {
			this._windowsOrder.splice(position, 1);
		}
		
		if(aWindow === this._currentFocusedWindow) {
			this._currentFocusedWindow = null;
		}
		
		//console.log(this._windowsOrder);
	};
	
	objectFunctions._getWindowsInDepthOrder = function() {
		var returnArray = new Array();
		var returnArrayLength = 0;
		var currentArray = this._windows.getObjectsArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentWindow = currentArray[i];
			if(currentWindow.isOpen()) {
				var isInserted = false;
				for(var j = 0; j < returnArrayLength; j++) {
					if(currentWindow.getProperty("z").getValueWithoutFlow() < returnArray[j].getProperty("z").getValueWithoutFlow()) {
						returnArray.splice(j, 0, currentWindow);
						isInserted = true;
						break;
					}
				}
				if(!isInserted) {
					returnArray.push(currentWindow);
				}
				returnArrayLength++;
			}
		}
		return returnArray;
	};
	
	objectFunctions._updateFlowDepth = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::_updateFlowDepth");
		this._isUpdatingDepths = true;
		var currentArray = this._getWindowsInDepthOrder();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentWindow = currentArray[i];
			if(currentWindow !== this._windowsOrder[i]) {
				currentWindow.focus();
			}
		}
		
		this._depth.setValueWithFlow(null, aFlowUpdateNumber);
		this._isUpdatingDepths = false;
		//console.log("//com.developedbyme.core.globalobjects.windowmanager.WindowManager::_updateFlowDepth");
	};
	
	objectFunctions.updateDepths = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.WindowManager::updateDepths");
		if(this._isUpdatingDepths) return;
		this._currentDepthOrder.setAsDirty();
		dbm.singletons.dbmFlowManager.updateProperty(this._depth);
	};
});