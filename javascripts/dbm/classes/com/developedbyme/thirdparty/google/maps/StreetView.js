/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.thirdparty.google.maps.StreetView", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var StreetView = dbm.importClass("com.developedbyme.thirdparty.google.maps.StreetView");
	
	//Error report
	
	//Dependencies
	var MapsEventListener = dbm.importClass("com.developedbyme.projects.thirdparty.google.maps.MapsEventListener");
	
	//Utils
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	var MapFunctions = dbm.importClass("com.developedbyme.thirdparty.google.maps.MapFunctions");
	var SetPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyCommand");
	var CallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var GetPropertyValueObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetPropertyValueObject");
	var ExternalChangeToPropertyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.ExternalChangeToPropertyCommand");
	
	//Constants
	var StreetViewEventIds = dbm.importClass("com.developedbyme.constants.thirdparty.google.maps.StreetViewEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.thirdparty.google.maps.StreetView::_init");
		
		this.superCall();
		
		this._streetView = this.createProperty("streetView", null);
		this._streetViewListener = MapsEventListener.create();
		
		this._latitude = this.createProperty("latitude", 0);
		this._longitude = this.createProperty("longitude", 0);
		this._zoom = this.createProperty("zoom", 1);
		this._heading = this.createProperty("heading", 0);
		this._pitch = this.createProperty("pitch", 0);
		this._panoId = this.createProperty("panoId", null);
		
		this._locationUpdate = this.createGhostProperty("locationUpdate");
		this._zoomUpdate = this.createGhostProperty("zoomUpdate");
		this._povUpdate = this.createGhostProperty("povUpdate");
		this._panoIdUpdate = this.createGhostProperty("panoIdUpdate");
		
		this.createUpdateFunctionWithArguments("location", MapFunctions.setStreetViewLocation, [this._streetView, this._latitude, this._longitude], [this._locationUpdate]);
		this._updateFunctions.getObject("display").addInputConnection(this._locationUpdate);
		this.createUpdateFunctionWithArguments("zoom", MapFunctions.setZoom, [this._streetView, this._zoom], [this._zoomUpdate]);
		this._updateFunctions.getObject("display").addInputConnection(this._zoomUpdate);
		this.createUpdateFunctionWithArguments("pov", MapFunctions.setPov, [this._streetView, this._heading, this._pitch], [this._povUpdate]);
		this._updateFunctions.getObject("display").addInputConnection(this._povUpdate);
		this.createUpdateFunctionWithArguments("panoId", MapFunctions.setPanoId, [this._streetView, this._panoId], [this._panoIdUpdate]);
		this._updateFunctions.getObject("display").addInputConnection(this._panoIdUpdate);
		
		//METODO: fix so that pano isn't updated twice
		this.getExtendedEvent().addCommandToEvent(
			StreetViewEventIds.PANO_CHANGED,
			ExternalChangeToPropertyCommand.createCommand(
				this._panoId,
				CallFunctionObject.createFunctionOnObjectCommand(
					GetPropertyValueObject.createCommand(this, "streetView"),
					"getPano",
					[]
				)
			)
		);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		return this;
	};
	
	objectFunctions.createDisplay = function() {
		console.log("com.developedbyme.thirdparty.google.maps.StreetView::createDisplay");
		
		var options = {
			"position": new google.maps.LatLng(this._latitude.getValue(), this._longitude.getValue()),
			"pov": {"heading": 180*this._heading.getValue()/Math.PI, "pitch": 180*this._pitch.getValue()/Math.PI},
			"zoom": this._zoom.getValue(),
			"linksControl": true /* MEDEBUG */
		};
		var steetView = new google.maps.StreetViewPanorama(this.getElement(), options);
		this._streetView.setValue(steetView);
		
		this._streetViewListener.setObject(steetView);
		this.getExtendedEvent().linkJavascriptEvent(this._streetViewListener, StreetViewEventIds.PANO_CHANGED, StreetViewEventIds.PANO_CHANGED, StreetViewEventIds.PANO_CHANGED, true, true);
		this.getExtendedEvent().linkJavascriptEvent(this._streetViewListener, StreetViewEventIds.LINKS_CHANGED, StreetViewEventIds.LINKS_CHANGED, StreetViewEventIds.LINKS_CHANGED, true, true);
		
		this.getExtendedEvent().activateJavascriptEventLink(StreetViewEventIds.PANO_CHANGED);
		this.getExtendedEvent().activateJavascriptEventLink(StreetViewEventIds.LINKS_CHANGED); //MEDEBUG
		
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
		
		this._map = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		return (new StreetView()).init().setElement(aElement);
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