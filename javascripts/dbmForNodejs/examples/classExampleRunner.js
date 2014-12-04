require("../../dbmForNodejs/dbmForNodejs.js");
require("../../dbm/classes/com/developedbyme/core/globalobjects/classmanager/ClassManager.js");
dbm.setup(null, null, "../../javascripts", "classes"); //MENOTE: javascript folder is based from "../../dbmForNodejs/dbmForNodejs.js"
dbm.addSpecificClassesFolder("dbm.nodejs.projects.examples", "examples/classes");
dbm.addSpecificClassesFolder("dbm.nodejs", "dbmForNodejs/classes");
require("../../dbmForNodejs/setup/defaultSetup.js");

dbm.runTempFunction(function() {
	
	dbm.addStartFunction(function() {
		console.log("exampleRunner");
		
		var classPath = process.argv[2];
		console.log(classPath);
		
		dbm.importClass(classPath);
		
		dbm.addStartFunction(function() {
			var RunningClass = dbm.importClass(classPath);
			
			var runningInstance = (new RunningClass()).init();
			console.log(runningInstance.toString());
			runningInstance.start();
		});
		
		dbm.restartLoading();
	});
});

dbm.startLoading();