/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.thirdparty.google.maps.StreetViewEventIds", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.thirdparty.google.maps.StreetViewEventIds");
	
	var StreetViewEventIds = dbm.importClass("dbm.constants.thirdparty.google.maps.StreetViewEventIds");
	
	//Descriptions are used under Creative Commons Attribution 3.0 License from https://developers.google.com/maps/documentation/javascript/reference?csw=1#StreetViewPanorama
	
	staticFunctions.CLOSE_CLICK = "closeclick"; //This event is fired when the close button is clicked.
	staticFunctions.LINKS_CHANGED = "links_changed"; //This event is fired when the panorama's links change. The links change asynchronously following a pano id change.
	staticFunctions.PANO_CHANGED = "pano_changed"; //This event is fired when the panorama's pano id changes. The pano may change as the user navigates through the panorama or the position is manually set. Note that not all position changes trigger a pano_changed.
	staticFunctions.POSITION_CHANGED = "position_changed"; //This event is fired when the panorama's position changes. The position changes as the user navigates through the panorama or the position is set manually.
	staticFunctions.POV_CHANGED = "pov_changed"; //This event is fired when the panorama's point-of-view changes. The point of view changes as the pitch, zoom, or heading changes.
	staticFunctions.RESIZE = "resize"; //Developers should trigger this event on the panorama when its div changes size: google.maps.event.trigger(panorama, 'resize').
	staticFunctions.VISIBLE_CHANGED = "visible_changed"; //This event is fired when the panorama's visibility changes. The visibility is changed when the Pegman is dragged onto the map, the close button is clicked, or setVisible() is called.
	staticFunctions.ZOOM_CHANGED = "zoom_changed"; //This event is fired when the panorama's zoom level changes.
});