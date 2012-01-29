dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup");
	
	var DefaultBasicClassShortcutSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	var StaticImage = dbm.importClass("com.developedbyme.gui.images.StaticImage");
	var StateImage = dbm.importClass("com.developedbyme.gui.images.StateImage");
	
	var TemplateClassShortcutNames = dbm.importClass("com.developedbyme.constants.TemplateClassShortcutNames");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup::init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_DISPLAY_BASE_OBJECT, DisplayBaseObject);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_BASE_BUTTON, BaseButton);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_STATIC_IMAGE, StaticImage);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_STATE_IMAGE, StateImage);
		
	};
});