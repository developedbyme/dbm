/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.thirdparty.google.maps.DriveStreetViewApplication", "com.developedbyme.projects.examples.thirdparty.google.maps.CreateStreetViewApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var DriveStreetViewApplication = dbm.importClass("com.developedbyme.projects.examples.thirdparty.google.maps.DriveStreetViewApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var JavascriptLoader = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.JavascriptLoader");
	var StreetView = dbm.importClass("com.developedbyme.thirdparty.google.maps.StreetView");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ApiFunctions = dbm.importClass("com.developedbyme.thirdparty.google.maps.ApiFunctions");
	var AngleFunctions = dbm.importClass("com.developedbyme.utils.math.AngleFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var StreetViewEventIds = dbm.importClass("com.developedbyme.constants.thirdparty.google.maps.StreetViewEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.thirdparty.google.maps.DriveStreetViewApplication::_init");
		
		this.superCall();
		
		this._targetedAngle = Math.PI;
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.thirdparty.google.maps.DriveStreetViewApplication::_createPage");
		
		this.superCall();
		this._mapView.setLocation(39.097755, -123.704893);
		
		this._mapView.getExtendedEvent().addCommandToEvent(StreetViewEventIds.PANO_CHANGED, CallFunctionCommand.createCommand(this, this._callback_panoChanged, []));
		this._mapView.getExtendedEvent().addCommandToEvent(StreetViewEventIds.LINKS_CHANGED, CallFunctionCommand.createCommand(this, this._callback_linksChanged, []));
	};
	
	objectFunctions._callback_panoChanged = function() {
		//console.log("com.developedbyme.projects.examples.thirdparty.google.maps.DriveStreetViewApplication::_callback_panoChanged");
		
	};
	
	objectFunctions._callback_linksChanged = function() {
		//console.log("com.developedbyme.projects.examples.thirdparty.google.maps.DriveStreetViewApplication::_callback_linksChanged");
		
		var streetView = this._mapView.getProperty("streetView").getValue();
		var currentArray = streetView.getLinks();
		var currentArrayLength = currentArray.length;
		
		var bestLink = null;
		var bestDegreeOffset = 0;
		
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLink = currentArray[i];
			var currentDegreeOffset = Math.abs(AngleFunctions.angleDifference(this._targetedAngle, AngleFunctions.degreesToRadians(currentLink.heading)));
			if(currentDegreeOffset < 0.5*Math.PI && (currentDegreeOffset < bestDegreeOffset || bestLink === null)) {
				bestLink = currentLink;
				bestDegreeOffset = currentDegreeOffset;
			}
		}
		
		if(bestLink !== null) {
			var newAngle = AngleFunctions.degreesToRadians(bestLink.heading);
			this._mapView.getProperty("heading").setValue(newAngle);
			streetView.setPano(bestLink.pano);
			this._targetedAngle = newAngle;
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._mapView = null;
		
		this.superCall();
	};
});