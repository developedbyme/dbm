dbm.registerClass("com.developedbyme.constants.JavascriptEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.JavascriptEventIds");
	
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	
	//MENOTE: DOM level 3
	staticFunctions.ABORT = "abort"; //Element > Event
	staticFunctions.BLUR = "blur"; //Element > FocusEvent
	staticFunctions.CLICK = "click"; //Element > MouseEvent
	staticFunctions.COMPOSITION_START = "compositionstart"; //Element > CompositionEvent
	staticFunctions.COMPOSITION_UPDATE = "compositionupdate"; //Element > CompositionEvent
	staticFunctions.COMPOSITION_END = "compositionend"; //Element > CompositionEvent
	staticFunctions.DOUBLE_CLICK = "dblclick"; //Element > MouseEvent
	staticFunctions.DOM_ACTIVATE = "DOMActivate"; //Element > UIEvent
	staticFunctions.DOM_ATTRIBUTE_NAME_CHANGED = "DOMAttributeNameChanged"; //Element > MutationNameEvent
	staticFunctions.DOM_ATTRIBUTE_MODIFIED = "DOMAttrModified"; //Element > MutationEvent
	staticFunctions.DOM_CHARACTER_DATA_MODIFIED = "DOMCharacterDataModified"; //Text, Comment, CDATASection, ProcessingInstruction > MutationEvent
	staticFunctions.DOM_ELEMENT_NAME_CHANGED = "DOMElementNameChanged"; //Element > MutationNameEvent
	staticFunctions.DOM_FOCUS_IN = "DOMFocusIn"; //Element > FocusEvent
	staticFunctions.DOM_FOCUS_OUT = "DOMFocusOut"; //Element > FocusEvent
	staticFunctions.DOM_NODE_INSERTED = "DOMNodeInserted"; //Element, Attr, Text, Comment, CDATASection, DocumentType, EntityReference, ProcessingInstruction > MutationEvent
	staticFunctions.DOM_NODE_INSERTED_INTO_DOCUMENT = "DOMNodeInsertedIntoDocument"; //Element, Attr, Text, Comment, CDATASection, DocumentType, EntityReference, ProcessingInstruction > MutationEvent
	staticFunctions.DOM_NODE_REMOVED = "DOMNodeRemoved"; //Element, Attr, Text, Comment, CDATASection, DocumentType, EntityReference, ProcessingInstruction > MutationEvent
	staticFunctions.DOM_NODE_REMOVED_FROM_DOCUMENT = "DOMNodeRemovedFromDocument"; //Element, Attr, Text, Comment, CDATASection, DocumentType, EntityReference, ProcessingInstruction > MutationEvent
	staticFunctions.DOM_SUBTREE_MODIFIED = "DOMSubtreeModified"; //defaultView, Document, DocumentFragment, Element, Attr > MutationEvent
	staticFunctions.ERROR = "error"; //Element > Event
	staticFunctions.FOCUS = "focus"; //Element > FocusEvent
	staticFunctions.FOCUS_IN = "focusin"; //Element > FocusEvent
	staticFunctions.FOCUS_OUT = "focusout"; //Element > FocusEvent
	staticFunctions.KEY_DOWN = "keydown"; //Document, Element > KeyboardEvent
	staticFunctions.KEY_PRESS = "keypress"; //Document, Element > KeyboardEvent
	staticFunctions.KEY_UP = "keyup"; //Document, Element > KeyboardEvent
	staticFunctions.LOAD = "load"; //defaultView, Document, Element > Event
	staticFunctions.MOUSE_DOWN = "mousedown"; //Element > MouseEvent
	staticFunctions.MOUSE_ENTER = "mouseenter"; //Element > MouseEvent
	staticFunctions.MOUSE_LEAVE = "mouseleave"; //Element > MouseEvent
	staticFunctions.MOUSE_MOVE = "mousemove"; //Element > MouseEvent
	staticFunctions.MOUSE_OUT = "mouseout"; //Element > MouseEvent
	staticFunctions.MOUSE_OVER = "mouseover"; //Element > MouseEvent
	staticFunctions.MOUSE_UP = "mouseup"; //Element > MouseEvent
	staticFunctions.RESIZE = "resize"; //defaultView, Document > UIEvent
	staticFunctions.SCROLL = "scroll"; //defaultView, Document, Element > UIEvent
	staticFunctions.SELECT = "select"; //Element > Event
	staticFunctions.TEXT_INPUT = "textinput"; //Element > TextEvent
	staticFunctions.UNLOAD = "unload"; //defaultView, Document, Element > Event
	staticFunctions.WHEEL = "wheel"; //defaultView, Document, Element > WheelEvent

	//MENOTE: DOM level 2
	staticFunctions.CHANGE = "change";
	staticFunctions.RESET = "reset";
	staticFunctions.SUBMIT = "submit";
});