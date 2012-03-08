dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup");
	
	var DefaultTextCreatorsSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var TextCreator = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.TextCreator");
	var HtmlTextCreator = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator");
	
	var TemplateTextCreatorTypes = dbm.importClass("com.developedbyme.constants.TemplateTextCreatorTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.setup = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup::setup");
		
		dbm.singletons.dbmTemplateManager.registerTextCreator(TemplateTextCreatorTypes.DBM_TEXT, TextCreator.create());
		dbm.singletons.dbmTemplateManager.registerTextCreator(TemplateTextCreatorTypes.DBM_HTML_TEXT, HtmlTextCreator.create());
		
	};
});