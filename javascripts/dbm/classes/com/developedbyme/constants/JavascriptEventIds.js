dbm.registerClass("com.developedbyme.constants.JavascriptEventIds", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.JavascriptEventIds");
	
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	//MENOTE: DOM unspecified
	staticFunctions.DOM_CONTENT_LOADED = "DOMContentLoaded";
	staticFunctions.PROGRESS = "progress";
	
	//MENOTE: DOM level 3
	//MENOTE: List of which element and which type they are can be found at http://www.w3.org/TR/DOM-Level-3-Events/#event-types-list
	staticFunctions.ABORT = "abort";
	staticFunctions.BLUR = "blur";
	staticFunctions.CLICK = "click";
	staticFunctions.COMPOSITION_START = "compositionstart";
	staticFunctions.COMPOSITION_UPDATE = "compositionupdate";
	staticFunctions.COMPOSITION_END = "compositionend";
	staticFunctions.DOUBLE_CLICK = "dblclick";
	staticFunctions.DOM_ACTIVATE = "DOMActivate";
	staticFunctions.DOM_ATTRIBUTE_NAME_CHANGED = "DOMAttributeNameChanged";
	staticFunctions.DOM_ATTRIBUTE_MODIFIED = "DOMAttrModified";
	staticFunctions.DOM_CHARACTER_DATA_MODIFIED = "DOMCharacterDataModified";
	staticFunctions.DOM_ELEMENT_NAME_CHANGED = "DOMElementNameChanged";
	staticFunctions.DOM_FOCUS_IN = "DOMFocusIn";
	staticFunctions.DOM_FOCUS_OUT = "DOMFocusOut";
	staticFunctions.DOM_NODE_INSERTED = "DOMNodeInserted";
	staticFunctions.DOM_NODE_INSERTED_INTO_DOCUMENT = "DOMNodeInsertedIntoDocument";
	staticFunctions.DOM_NODE_REMOVED = "DOMNodeRemoved";
	staticFunctions.DOM_NODE_REMOVED_FROM_DOCUMENT = "DOMNodeRemovedFromDocument";
	staticFunctions.DOM_SUBTREE_MODIFIED = "DOMSubtreeModified";
	staticFunctions.ERROR = "error";
	staticFunctions.FOCUS = "focus";
	staticFunctions.FOCUS_IN = "focusin";
	staticFunctions.FOCUS_OUT = "focusout";
	staticFunctions.KEY_DOWN = "keydown";
	staticFunctions.KEY_PRESS = "keypress";
	staticFunctions.KEY_UP = "keyup";
	staticFunctions.LOAD = "load";
	staticFunctions.MOUSE_DOWN = "mousedown";
	staticFunctions.MOUSE_ENTER = "mouseenter";
	staticFunctions.MOUSE_LEAVE = "mouseleave";
	staticFunctions.MOUSE_MOVE = "mousemove";
	staticFunctions.MOUSE_OUT = "mouseout";
	staticFunctions.MOUSE_OVER = "mouseover";
	staticFunctions.MOUSE_UP = "mouseup";
	staticFunctions.RESIZE = "resize";
	staticFunctions.SCROLL = "scroll";
	staticFunctions.SELECT = "select";
	staticFunctions.TEXT_INPUT = "textinput";
	staticFunctions.UNLOAD = "unload";
	staticFunctions.WHEEL = "wheel";

	//MENOTE: DOM level 2
	staticFunctions.CHANGE = "change";
	staticFunctions.RESET = "reset";
	staticFunctions.SUBMIT = "submit";
	
	//MENOTE: Orientation event
	staticFunctions.DEVICE_ORIENTATION = "deviceorientation";
	staticFunctions.COMPASS_NEEDS_CALIBRATION = "compassneedscalibration";
	staticFunctions.DEVICE_MOTION = "devicemotion";
	
	//MENOTE: Touch event
	staticFunctions.TOUCH_START = "touchstart";
	staticFunctions.TOUCH_END = "touchend";
	staticFunctions.TOUCH_MOVE = "touchmove";
	staticFunctions.TOUCH_ENTER = "touchenter";
	staticFunctions.TOUCH_LEAVE = "touchleave";
	staticFunctions.TOUCH_CANCEL = "touchcancel";
});