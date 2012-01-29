dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.objects.TemplateResult", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.objects.TemplateResult");
	
	var TemplateResult = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.objects.TemplateResult");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.objects.TemplateResult::init");
		
		this.superCall();
		
		this._controllers = NamedArray.create(false);
		this.addDestroyableObject(this._controllers);
		this.mainController = null;
		
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