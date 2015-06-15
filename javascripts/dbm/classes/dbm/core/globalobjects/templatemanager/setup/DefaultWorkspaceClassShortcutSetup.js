/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup");
	
	var DefaultWorkspaceClassShortcutSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var Console = dbm.importClass("dbm.workspace.gui.console.Console");
	var ConsoleLine = dbm.importClass("dbm.workspace.gui.console.ConsoleLine");
	var Workspace = dbm.importClass("dbm.workspace.gui.Workspace");
	
	var TemplateClassShortcutNames = dbm.importClass("dbm.constants.TemplateClassShortcutNames");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_CONSOLE, Console);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_CONSOLE_LINE, ConsoleLine);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_WORKSPACE, Workspace);
		
	};
});