dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup");
	
	var DefaultWorkspaceClassShortcutSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Console = dbm.importClass("com.developedbyme.workspace.gui.console.Console");
	var ConsoleLine = dbm.importClass("com.developedbyme.workspace.gui.console.ConsoleLine");
	
	var TemplateClassShortcutNames = dbm.importClass("com.developedbyme.constants.TemplateClassShortcutNames");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_CONSOLE, Console);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_CONSOLE_LINE, ConsoleLine);
		
	};
});