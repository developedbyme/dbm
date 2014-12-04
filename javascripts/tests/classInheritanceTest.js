dbm.runTempFunction(function() {
	
	var FlowBaseObject = dbm.importClass("dbm.core.FlowBaseObject");
	
	var SizzleLibrary = dbm.importLibrary("sizzle", function() {SizzleLibrary = SizzleLibrary.realLibrary});
	var EaselLibrary = dbm.importLibrary("easel", function() {EaselLibrary = EaselLibrary.realLibrary});
	
	var startFunction = function() {
		console.log("startFunction");
		
		var baseObject = new FlowBaseObject();
		baseObject.init();
		
		console.log(baseObject);
		console.log(baseObject.init);
		console.log(baseObject.toString());
		
		console.log(SizzleLibrary("#test"));
		console.log({sizzle: SizzleLibrary});
		console.log({easel: EaselLibrary});
		
		console.log(SizzleLibrary.contains);
		console.log(EaselLibrary.Bitmap);
	};
	
	dbm.addStartFunction(startFunction);
});