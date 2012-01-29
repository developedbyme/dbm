dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.TemplateManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.TemplateManager");
	
	var TemplateManager = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.TemplateManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var TemplateResult = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.objects.TemplateResult");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	dbm.setClassAsSingleton("dbmTemplateManager");
	
	staticFunctions.CLASS_ATTRIBUTE = "data-dbm-class";
	staticFunctions.NAME_ATTRIBUTE = "data-dbm-name";
	staticFunctions.TEXT_CLASS_ATTRIBUTE = "data-dbm-text-class";
	staticFunctions.TEXT_NAME_ATTRIBUTE = "data-dbm-text-name";
	staticFunctions.IGNORE_CHILDREN_ATTRIBUTE = "data-dbm-ignore-children";
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.TemplateManager::init");
		
		this.superCall();
		
		this._classShortcuts = NamedArray.create(false);
		this._textCreators = NamedArray.create(false);
		
		return this;
	};
	
	objectFunctions.registerClassShortcut = function(aName, aClass) {
		this._classShortcuts.addObject(aName, aClass);
	};
	
	objectFunctions.registerTextCreator = function(aName, aCreator) {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.TemplateManager::registerTextCreator");
		//console.log(aName, aCreator);
		this._textCreators.addObject(aName, aCreator);
	};
	
	objectFunctions.createControllersForTemplate = function(aTemplate) {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.TemplateManager::createControllersForTemplate");
		
		var templateResult = TemplateResult.create();
		
		var mainController = this._createControllersForTemplateNode(aTemplate, "", templateResult);
		
		if(mainController != null) {
			templateResult.mainController = mainController;
		}
		
		return templateResult;
	};
	
	objectFunctions._createControllersForTemplateNode = function(aNode, aBasePath, aTemplateResult) {
		var currentClassName = XmlChildRetreiver.getAttribute(aNode, TemplateManager.CLASS_ATTRIBUTE);
		var currentName = XmlChildRetreiver.getAttribute(aNode, TemplateManager.NAME_ATTRIBUTE);
		var currentTextClassName = XmlChildRetreiver.getAttribute(aNode, TemplateManager.TEXT_CLASS_ATTRIBUTE);
		var ignoreChildren = VariableAliases.isTrue(XmlChildRetreiver.getAttribute(aNode, TemplateManager.IGNORE_CHILDREN_ATTRIBUTE));
		
		var newObject = null;
		
		//METODO: implement text and html text
		
		if(currentClassName != null) {
			var currentClass;
			
			if(this._classShortcuts.select(currentClassName)) {
				currentClass = this._classShortcuts.currentSelectedItem;
			}
			else {
				currentClass = dbm.getClass(currentClassName);
			}
			
			if(currentClass != null) {
				newObject = (new currentClass()).init();
				newObject.setElement(aNode);
				
				var registrationName = (currentName != null) ?  currentName : dbm.singletons.dbmIdManager.getNewId(newObject.__className);
				
				aTemplateResult.addController(aBasePath + registrationName, newObject);
			}
			else {
				//METODO: error report
			}
		}
		
		var newPath = (currentName != null) ? aBasePath + currentName + "/" : aBasePath;
		
		if(currentTextClassName != null) {
			
			var currentTextName = XmlChildRetreiver.getAttribute(aNode, TemplateManager.TEXT_NAME_ATTRIBUTE);
			
			var currentTextCreator = this._textCreators.getObject(currentTextClassName);
			if(currentTextCreator != null) {
				
				var textObject = currentTextCreator.createObject(aNode);
				
				var textRegistrationName = (currentTextName != null) ? currentTextName : dbm.singletons.dbmIdManager.getNewId("text");
				
				aTemplateResult.addController(aBasePath + textRegistrationName, textObject);
				
				if(newObject == null) {
					newObject = textObject;
				}
			}
			else {
				//METODO: error message
			}
		}
		else if(!ignoreChildren) {
			var currentArray = XmlChildRetreiver.getChilds(aNode);
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				this._createControllersForTemplateNode(currentArray[i], newPath, aTemplateResult);
			}
		}
		
		return newObject;
	}
});