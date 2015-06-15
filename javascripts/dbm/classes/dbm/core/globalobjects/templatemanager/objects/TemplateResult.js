/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.templatemanager.objects.TemplateResult", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.templatemanager.objects.TemplateResult");
	
	var TemplateResult = dbm.importClass("dbm.core.globalobjects.templatemanager.objects.TemplateResult");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.templatemanager.objects.TemplateResult::_init");
		
		this.superCall();
		
		this._controllers = NamedArray.create(false);
		this.addDestroyableObject(this._controllers);
		this.mainController = null;
		this.rootElement = null;
		
		return this;
	};
	
	objectFunctions.addController = function(aName, aObject) {
		this._controllers.addObject(aName, aObject);
	};
	
	objectFunctions.getController = function(aName) {
		return this._controllers.getObject(aName);
	};
	
	objectFunctions.getControllerNames = function() {
		return this._controllers.getNamesArray();
	};
	
	staticFunctions.create = function() {
		
		var newTemplateResult = (new TemplateResult()).init();
		
		return newTemplateResult;
	};
});