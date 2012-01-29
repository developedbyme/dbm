dbm.registerClass("com.developedbyme.constants.extendedevents.DeviceExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.extendedevents.DeviceExtendedEventIds");
	
	var DeviceExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.DeviceExtendedEventIds");
	
	staticFunctions.POSITION_UPDATED = "positionUpdated";
	staticFunctions.POSITION_ERROR = "positionError";
	
	staticFunctions.ORIENTATION_UPDATED = "orientationUpdated";
	staticFunctions.ORIENTATION_ERROR = "orientationError";
	staticFunctions.COMPASS_NEEDS_CALIBRATION = "compassNeedsCalibration";
	staticFunctions.MOTION_UPDATED = "motionUpdated";
	
});