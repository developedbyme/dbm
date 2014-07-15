/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultDevelopmentClassShortcutSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultDevelopmentClassShortcutSetup");
	
	//Self reference
	var DefaultDevelopmentClassShortcutSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultDevelopmentClassShortcutSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependecies
	var CodeMirrorView = dbm.importClass("com.developedbyme.thirdparty.codemirror.CodeMirrorView");
	
	//Utils
	
	//Constants
	var TemplateClassShortcutNames = dbm.importClass("com.developedbyme.constants.TemplateClassShortcutNames");
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_CODE_MIRROR_VIEW, CodeMirrorView);
		
	};
});