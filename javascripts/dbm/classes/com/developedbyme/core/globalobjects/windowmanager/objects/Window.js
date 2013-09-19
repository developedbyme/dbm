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
	var SetPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var BrowserDependentFunction = dbm.importClass("com.developedbyme.core.objectparts.BrowserDependentFunction");
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var Margins = dbm.importClass("com.developedbyme.core.globalobjects.windowmanager.data.Margins");
	var DocumentForElementNode = dbm.importClass("com.developedbyme.flow.nodes.browser.DocumentForElementNode");
	
	var WindowExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.WindowExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	staticFunctions._MOUSE_POSITION_UPDATE = "mousePositionUpdate";
	
	staticFunctions.DEFAULT_URL = "empty.html"; //"about:blank";
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_init");
		
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
		
		this._documentReady = this.createProperty("documentReady", false);
		this._documentLoaded = this.createProperty("documentLoaded", false);
		this._bodyNode = this.createProperty("bodyNode", null);
		var documentForElementNode = DocumentForElementNode.create(this._bodyNode);
		this.addDestroyableObject(documentForElementNode);
		this._document = this.createProperty("document", documentForElementNode.getProperty("document"));
		
		this._size = this.createGhostProperty("size");
		this._position = this.createGhostProperty("position");
		this._display = this.createGhostProperty("display");
		this._iconDisplay = this.createGhostProperty("iconDisplay");
		
		this._title = this.addProperty("title", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._icon = null;
		
		this.createUpdateFunction("position", this._updateFlowPosition, [this._x, this._y], [this._position]);
		this.createUpdateFunction("size", this._updateFlowSize, [this._width, this._height, this._documentReady], [this._size]);
		this.createGhostUpdateFunction("display", [this._size, this._position, this._title, this._iconDisplay], [this._display]);
		
		this._useDefaultMargins = true;
		this._margins = null;
		
		this._isOpening = false;
		this._lastDocument = null;
		
		//MENOTE: MSIE 9 can change screen position of windows while executing code so it must be cached to not get errors.
		this._cachedScreenX = 0;
		this._cachedScreenY = 0;
		
		this._lastResizeWidth = -1;
		this._lastResizeHeight = -1;
		
		this._hasFocus = this.createProperty("hasFocus", false);
		this._checkMovement = this.createProperty("checkMovement", false);
		this._checkSize = this.createProperty("checkSize", true);
		
		this._lastMovementCheckTime = 0;
		this._movementCheckInterval = 0.5;
		this._lastSizeCheckTime = 0;
		this._sizeCheckInterval = 1;
		
		this._status = false;
		this._toolbar = false;
		this._location = false;
		this._menubar = false;
		this._directories = false;
		this._resizable = true;
		this._scrollbars = true;
		
		this._updatePositionFunction = BrowserDependentFunction.create(this).setDefaultFunction(this._browser_default_updatePosition);
		this.addDestroyableObject(this._updatePositionFunction);
		this._updatePositionFunction.addBrowserSpecificFunction("Firefox", null, this._browser_firefox_updatePosition);
		this._updatePositionFunction.addBrowserSpecificFunction("MSIE", null, this._browser_msie_updatePosition);
		
		this._windowReadyDirectlyFunction = BrowserDependentFunction.create(this).setDefaultFunction(this._browser_default_windowReadyDirectly);
		this.addDestroyableObject(this._windowReadyDirectlyFunction);
		this._windowReadyDirectlyFunction.addBrowserSpecificFunction("MSIE", null, this._browser_msie_windowReadyDirectly);
		
		this.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.RESIZE, CallFunctionCommand.createCommand(this, this._sizeUpdated, []));
		
		//MENOTE: getting margins is slow
		//this.getExtendedEvent().addCommandToEvent(ClassReference._MOUSE_POSITION_UPDATE, CallFunctionCommand.createCommand(this, this._mousePositionUpdate, [GetVariableObject.createSelectDataCommand()]));
		this.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.DOCUMENT_READY, CallFunctionCommand.createCommand(this, this._documentReadyCallback, []));
		this.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.DOCUMENT_LOADED, CallFunctionCommand.createCommand(this, this._documentLoadedCallback, []));
		this.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.DOCUMENT_UNLOADED, CallFunctionCommand.createCommand(this, this._documentUnloadedCallback, []));
		
		this.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.FOCUS, SetPropertyCommand.createCommand(this._hasFocus, true));
		this.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.BLUR, CallFunctionCommand.createCommand(this, this._checkForLastPosition, []));
		this.getExtendedEvent().addCommandToEvent(WindowExtendedEventIds.BLUR, SetPropertyCommand.createCommand(this._hasFocus, false));
		
		return this;
	};
	
	objectFunctions.setupFromExistingWindow = function(aWindow) {
		this._isOpen = true;
		this._window = aWindow;
		
		this._url = this._window.document.location.href;
		
		this._x.setValue(this._window.screenX);
		this._y.setValue(this._window.screenY);
		
		var innerWidth = this._window.innerWidth;
		var innerHeight = this._window.innerHeight;
		
		this._width.setValue(innerWidth);
		this._height.setValue(innerHeight);
		
		if(this._margins === null) {
			this._useDefaultMargins = false;
			this._margins = Margins.create(this._window.outerWidth-innerWidth, this._window.outerHeight-innerHeight);
		}
		
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.RESIZE, WindowExtendedEventIds.RESIZE, WindowExtendedEventIds.RESIZE, true).activate();
		//MENOTE: getting margins is slow
		//this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.MOUSE_MOVE, ClassReference._MOUSE_POSITION_UPDATE, ClassReference._MOUSE_POSITION_UPDATE, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.FOCUS, WindowExtendedEventIds.FOCUS, WindowExtendedEventIds.FOCUS, true, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.BLUR, WindowExtendedEventIds.BLUR, WindowExtendedEventIds.BLUR, true, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.DOM_CONTENT_LOADED, WindowExtendedEventIds.DOCUMENT_READY, WindowExtendedEventIds.DOCUMENT_READY, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.LOAD, WindowExtendedEventIds.DOCUMENT_LOADED, WindowExtendedEventIds.DOCUMENT_LOADED, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.UNLOAD, WindowExtendedEventIds.DOCUMENT_UNLOADED, WindowExtendedEventIds.DOCUMENT_UNLOADED, true).activate();
	};
	
	objectFunctions.setUrl = function(aUrl) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::setUrl");
		
		this._url = aUrl;
		
		return this;
	};
	
	objectFunctions.getBrowserWindow = function() {
		return this._window;
	};
	
	objectFunctions.setPosition = function(aX, aY) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::setPosition");
		
		if(this._x.canBeSet()) {
			this._x.setValue(Math.round(aX));
		}
		else {
			this._x.setAsDirty();
		}
		
		if(this._y.canBeSet()) {
			this._y.setValue(Math.round(aY));
		}
		else {
			this._y.setAsDirty();
		}
		
		this.getProperty("position").update();
		
		return this;
	};
	
	objectFunctions.setSize = function(aWidth, aHeight) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::setSize");
		//console.log(this.name, aWidth, this._width.getValue(), aHeight, this._height.getValue());
		
		if(this._width.canBeSet()) {
			this._width.setValue(Math.round(aWidth));
		}
		else {
			this._width.setAsDirty();
		}
		
		if(this._height.canBeSet()) {
			this._height.setValue(Math.round(aHeight));
		}
		else {
			this._height.setAsDirty();
		}
		
		this.getProperty("size").update();
		
		return this;
	};
	
	objectFunctions.isOpen = function() {
		return this._isOpen;
	};
	
	objectFunctions.getDocument = function() {
		if(!this.isOpen()) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "getDocument", "Document can't be used for closed windows.");
			return null;
		}
		return this._window.document;
	};
	
	objectFunctions.getWindow = function() {
		if(!this.isOpen()) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "getWindow", "Window isn't open.");
			return null;
		}
		return this._window;
	};
	
	objectFunctions.getHtmlCreator = function() {
		if(!this.isOpen()) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "getHtmlCreator", "Html creator can't be used for closed windows.");
			return null;
		}
		return dbm.singletons.dbmHtmlDomManager.getHtmlCreator(this._window.document);
	};
	
	objectFunctions.getAvailableHtmlCreator = function() {
		if(!this.isOpen()) {
			return dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		}
		return dbm.singletons.dbmHtmlDomManager.getHtmlCreator(this._window.document);
	};
	
	objectFunctions.useIcon = function() {
		this._icon = this.addProperty("icon", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this.createUpdateFunction("icon", this._updateIconFlow, [this._icon], [this._iconDisplay]);
		
		if(this._documentReady.getValue()) {
			this._setupIconLink();
		}
	};
	
	objectFunctions._updateFlowSize = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_updateFlowSize");
		
		var innerWidth;
		var innerHeight;
		var outerWidth;
		var outerHeight;
		
		if(this._isOpen && this._documentReady.getValueWithoutFlow()) {
			if(this._isOpening) {
				innerWidth = this._window.innerWidth;
				innerHeight = this._window.innerHeight;
				outerWidth = this._window.outerWidth;
				outerHeight = this._window.outerHeight;
				if((innerWidth > 0 || innerHeight > 0) && (innerWidth !== outerWidth || innerHeight !== outerHeight)) {
					this._isOpening = false;
				}
				
			}
			if(!this._isOpening) {
				var newWidth = Math.round(this._width.getValueWithoutFlow());
				var newHeight = Math.round(this._height.getValueWithoutFlow());
				
				innerWidth = this._window.innerWidth;
				innerHeight = this._window.innerHeight;
				
				if(newWidth !== innerWidth || newHeight !== innerHeight) {
					//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_updateFlowSize");
					this._updateSize(newWidth, newHeight);
				}
			}
		}
	};
	
	objectFunctions._updateFlowPosition = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_updateFlowPosition");
		if(this._isOpen) {
			var newX = Math.round(this._x.getValueWithoutFlow());
			var newY = Math.round(this._y.getValueWithoutFlow());
			if(newX !== this._cachedScreenX || newY !== this._cachedScreenY) {
				//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_updateFlowPosition");
				//console.log(newX + " " + this._cachedScreenX + " " + newY + " " + this._cachedScreenY);
				this._updatePosition(newX, newY);
			}
		}
	};
	
	objectFunctions._updateIconFlow = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_updateIconFlow");
		if(this._isOpen) {
			var icon = this._icon.getExternalObject();
			if(icon !== null) {
				var iconParent = icon.parentNode;
				iconParent.removeChild(icon);
				iconParent.appendChild(icon);
			}
		}
	};
	
	
	objectFunctions._updateSize = function(aWidth, aHeight) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_updateSize");
		//console.log(this.name);
		
		//this._horizontalMargin = this._window.outerWidth-this._window.innerWidth;
		//this._verticalMargin = this._window.outerHeight-this._window.innerHeight;
		
		if(this._margins === null) {
			var innerWidth = this._window.innerWidth;
			var innerHeight = this._window.innerHeight;
			var outerWidth = this._window.outerWidth;
			var outerHeight = this._window.outerHeight;
			
			var horizontalMargin = outerWidth-innerWidth;
			var verticalMargin = outerHeight-innerHeight;
			
			var isMarginReady = (horizontalMargin > 0 || verticalMargin > 0) && horizontalMargin < 50 && verticalMargin < 100 && (innerWidth !== 0 || innerHeight !== 0);
			
			if(!isMarginReady) return;
			
			if(this._useDefaultMargins) {
				dbm.singletons.dbmWindowManager.setDefaultMargins(horizontalMargin, verticalMargin);
				this._margins = dbm.singletons.dbmWindowManager.getDefaultMargins();
			}
			else {
				this._margins = Margins.create(horizontalMargin, verticalMargin);
			}
		}
		
		this._window.resizeTo(Math.round(aWidth+this._margins.horizontalMargin), Math.round(aHeight+this._margins.verticalMargin));
	};
	
	objectFunctions._updateSizeBy = function(aWidth, aHeight) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_updateSizeBy");
		//console.log(aWidth, aHeight, this._margins.horizontalMargin, this._margins.verticalMargin);
		
		//this._horizontalMargin = this._window.outerWidth-this._window.innerWidth;
		//this._verticalMargin = this._window.outerHeight-this._window.innerHeight;
		
		this._window.resizeBy(aWidth, aHeight);
	};
	
	objectFunctions._updatePosition = function(aX, aY) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_updatePosition");
		this._updatePositionFunction.callFunction(arguments);
	};
	
	objectFunctions._browser_firefox_updatePosition = function(aX, aY) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_browser_firefox_updatePosition");
		this._window.moveTo(aX, aY);
	};
	
	objectFunctions._browser_msie_updatePosition = function(aX, aY) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_browser_msie_updatePosition");
		//MENOTE: MSIE doesn't have availLeft or availTop
		try {
			this._window.moveTo(aX, aY);
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_browser_msie_updatePosition", "Un error occured while moving the window.");
			ErrorManager.getInstance().reportError(this, "_browser_msie_updatePosition", theError);
		}
	};
	
	objectFunctions._browser_default_updatePosition = function(aX, aY) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_browser_default_updatePosition");
		try {
			this._window.moveTo(aX-dbm.singletons.dbmWindowManager.getScreenSizeNode().getProperty("availLeft").getValue(), aY-dbm.singletons.dbmWindowManager.getScreenSizeNode().getProperty("availTop").getValue());
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_browser_default_updatePosition", "Un error occured while moving the window.");
			ErrorManager.getInstance().reportError(this, "_browser_default_updatePosition", theError);
		}
	};
	
	objectFunctions._sizeUpdated = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_sizeUpdate");
		//console.log(this.name, ", ", this._window.outerWidth, ", ", this._window.innerWidth, ", ", this._width.getValue(), ", ", this._window.outerHeight, ", ", this._window.innerHeight, ", ", this._height.getValue());
		
		//console.log(this._hasMargins, this._window.outerWidth, this._window.outerHeight, this._window.innerWidth, this._window.innerHeight, this._horizontalMargin, this._verticalMargin);
		
		var innerWidth = null;
		var innerHeight = null;
		var outerWidth = null;
		var outerHeight = null;
		
		if(this._window !== null) {
			if(this._isOpening) {
				innerWidth = this._window.innerWidth;
				innerHeight = this._window.innerHeight;
				outerWidth = this._window.outerWidth;
				outerHeight = this._window.outerHeight;
				if((innerWidth > 0 || innerHeight > 0) && (innerWidth !== outerWidth || innerHeight !== outerHeight)) {
					this._isOpening = false;
				}
				
			}
			
			if(!this._isOpening) {
				if(innerWidth === null) {
					innerWidth = this._window.innerWidth;
					innerHeight = this._window.innerHeight;
				}
				if(innerWidth !== this._lastResizeWidth && innerHeight !== this._lastResizeHeight) {
					this._lastResizeWidth = innerWidth;
					this._lastResizeHeight = innerHeight;
					this.setSize(innerWidth, innerHeight);
				}
			}
			else {
				//console.log("resizing");
			}
		}
		
		//console.log(innerWidth, innerHeight);
		
		dbm.singletons.dbmFlowManager.updateProperties();
		
		//console.log("//com.developedbyme.core.globalobjects.windowmanager.objects.Window::_sizeUpdate");
	};
	
	objectFunctions._positionUpdated = function(aX, aY) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_positionUpdated");
		//console.log(aX, aY);
		
		this._cachedScreenX = aX;
		this._cachedScreenY = aY;
		
		this.setPosition(this._cachedScreenX, this._cachedScreenY);
		
		if(this.getExtendedEvent().hasEvent(WindowExtendedEventIds.MOVE)) {
			this.getExtendedEvent().perform(WindowExtendedEventIds.MOVE);
		}
		
		//this.setPosition(lastX, lastY);
	};
	
	objectFunctions._mousePositionUpdate = function(aEvent) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_mousePositionUpdate");
		
		//MENOTE: this._window.screenX and this._window.screenY are really slow
		var marginTop = (aEvent.screenX-(this._window.screenX))-aEvent.pageX;
		var marginLeft = (aEvent.screenY-(this._window.screenY))-aEvent.pageY;
		
		if(marginTop >= 0 && marginLeft >= 0) {
			
			//METODO: set specified margins
			
			this.getExtendedEvent().deactivateJavascriptEventLink(ClassReference._MOUSE_POSITION_UPDATE);
		}
	};
	
	objectFunctions._documentReadyCallback = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_documentReadyCallback");
		
		var theDocument = this._window.document;
		
		this._documentReady.setValue(true);
		this._bodyNode.setValue(theDocument.body);
		this._title.setupExternalObject(theDocument, "title");
		
		if(this._icon !== null) {
			this._setupIconLink();
		}
		
		dbm.singletons.dbmFlowManager.updateProperties();
		
		if(this._lastDocument !== null) {
			dbm.singletons.dbmHtmlDomManager.fullAdopt(this._lastDocument, theDocument);
		}
		this._lastDocument = theDocument;
		dbm.singletons.dbmHtmlDomManager.reactivateForNewDocument(theDocument);
	};
	
	objectFunctions._documentLoadedCallback = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_documentLoadedCallback");
		//console.log(this.name, this);
		this._documentReady.setValue(true);
	};
	
	objectFunctions._documentUnloadedCallback = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_documentUnloadedCallback");
		//console.log(this.name, this);
		this._documentLoaded.setValue(true);
	};
	
	objectFunctions._checkForLastPosition = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_checkForLastPosition");
		
		if(this._window !== null) {
			if(this._window.closed) {
				//MENOTE: do nothing
			}
			else {
				if(this._checkMovement.getValue()) {
					//MENOTE: this._window.screenX and this._window.screenY are really slow
					var newX = this._window.screenX;
					var newY = this._window.screenY;
					if((newX !== this._x.getValue() || newY !== this._y.getValue()) && !(newX === 0 && newY === 0)) {
						this._positionUpdated(newX, newY);
					}
				}
			}
		}
	};
	
	objectFunctions._setupIconLink = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_setupIconLink");
		
		var linkTag = null;
		var currentArray = this.getDocument().getElementsByTagName("link");
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTag = currentArray[i];
			if(currentTag.rel === "icon" || currentTag.rel === "shortcut icon") {
				linkTag = currentTag;
				break;
			}
		}
		if(linkTag === null) {
			linkTag = this.getHtmlCreator().createNode("link", {"rel": "icon", "type": "image/png"});
			this.getDocument().head.appendChild(linkTag);
		}
		
		this._icon.setupExternalObject(linkTag, "href");
		this._icon.setAsDirty();
		this._iconDisplay.update();
	};
	
	objectFunctions.setFeatures = function(aStatus, aToolbar, aLocation, aMenubar, aDirectories, aResizable, aScrollbars) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::setFeatures");
		
		this._status = aStatus;
		this._toolbar = aToolbar;
		this._location = aLocation;
		this._menubar = aMenubar;
		this._directories = aDirectories;
		this._resizable = aResizable;
		this._scrollbars = aScrollbars;
		
		return this;
	};
	
	objectFunctions.open = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::open");
		//console.log(this._width.getValue(), this._height.getValue());
		if(this._isOpen) return this;
		
		this._cachedScreenX = this._x.getValue();
		this._cachedScreenY = this._y.getValue();
		
		this._window = window.open(this._url, this.name, this._getFeaturesString());
		//console.log(this._getFeaturesString());
		this._isOpen = true;
		this._isOpening = true;
		
		//MENOTE: this._window.screenX and this._window.screenY are really slow
		//if(this._x.canBeSet()) {
		//	this._x.setValue(this._window.screenX);
		//}
		//if(this._y.canBeSet()) {
		//	this._y.setValue(this._window.screenY);
		//}
		
		var horizontalMargin = this._window.outerWidth-this._width.getValue();
		var verticalMargin = this._window.outerHeight-this._height.getValue();
		
		var isMarginReady = (horizontalMargin > 0 || verticalMargin > 0) && horizontalMargin < 50 && verticalMargin < 100 && (this._window.innerWidth !== 0 || this._window.innerHeight !== 0);
		
		if(this._useDefaultMargins && dbm.singletons.dbmWindowManager.hasDefaultMargins()) {
			this._margins = dbm.singletons.dbmWindowManager.getDefaultMargins();
		}
		else if(isMarginReady) {
			if(this._useDefaultMargins) {
				dbm.singletons.dbmWindowManager.setDefaultMargins(horizontalMargin, verticalMargin);
				this._margins = dbm.singletons.dbmWindowManager.getDefaultMargins();
			}
			else {
				this._margins = Margins.create(horizontalMargin, verticalMargin);
			}
		}
		
		if(isMarginReady) {
			this._isOpening = false;
			this._updateSize(this._width.getValue(), this._height.getValue());
		}
		
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.RESIZE, WindowExtendedEventIds.RESIZE, WindowExtendedEventIds.RESIZE, true).activate();
		//MENOTE: getting positions are slow
		//this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.MOUSE_MOVE, ClassReference._MOUSE_POSITION_UPDATE, ClassReference._MOUSE_POSITION_UPDATE, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.FOCUS, WindowExtendedEventIds.FOCUS, WindowExtendedEventIds.FOCUS, true, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.BLUR, WindowExtendedEventIds.BLUR, WindowExtendedEventIds.BLUR, true, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.DOM_CONTENT_LOADED, WindowExtendedEventIds.DOCUMENT_READY, WindowExtendedEventIds.DOCUMENT_READY, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.LOAD, WindowExtendedEventIds.DOCUMENT_LOADED, WindowExtendedEventIds.DOCUMENT_LOADED, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._window, JavascriptEventIds.UNLOAD, WindowExtendedEventIds.DOCUMENT_UNLOADED, WindowExtendedEventIds.DOCUMENT_UNLOADED, true).activate();
		
		dbm.singletons.dbmUpdateManager.addUpdater(this, "updateInput");
		
		if(this.getExtendedEvent().hasEvent(WindowExtendedEventIds.OPEN)) {
			this.getExtendedEvent().perform(WindowExtendedEventIds.OPEN);
		}
		
		this._windowReadyDirectlyFunction.callFunction();
		
		//console.log(this._window);
		
		return this;
	};
	
	objectFunctions._browser_default_windowReadyDirectly = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_browser_default_windowReadyDirectly");
		//MENOTE: do nothing
	};
	
	objectFunctions._browser_msie_windowReadyDirectly = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::_browser_msie_windowReadyDirectly");
		this.getExtendedEvent().perform(WindowExtendedEventIds.DOCUMENT_READY);
		this.getExtendedEvent().perform(WindowExtendedEventIds.DOCUMENT_LOADED);
	};
	
	objectFunctions.close = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::close");
		
		if(!this._isOpen) return this;
		
		this._documentReady.setValue(false);
		this._documentLoaded.setValue(false);
		this._bodyNode.setValue(null);
		
		try {
		
			this._isOpen = false;
			this._window.close();
			
			this._window = null;
			
			dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateInput");
			
			if(this.getExtendedEvent().hasEvent(WindowExtendedEventIds.CLOSE)) {
				this.getExtendedEvent().perform(WindowExtendedEventIds.CLOSE);
			}
		
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "close", "Un error occured while closing the window.");
			ErrorManager.getInstance().reportError(this, "close", theError);
		}
		return this;
	};
	
	objectFunctions.blur = function() {
		if(!this._isOpen) return;
		
		this._window.blur();
	};
	
	objectFunctions.focus = function() {
		if(!this._isOpen) return;
		
		this._window.focus();
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::updateTime");
		
		if(this._window.closed) {
			this._isOpen = false;
			this._window = null;
			this._documentReady.setValue(false);
			this._documentLoaded.setValue(false);
			this._hasFocus.setValue(false);
			dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateInput");
			if(this.getExtendedEvent().hasEvent(WindowExtendedEventIds.CLOSE)) {
				this.getExtendedEvent().perform(WindowExtendedEventIds.CLOSE);
			}
			return;
		}
		else {
			//console.log("check position", this.name, this._hasFocus.getValue(), this._checkMovement.getValue());
			if(this._hasFocus.getValue() && this._checkMovement.getValue() && aTime > this._lastMovementCheckTime+this._movementCheckInterval) {
				//MENOTE: this._window.screenX and this._window.screenY are really slow
				var newX = this._window.screenX;
				var newY = this._window.screenY;
				
				//console.log(newX, this._x.getValue(), newY, this._y.getValue());
				
				if(newX !== this._x.getValue() || newY !== this._y.getValue()) {
					this._positionUpdated(newX, newY);
				}
				this._lastMovementCheckTime = aTime;
			}
			if(this._checkSize.getValue() && this._documentLoaded.getValue() && (aTime > this._lastSizeCheckTime+this._sizeCheckInterval)) {
				var newWidth = Math.round(this._width.getValueWithoutFlow());
				var newHeight = Math.round(this._height.getValueWithoutFlow());
				
				var innerWidth = this._window.innerWidth;
				var innerHeight = this._window.innerHeight;
				
				if((innerWidth !== 0 && innerHeight !== 0) && (newWidth !== innerWidth || newHeight !== innerHeight) && this._margins !== null) {
					//console.log(newWidth, innerWidth, newHeight, innerHeight, this._margins.horizontalMargin, this._margins.verticalMargin, this._window.outerWidth-innerWidth, this._window.outerHeight-innerHeight);
					
					var newHorizontalMargin = this._window.outerWidth-innerWidth;
					var newVerticalMargin = this._window.outerHeight-innerHeight;
					
					var isMarginReady = (newHorizontalMargin > 0 || newVerticalMargin > 0) && newHorizontalMargin < 50 && newVerticalMargin < 100 && (innerWidth !== 0 || innerHeight !== 0);
					
					if(isMarginReady) {
						this._margins.horizontalMargin = newHorizontalMargin;
						this._margins.verticalMargin = newVerticalMargin;
						this._updateSize(newWidth, newHeight);
					}
				}
				
				this._lastSizeCheckTime = aTime;
			}
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
			case WindowExtendedEventIds.DOCUMENT_READY:
			case WindowExtendedEventIds.DOCUMENT_LOADED:
			case WindowExtendedEventIds.DOCUMENT_UNLOADED:
			case ClassReference._MOUSE_POSITION_UPDATE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_margins":
				return false;
		}
		return this.superCall();
	};
	
	objectFunctions.performDestroy = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::performDestroy");
		if(this._isOpen) {
			this.close();
		}
		dbm.singletons.dbmWindowManager._linkRegistration_removeWindow(this);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("com.developedbyme.core.globalobjects.windowmanager.objects.Window::setAllReferencesToNull");
		
		this._window = null;
		this._x = null;
		this._y = null;
		this._z = null;
		
		this._width = null;
		this._height = null;
		this._documentReady = null;
		this._documentLoaded = null;
		this._bodyNode = null;
		this._document = null;
		
		this._size = null;
		this._position = null;
		this._display = null;
		
		this._title = null;
		this._icon = null;
		this._iconDisplay = null;
		this._hasFocus = null;
		this._checkMovement = null;
		this._checkSize = null;
		this._lastDocument = null;
		
		this._margins = null;
		
		this._updatePositionFunction = null;
		this._windowReadyDirectlyFunction = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aName, aUrl, aWidth, aHeight) {
		var newWindow = (new Window()).init();
		newWindow.name = aName;
		if(aUrl !== null) {
			newWindow.setUrl(aUrl);
		}
		if(aWidth !== null && aHeight !== null) {
			 newWindow.setSize(aWidth, aHeight);
		}
		return newWindow;
	};
});