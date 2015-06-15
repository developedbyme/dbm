/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup");
	
	var DefaultTextCreatorsSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var TextCreator = dbm.importClass("dbm.core.globalobjects.templatemanager.objects.textcreators.TextCreator");
	var HtmlTextCreator = dbm.importClass("dbm.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator");
	
	var TemplateTextCreatorTypes = dbm.importClass("dbm.constants.TemplateTextCreatorTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.setup = function() {
		//console.log("dbm.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup::setup");
		
		dbm.singletons.dbmTemplateManager.registerTextCreator(TemplateTextCreatorTypes.DBM_TEXT, TextCreator.create());
		dbm.singletons.dbmTemplateManager.registerTextCreator(TemplateTextCreatorTypes.DBM_HTML_TEXT, HtmlTextCreator.create());
		
	};
});