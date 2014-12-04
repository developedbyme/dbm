require("../../dbmForNodejs/dbmForNodejs.js");
require("../../dbm/classes/com/developedbyme/core/globalobjects/classmanager/ClassManager.js");
dbm.setup(null, null, "../../javascripts", "classes"); //MENOTE: javascript folder is based from "../../dbmForNodejs/dbmForNodejs.js"
dbm.addSpecificClassesFolder("dbm.nodejs", "dbmForNodejs/classes");
require("../../dbmForNodejs/setup/defaultSetup.js");

dbm.runTempFunction(function() {
	
	var BaseObject = dbm.importClass("dbm.core.BaseObject");
	
	var startFunction = function() {
		console.log("startFunction");
		
		var baseObject = new BaseObject();
		baseObject.init();
		
		console.log(baseObject);
		console.log(baseObject.init);
		
		console.log(dbm.singletons.dbmIdManager.getNewId("test"));
	};
	
	dbm.addStartFunction(startFunction);
});

dbm.startLoading();