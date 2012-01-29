dbm.runTempFunction(function() {
	
	var DeviceLocation = dbm.importClass("com.developedbyme.utils.device.DeviceLocation");
	var DeviceOrientation = dbm.importClass("com.developedbyme.utils.device.DeviceOrientation");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var deviceLocation = DeviceLocation.create();
		console.log(deviceLocation);
		
		//deviceLocation.updatePosition();
		//deviceLocation.startUpdating();
		
		var deviceOrientation = DeviceOrientation.create();
		console.log(deviceOrientation);
		
		deviceOrientation.startUpdating();
	});
});