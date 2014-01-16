require("../../dbmForNodejs/dbmForNodejs.js");
require("../../dbm/classes/com/developedbyme/core/globalobjects/classmanager/ClassManager.js");
dbm.setup(null, null, "../../javascripts", "classes"); //MENOTE: javascript folder is based from "../../dbmForNodejs/dbmForNodejs.js"
dbm.addSpecificClassesFolder("com.developedbyme.nodejs", "dbmForNodejs/classes");
require("../../dbmForNodejs/setup/defaultSetup.js");

dbm.runTempFunction(function() {
	
	var WebServer = dbm.importClass("com.developedbyme.nodejs.server.WebServer");
	
	var startFunction = function() {
		console.log("startFunction");
		
		var webServer = WebServer.createHttpServer(8080, "/Library/WebServer/Documents");
		webServer.start();
	};
	
	dbm.addStartFunction(startFunction);
});

dbm.startLoading();