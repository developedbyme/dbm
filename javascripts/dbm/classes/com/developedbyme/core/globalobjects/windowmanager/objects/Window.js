/**
 * Controller for a window
 *
 * Notes: Chrome 13.0.782.215 doesn't have the outer and inner width directly when opened
 *
 * @author	Mattias	(mattias@developedbyme.com)
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.core.globalobjects.windowmanager.objects.Window", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Window = dbm.importClass("com.developedbyme.core.globalobjects.windowmanager.objects.Window");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var BrowserDependentFunction = dbm.importClass("com.developedbyme.core.objectparts.BrowserDependentFunction");
	
	var WindowExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.WindowExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	staticFunctions._MOUSE_POSITION_UPDATE = "mousePositionUpdate";
	
	staticFunctions.DEFAULT_URL = "empty.html"; //"about:blank";
	
	/**
	 * Constructor
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::init");
		
		this.superCall();
		
		this.name = null;
		
		this._isOpen = false;
		this._window = null;
		
		this._url = ClassReference.DEFAULT_URL;
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._z = this.createProperty("z", 0);
		
		this._width = this.createProperty("width", 640);
		this._height = this.createProperty("height", 480);
		
		this._size = this.createGhostProperty("size");
		this._position = this.createGhostProperty("position");
		this._display = this.createGhostProperty("display");
		
		this.createUpdateFunction("position", this._updateFlowPosition, [this._x, this._y], [this._position]);
		this.createUpdateFunction("size", this._updateFlowSize, [this._width, this._height], [this._size]);
		this.createGhostUpdateFunction("display", [this._position, this._size], [this._display]);
		
		this._verticalMargin = 0;
		this._horizontalMargin = 0;
		
		this._hasMargins = false;
		this._hasSpecificMargins = false;
		this._marginLeft = 0;
		this._marginTop = 0;
		this._marginRight = 0;
		this._marginBottom = 0;
		
		this._status = false;
		this._toolbar = false;
		this._location = false;
		this._menubar = false;
		this._directories = false;
		this._resizable	= false;
		this._scrollbars = true;
		
		this._updatePositionFunction = BrowserDependentFunction.create(this).setDefaultFunction(this._browser_default_updatePosition);
		this._updatePositionFunction.addBrowserSpecificFunction("Firefox", null, this._browser_firefox_updatePosition);
		
		this.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.RESIZE, CallFunctionCommand.createCommand(this, this._sizeUpdated, []));
		
		this.getExtendedEvent().addCommandToEvent(ClassReference._MOUSE_POSITION_UPDATE, CallFunctionCommand.createCommand(this, this._mousePositionUpdate, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.DOCUMENT_LOADED, CallFunctionCommand.createCommand(this, this._documentLoaded, []));
		this.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.DOCUMENT_UNLOADED, CallFunctionCommand.createCommand(this, this._documentUnloaded, []));
		
		return this;
	};
	
	objectFunctions.setupFromExistingWindow = function(aWindow) {
		this._isOpen = true;
		this._window = aWindow;
		
		this._url = this._window.document.location.href;
		
		this._x.setValue(this._window.screenX);
		this._y.setValue(this._window.screenY);
		
		this._width.setValue(this._window.innerWidth);
		this._height.setValue(this._window.innerHeight);
		
		this._horizontalMargin = this._window.outerWidth-this._window.innerWidth;
		this._verticalMargin = this._window.outerHeight-this._window.innerHeight;
		this._hasMargins = true;
		
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.MOUSE_MOVE, ClassReference._MOUSE_POSITION_UPDATE, ClassReference._MOUSE_POSITION_UPDATE, true);
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._MOUSE_POSITION_UPDATE);
	}
	
	objectFunctions.setUrl = function(aUrl) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::setUrl");
		
		this._url = aUrl;
		
		return this;
	};
	
	objectFunctions.setPosition = function(aX, aY) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::setPosition");
		
		if(this._x.canBeSet()) {
			this._x.setValue(aX);
		}
		else {
			this._x.setAsDirty();
		}
		
		if(this._y.canBeSet()) {
			this._y.setValue(aY);
		}
		else {
			this._y.setAsDirty();
		}
		
		this.getProperty("position").update();
		
		return this;
	};
	
	objectFunctions.setSize = function(aWidth, aHeight) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::setSize");
		//console.log(this.name, aWidth, aHeight);
		
		if(this._width.canBeSet()) {
			this._width.setValue(aWidth);
		}
		else {
			this._width.setAsDirty();
		}
		
		if(this._height.canBeSet()) {
			this._height.setValue(aHeight);
		}
		else {
			this._height.setAsDirty();
		}
		
		this.getProperty("size").update();
		
		return this;
	};
	
	objectFunctions.isOpen = function() {
		return this._isOpen;
	}
	
	objectFunctions.getDocument = function() {
		if(!this.isOpen()) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "getDocument", "Document can't be used for closed windows.");
			return null;
		}
		return this._window.document;
	}
	
	objectFunctions.getHtmlCreator = function() {
		if(!this.isOpen()) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "getHtmlCreator", "Html creator can't be used for closed windows.");
			return null;
		}
		return dbm.singletons["dbmHtmlDomManager"].getHtmlCreator(this._window.document);
	}
	
	objectFunctions._updateFlowSize = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_updateFlowSize");
		if(this._isOpen) {
			if(this._hasMargins) {
				this._window.resizeTo(this._width.getValueWithoutFlow()+this._horizontalMargin, this._height.getValueWithoutFlow()+this._verticalMargin);
			}
		}
	}
	
	objectFunctions._updateFlowPosition = function(aFlowUpdateNumber) {
		if(this._isOpen) {
			this._updatePosition(this._x.getValueWithoutFlow(), this._y.getValueWithoutFlow());
		}
	}
	
	objectFunctions._updatePosition = function(aX, aY) {
		this._updatePositionFunction.callFunction(arguments);
	}
	
	objectFunctions._browser_firefox_updatePosition = function(aX, aY) {
		this._window.moveTo(aX, aY);
	}
	
	objectFunctions._browser_default_updatePosition = function(aX, aY) {
		this._window.moveTo(aX-this._window.screen.availLeft, aY-this._window.screen.availTop);
	}
	
	objectFunctions._sizeUpdated = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_sizeUpdate");
		//console.log(this.name);
		//console.log(this._window.outerWidth, this._window.outerHeight, this._window.innerWidth, this._window.innerHeight, this._horizontalMargin, this._verticalMargin);
		
		if(!this._hasMargins) {
			if((this._window.innerWidth != 0 || this._window.innerHeight != 0) && (this._window.outerWidth-this._window.innerWidth > 0 || this._window.outerHeight-this._window.innerHeight > 0)) {
				this._horizontalMargin = this._window.outerWidth-this._window.innerWidth;
				this._verticalMargin = this._window.outerHeight-this._window.innerHeight;
				this._hasMargins = true;
				
				if(this._width.getValue() != this._window.innerWidth || this._height.getValue() != this._window.innerHeight) {
					this.setSize(this._width.getValue(), this._height.getValue());
				}
			}
		}
		else {
			this.setSize(this._window.innerWidth, this._window.innerHeight);
			
			//METODO: reset margins
		}
	};
	
	objectFunctions._positionUpdated = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_positionUpdated");
		//console.log(this._window.screenX, this._x.getValue(), this._window.screenY, this._y.getValue());
		
		this.setPosition(this._window.screenX, this._window.screenY);
		
		if(this.getExtendedEvent().hasEvent(WindowExtendedEventIds.MOVE)) {
			this.getExtendedEvent().perform(WindowExtendedEventIds.MOVE);
		}
		
		//this.setPosition(lastX, lastY);
	};
	
	objectFunctions._mousePositionUpdate = function(aEvent) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_mousePositionUpdate");
		
		var marginTop = (aEvent.screenX-(this._window.screenX))-aEvent.pageX;
		var marginLeft = (aEvent.screenY-(this._window.screenY))-aEvent.pageY;
		
		if(marginTop >= 0 && marginLeft >= 0) {
			
			this._hasSpecificMargins = true;
			
			this._marginLeft = marginLeft;
			this._marginTop = marginTop;
			this._marginRight = this._horizontalMargin-marginLeft;
			this._marginBottom = this._verticalMargin-marginTop;
			
			this.getExtendedEvent().deactivateJavascriptEventLink(ClassReference._MOUSE_POSITION_UPDATE);
		}
	};
	
	objectFunctions._documentLoaded = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_documentLoaded");
	};
	
	objectFunctions._documentUnloaded = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_documentUnloaded");
	};
	
	objectFunctions.setFeatures = function(aStatus, aToolbar, aLocation, aMenubar, aDirectories, aResizable, aScrollbars) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::setFeatures");
		
		this._status = aStatus;
		this._toolbar = aToolbar;
		this._location = aLocation;
		this._menubar = aMenubar;
		this._directories = aDirectories;
		this._resizable	= aResizable;
		this._scrollbars = aScrollbars;
		
		return this;
	};
	
	objectFunctions.open = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::open");
		if(this._isOpen) return this;
		
		this._isOpen = true;
		this._window = window.open(this._url, this.name, this._getFeaturesString());
		
		if(this._x.canBeSet()) {
			this._x.setValue(this._window.screenX);
		}
		if(this._y.canBeSet()) {
			this._y.setValue(this._window.screenY);
		}
		
		this._verticalMargin = this._window.outerHeight-this._height.getValue();
		this._horizontalMargin = this._window.outerWidth-this._width.getValue();
		
		if(this._verticalMargin > 0 || this._horizontalMargin > 0) {
			this._hasMargins = true;
		}
		
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.RESIZE, WindowExtendedEventIds.RESIZE, WindowExtendedEventIds.RESIZE, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.MOUSE_MOVE, ClassReference._MOUSE_POSITION_UPDATE, ClassReference._MOUSE_POSITION_UPDATE, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.FOCUS, WindowExtendedEventIds.FOCUS, WindowExtendedEventIds.FOCUS, true, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.BLUR, WindowExtendedEventIds.BLUR, WindowExtendedEventIds.BLUR, true, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.LOAD, WindowExtendedEventIds.DOCUMENT_LOADED, WindowExtendedEventIds.DOCUMENT_LOADED, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.UNLOAD, WindowExtendedEventIds.DOCUMENT_UNLOADED, WindowExtendedEventIds.DOCUMENT_UNLOADED, true).activate();
		
		dbm.singletons.dbmUpdateManager.addUpdater(this, "updateInput");
		
		if(this.getExtendedEvent().hasEvent(WindowExtendedEventIds.OPEN)) {
			this.getExtendedEvent().perform(WindowExtendedEventIds.OPEN);
		}
		
		//console.log(this._window);
		
		return this;
	};
	
	objectFunctions.close = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::close");
		if(!this._isOpen) return this;
		
		this._isOpen = false;
		
		this._window.close();
		this._window = null;
		
		dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateInput");
		
		if(this.getExtendedEvent().hasEvent(WindowExtendedEventIds.CLOSE)) {
			this.getExtendedEvent().perform(WindowExtendedEventIds.CLOSE);
		}
		
		return this;
	};
	
	objectFunctions.blur = function() {
		if(!this._isOpen) return;
		
		this._window.blur();
	}
	
	objectFunctions.focus = function() {
		if(!this._isOpen) return;
		
		this._window.focus();
	}
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		if(this._window.closed) {
			this._isOpen = false;
			this._window = null;
			dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateInput");
			if(this.getExtendedEvent().hasEvent(WindowExtendedEventIds.CLOSE)) {
				this.getExtendedEvent().perform(WindowExtendedEventIds.CLOSE);
			}
			return;
		}
		
		if(!this._hasMargins) {
			this._sizeUpdated();
		}
		
		if(this._window.screenX != this._x.getValue() || this._window.screenY != this._y.getValue()) {
			this._positionUpdated();
		}
	};
	
	objectFunctions._getFeaturesString = function() {
		var returnString = "";
		
		returnString += "left=" + (this._x.getValue());
		returnString += ",top=" + (this._y.getValue());
		returnString += ",width=" + (this._width.getValue());
		returnString += ",height=" + (this._height.getValue());
		returnString += ",status=" + ((this._status) ? 1 : 0);
		returnString += ",toolbar=" + ((this._toolbar) ? 1 : 0);
		returnString += ",location=" + ((this._location) ? 1 : 0);
		returnString += ",menubar=" + ((this._menubar) ? 1 : 0);
		returnString += ",directories=" + ((this._directories) ? 1 : 0);
		returnString += ",resizable=" + ((this._resizable) ? 1 : 0);
		returnString += ",scrollbars=" + ((this._scrollbars) ? 1 : 0);
		
		//console.log(returnString);
		
		return returnString;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case WindowExtendedEventIds.OPEN:
			case WindowExtendedEventIds.CLOSE:
			case WindowExtendedEventIds.RESIZE:
			case WindowExtendedEventIds.MOVE:
			case WindowExtendedEventIds.FOCUS:
			case WindowExtendedEventIds.BLUR:
			case WindowExtendedEventIds.DOCUMENT_LOADED:
			case WindowExtendedEventIds.DOCUMENT_UNLOADED:
			case ClassReference._MOUSE_POSITION_UPDATE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aName, aUrl, aWidth, aHeight) {
		var newWindow = (new Window()).init();
		 newWindow.name = aName;
		 if(aUrl != null) {
		 	newWindow.setUrl(aUrl);
		 }
		 if(aWidth != null && aHeight != null) {
			 newWindow.setSize(aWidth, aHeight);
		 }
		 return newWindow;
	};
});