/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.templatemanager.setup.DefaultDevelopmentClassShortcutSetup", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.templatemanager.setup.DefaultDevelopmentClassShortcutSetup");
	
	//Self reference
	var DefaultDevelopmentClassShortcutSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultDevelopmentClassShortcutSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependecies
	var CodeMirrorView = dbm.importClass("dbm.thirdparty.codemirror.CodeMirrorView");
	
	//Utils
	
	//Constants
	var TemplateClassShortcutNames = dbm.importClass("dbm.constants.TemplateClassShortcutNames");
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_CODE_MIRROR_VIEW, CodeMirrorView);
		
	};
});