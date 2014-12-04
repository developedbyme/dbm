var dbm = null;
var global = new Object();

var console = new Object();
console.dir = function(){};
console.log = function(){
	var joinArray = new Array();
	
	fl.trace(joinArray.join.apply(arguments, [", "]));
};
console.debug = function(){};
console.info = function(){};
console.warn = function(){
	var joinArray = new Array();
	
	fl.trace("WARNING: " + joinArray.join.apply(arguments, [", "]));
};
console.error = function(){
	var joinArray = new Array();
	
	fl.trace("ERROR: " + joinArray.join.apply(arguments, [", "]));
};
console.trace = function(){};

(function() {
	var javasciptsFolder = "file:///Library/WebServer/Documents/tests/dbm/javascripts";
	var classPath = "dbm.adobeflashscript.projects.tools.flash.ExportShapeDataApplication";
	
	var importScript = function(aFilePath) {
		var fullText = FLfile.read(javasciptsFolder + "/" + aFilePath);
		eval(fullText);
	};
	
	importScript("dbmForAdobeFlashScript/dbmForAdobeFlashScript.js")
	dbm = global.dbm;
	importScript ("dbm/classes/com/developedbyme/core/globalobjects/classmanager/ClassManager.js");
	
	dbm.setup(null, null, javasciptsFolder, "classes");
	dbm.addSpecificClassesFolder("dbm.broadcast", "broadcast/classes");
	dbm.addSpecificClassesFolder("dbm.projects.experiments", "experiments/classes");
	dbm.addSpecificClassesFolder("dbm.projects.tests", "tests/classes");
	dbm.addSpecificClassesFolder("dbm.projects.tools", "tools/classes");
	dbm.addSpecificClassesFolder("dbm.projects.examples", "examples/classes");
	
	dbm.addSpecificClassesFolder("dbm.adobeextendscript.projects.tests", "tests/classes");
	dbm.addSpecificClassesFolder("dbm.adobeextendscript.projects.tools", "tools/classes");
	dbm.addSpecificClassesFolder("dbm.adobeextendscript", "dbmForAdobeExtendScript/classes");
	
	dbm.addSpecificClassesFolder("dbm.adobeflashscript.projects.tests", "tests/classes");
	dbm.addSpecificClassesFolder("dbm.adobeflashscript.projects.tools", "tools/classes");
	dbm.addSpecificClassesFolder("dbm.adobeflashscript", "dbmForAdobeFlashScript/classes");
	
	importScript("dbmForAdobeFlashScript/setup/defaultSetup.js");
	
	//var debugRunningInstance = null;
	dbm.addStartFunction(function() {
		console.log("exampleRunner");
		
		dbm.importClass(classPath);
		
		dbm.addStartFunction(function() {
			var RunningClass = dbm.importClass(classPath);
			
			var runningInstance = (new RunningClass()).init();
			//debugRunningInstance = runningInstance;
			runningInstance.start();
		});
		
		dbm.restartLoading();
	});	
	
	dbm.startLoading();
	
	//var testDbm = dbm;
	//debugger;
})();