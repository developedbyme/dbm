dbm.registerClass("com.developedbyme.core.globalobjects.errormanager.setup.ErrorManagerDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.errormanager.setup.ErrorManagerDefaultSetup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ErrorManagerDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.setup.ErrorManagerDefaultSetup");
	var PrintInConsoleHandler = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.handlers.PrintInConsoleHandler");
	
	staticFunctions.setup = function() {
		if(console != null) {
			var printInConsoleHandler = (new PrintInConsoleHandler()).init();
			ErrorManager.getInstance().addHandler(printInConsoleHandler);
		}
	};
});