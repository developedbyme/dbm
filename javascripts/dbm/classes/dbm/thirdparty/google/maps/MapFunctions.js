/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.google.maps.MapFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.thirdparty.google.maps.MapFunctions");
	
	//Self reference
	var MapFunctions = dbm.importClass("dbm.thirdparty.google.maps.MapFunctions");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	staticFunctions.setMapForObject = function(aObject, aMap) {
		aObject.setMap(aMap);
		
		return aObject;
	};
	
	staticFunctions.setZoom = function(aMap, aZoom) {
		aMap.setZoom(Math.round(aZoom));
		
		return aMap;
	};
	
	staticFunctions.setRadius = function(aObject, aValue) {
		console.log("dbm.thirdparty.google.maps.MapFunctions::setRadius");
		console.log(aObject, aValue);
		
		aObject.setRadius(aValue);
		
		return aObject;
	};
	
	staticFunctions.setLocation = function(aObject, aLatitude, aLongitude) {
		console.log("dbm.thirdparty.google.maps.MapFunctions::setLocation");
		console.log(aObject, aLatitude, aLongitude);
		
		if(!isNaN(aLatitude) && !isNaN(aLongitude)) {
			var newLocation = new google.maps.LatLng(aLatitude, aLongitude);
			aObject.setCenter(newLocation);
		}
		
		return aObject;
	};
	
	staticFunctions.setStreetViewLocation = function(aMap, aLatitude, aLongitude) {
		var newLocation = new google.maps.LatLng(aLatitude, aLongitude);
		
		aMap.setPosition(newLocation);
		
		return aMap;
	};
	
	staticFunctions.setPov = function(aMap, aHeading, aPitch) {
		var newPov = {"heading": 180*aHeading/Math.PI, "pitch": 180*aPitch/Math.PI};
		
		aMap.setPov(newPov);
		
		return aMap;
	};
	
	staticFunctions.setPanoId = function(aMap, aPanoId) {
		
		if(aPanoId !== null) {
			aMap.setPano(aPanoId);
		}
		
		return aMap;
	};
	
	staticFunctions.getPanoIdFromUrl = function(aUrl) {
		var replaceRegExp = new RegExp(".*data=![^!]*![^!]*![^!]*!1s([^!]*)!.*");
		if(aUrl.match(replaceRegExp)) {
			return aUrl.replace(replaceRegExp, "$1");
		}
		//METODO: error message
		return null;
	};
});