/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.thirdparty.google.maps.MapView", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var MapView = dbm.importClass("com.developedbyme.thirdparty.google.maps.MapView");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	var MapFunctions = dbm.importClass("com.developedbyme.thirdparty.google.maps.MapFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.thirdparty.google.maps.MapView::_init");
		
		this.superCall();
		
		this._map = this.createProperty("map", null);
		
		this._latitude = this.createProperty("latitude", 0);
		this._longitude = this.createProperty("longitude", 0);
		this._zoom = this.createProperty("zoom", 8);
		
		this._locationUpdate = this.createGhostProperty("locationUpdate");
		this._zoomUpdate = this.createGhostProperty("zoomUpdate");
		
		this.createUpdateFunctionWithArguments("location", MapFunctions.setLocation, [this._map, this._latitude, this._longitude], [this._locationUpdate]);
		this._updateFunctions.getObject("display").addInputConnection(this._locationUpdate);
		this.createUpdateFunctionWithArguments("zoom", MapFunctions.setZoom, [this._map, this._zoom], [this._zoomUpdate]);
		this._updateFunctions.getObject("display").addInputConnection(this._zoomUpdate);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		return this;
	};
	
	objectFunctions.createDisplay = function() {
		console.log("com.developedbyme.thirdparty.google.maps.MapView::createDisplay");
		
		var mapOptions = {
			center: new google.maps.LatLng(this._latitude.getValue(), this._longitude.getValue()),
			zoom: this._zoom.getValue()
		};
		var map = new google.maps.Map(this.getElement(), mapOptions);
		this._map.setValue(map);
		
		return this;
	};
	
	objectFunctions.setLocation = function(aLatitude, aLongitude) {
		this._latitude.setValue(aLatitude);
		this._longitude.setValue(aLongitude);
		
		this._locationUpdate.update();
	};
	
	objectFunctions.addOverlay = function(aObject) {
		aObject.setPropertyInput("map", this._map);
		//METODO: store object
		//METODO: add to display update
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		//switch(aName) {
		//	case ButtonExtendedEventIds.CLICK:
		//		return true;
		//}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._map = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		return (new MapView()).init().setElement(aElement);
	};
	
	staticFunctions.createDiv = function(aParentOrDocument, aAddToParent, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theParent = DomReferenceFunctions.getDocumentVisualParent(aParentOrDocument);
		
		newNode.setParent(theParent);
		
		var htmlCreator = newNode.getHtmlCreator();
		
		newNode.setElement(htmlCreator.createDiv(aAttributes));
		
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});