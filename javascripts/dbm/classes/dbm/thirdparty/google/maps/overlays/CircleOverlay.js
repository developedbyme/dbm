/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.google.maps.overlays.CircleOverlay", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var CircleOverlay = dbm.importClass("dbm.thirdparty.google.maps.overlays.CircleOverlay");
	
	//Error report
	
	//Dependencies
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	
	//Utils
	var DomReferenceFunctions = dbm.importClass("dbm.utils.htmldom.DomReferenceFunctions");
	var MapFunctions = dbm.importClass("dbm.thirdparty.google.maps.MapFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.thirdparty.google.maps.overlays.CircleOverlay::_init");
		
		this.superCall();
		
		this._display = this.addProperty("display", AnyChangeMultipleInputProperty.create());
		
		this._object = this.createProperty("object", null);
		this._map = this.createProperty("map", null);
		
		this._latitude = this.createProperty("latitude", 0);
		this._longitude = this.createProperty("longitude", 0);
		
		this._radius = this.createProperty("radius", 5);
		
		this._mapUpdate = this.createGhostProperty("mapUpdate");
		this._radiusUpdate = this.createGhostProperty("radiusUpdate");
		this._locationUpdate = this.createGhostProperty("locationUpdate");
		
		this.createUpdateFunctionWithArguments("map", MapFunctions.setMapForObject, [this._object, this._map], [this._mapUpdate]);
		this._display.connectInput(this._mapUpdate);
		
		this.createUpdateFunctionWithArguments("radius", MapFunctions.setRadius, [this._object, this._radius], [this._radiusUpdate]);
		this._display.connectInput(this._radiusUpdate);
		
		this.createUpdateFunctionWithArguments("location", MapFunctions.setLocation, [this._object, this._latitude, this._longitude], [this._locationUpdate]);
		this._display.connectInput(this._locationUpdate);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		return this;
	};
	
	objectFunctions.createDisplay = function() {
		console.log("dbm.thirdparty.google.maps.overlays.CircleOverlay::createDisplay");
		
		var objectOptions = {
			map: this._map.getValue(),
			center: new google.maps.LatLng(this._latitude.getValue(), this._longitude.getValue()),
			radius: this._radius.getValue(),
			fillColor: "#0000FF",
			fillOpacity: 0.5,
			strokeColor: "#0000FF",
			strokeOpacity: 1
		};
		var object = new google.maps.Circle(objectOptions);
		this._object.setValue(object);
		
		return this;
	};
	
	objectFunctions.setLocation = function(aLatitude, aLongitude) {
		this._latitude.setValue(aLatitude);
		this._longitude.setValue(aLongitude);
		
		this._locationUpdate.update();
	}
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		//switch(aName) {
		//	case ButtonExtendedEventIds.CLICK:
		//		return true;
		//}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._object = null;
		this._map = null;
		this._latitude = null;
		this._longitude = null;
		this._radius = null;
		this._mapUpdate = null;
		this._locationUpdate = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new CircleOverlay()).init().createDisplay();
	};
});