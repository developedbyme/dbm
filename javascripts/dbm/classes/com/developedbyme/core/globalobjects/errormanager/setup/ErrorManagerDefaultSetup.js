/**
 * Default setup for the global error manager.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.2.01
 */
dbm.registerClass("com.developedbyme.core.globalobjects.errormanager.setup.ErrorManagerDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.errormanager.setup.ErrorManagerDefaultSetup");
	//"use strict";
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ErrorManagerDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.setup.ErrorManagerDefaultSetup");
	var PrintInConsoleHandler = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.handlers.PrintInConsoleHandler");
	
	/**
	 * Sets up the default handlers (PrintInConsoleHandler).
	 */
	staticFunctions.setup = function setup() {
		if(console !== null) {
			var printInConsoleHandler = (new PrintInConsoleHandler()).init();
			ErrorManager.getInstance().addHandler(printInConsoleHandler);
		}
	};
});