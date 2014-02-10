dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.TemplateManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.TemplateManager");
	
	var TemplateManager = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.TemplateManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var TemplateResult = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.objects.TemplateResult");
	
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var DomManipulationFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomManipulationFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var DomReferenceFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomReferenceFunctions");
	
	dbm.setClassAsSingleton("dbmTemplateManager");
	
	staticFunctions.CLASS_ATTRIBUTE = "data-dbm-class";
	staticFunctions.NAME_ATTRIBUTE = "data-dbm-name";
	staticFunctions.TEXT_CLASS_ATTRIBUTE = "data-dbm-text-class";
	staticFunctions.TEXT_NAME_ATTRIBUTE = "data-dbm-text-name";
	staticFunctions.IGNORE_CHILDREN_ATTRIBUTE = "data-dbm-ignore-children";
	staticFunctions.COMMANDS_ATTRIBUTE = "data-dbm-commands";
	staticFunctions.TEXT_COMMANDS_ATTRIBUTE = "data-dbm-text-commands";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.TemplateManager::_init");
		
		this.superCall();
		
		this._classShortcuts = this.addDestroyableObject(NamedArray.create(false));
		this._textCreators = this.addDestroyableObject(NamedArray.create(false));
		this._commands = this.addDestroyableObject(NamedArray.create(true));
		
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
	
	objectFunctions.addCommand = function(aName, aCommand) {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.TemplateManager::addCommand");
		//console.log(aName, aCommand);
		
		aCommand.retain();
		this._commands.addObject(aName, aCommand);
	};
	
	objectFunctions.createControllersForTemplate = function(aTemplate, aDynamicData) {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.TemplateManager::createControllersForTemplate");
		//console.log(aTemplate);
		
		var templateResult = TemplateResult.create();
		templateResult.rootElement = aTemplate;
		
		var mainController = this._createControllersForTemplateNode(aTemplate, "", aDynamicData, templateResult);
		
		if(mainController !== null) {
			templateResult.mainController = mainController;
		}
		
		return templateResult;
	};
	
	objectFunctions.createControllersForAsset = function(aPath, aDynamicData, aRemoveId, aDocumentOrParent, aAddToParent) {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.TemplateManager::createControllersForAsset");
		//console.log(aPath, aRemoveId, aDocument);
		
		aRemoveId = VariableAliases.valueWithDefault(aRemoveId, true);
		aDocumentOrParent = VariableAliases.valueWithDefault(aDocumentOrParent, dbm.getDocument());
		aAddToParent = VariableAliases.valueWithDefault(aAddToParent, false);
		
		var theDocument = DomReferenceFunctions.getDocument(aDocumentOrParent);
		var theParent = DomReferenceFunctions.getDocumentVisualParent(aDocumentOrParent);
		
		//console.log(dbm.singletons.dbmAssetRepository.getAsset(aPath), dbm.singletons.dbmAssetRepository.getAssetData(aPath));
		var template = dbm.singletons.dbmAssetRepository.getAssetData(aPath);
		if(template === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "createControllersForAsset", "Template is null for asset " + aPath + ".");
			return null;
		}
		
		var copiedTemplate = DomManipulationFunctions.importNode(template, true, theDocument);
		if(aRemoveId) {
			copiedTemplate.id = null;
		}
		if(aAddToParent) {
			theParent.appendChild(copiedTemplate);
		}
		
		return this.createControllersForTemplate(copiedTemplate, aDynamicData);
	};
	
	objectFunctions._executeCommandsForObject = function(aObject, aCommandsString, aDynamicData) {
		var currentArray = StringFunctions.splitSeparatedString(aCommandsString, ";", true, true);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentCommandWithArguments = currentArray[i];
			var currentCommandName;
			var currentArguments = null;
			var spacePosition = currentCommandWithArguments.indexOf(" ");
			if(spacePosition !== -1) {
				currentCommandName = currentCommandWithArguments.substring(0, spacePosition);
				currentArguments = currentCommandWithArguments.substring(spacePosition+1, currentCommandWithArguments.length);
			}
			else {
				currentCommandName = currentCommandWithArguments;
			}
			if(this._commands.select(currentCommandName)) {
				var currentCommand = this._commands.currentSelectedItem;
				var eventData = EventDataObject.create({"arguments": currentArguments, "dynamicData": aDynamicData}, this, aObject);
				currentCommand.perform(eventData);
				eventData.destroy();
			}
			else {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_executeCommandsForObject", "Command " + currentCommandName + " doesn't exist.");
			}
		}
	};
	
	objectFunctions._createControllersForTemplateNode = function(aNode, aBasePath, aDynamicData, aTemplateResult) {
		var currentClassName = XmlChildRetreiver.getAttribute(aNode, TemplateManager.CLASS_ATTRIBUTE);
		var currentName = XmlChildRetreiver.getAttribute(aNode, TemplateManager.NAME_ATTRIBUTE);
		var currentTextClassName = XmlChildRetreiver.getAttribute(aNode, TemplateManager.TEXT_CLASS_ATTRIBUTE);
		var ignoreChildren = VariableAliases.isTrue(XmlChildRetreiver.getAttribute(aNode, TemplateManager.IGNORE_CHILDREN_ATTRIBUTE));
		
		var newObject = null;
		
		if(currentClassName !== null) {
			var currentClass;
			
			if(this._classShortcuts.select(currentClassName)) {
				currentClass = this._classShortcuts.currentSelectedItem;
			}
			else {
				currentClass = dbm.getClass(currentClassName);
			}
			
			if(currentClass !== null) {
				newObject = (new currentClass()).init();
				newObject.setElement(aNode);
				
				var registrationName = (currentName !== null) ?  currentName : dbm.singletons.dbmIdManager.getNewId(newObject.__className);
				
				aTemplateResult.addController(aBasePath + registrationName, newObject);
				
				var commandsString = XmlChildRetreiver.getAttribute(aNode, TemplateManager.COMMANDS_ATTRIBUTE);
				if(commandsString !== null) {
					this._executeCommandsForObject(newObject, commandsString, aDynamicData);
				}
			}
			else {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_createControllersForTemplateNode", "Class " + currentClass + " doesn't exist.");
			}
		}
		
		var newPath = (currentName !== null) ? aBasePath + currentName + "/" : aBasePath;
		
		if(currentTextClassName !== null) {
			
			var currentTextName = XmlChildRetreiver.getAttribute(aNode, TemplateManager.TEXT_NAME_ATTRIBUTE);
			
			var currentTextCreator = this._textCreators.getObject(currentTextClassName);
			if(currentTextCreator !== null) {
				
				var textObject = currentTextCreator.createObject(aNode);
				
				var textRegistrationName = (currentTextName !== null) ? currentTextName : dbm.singletons.dbmIdManager.getNewId("text");
				
				aTemplateResult.addController(aBasePath + textRegistrationName, textObject);
				
				if(newObject === null) {
					newObject = textObject;
				}
				
				var commandsString = XmlChildRetreiver.getAttribute(aNode, TemplateManager.TEXT_COMMANDS_ATTRIBUTE);
				if(commandsString !== null) {
					this._executeCommandsForObject(textObject, commandsString, aDynamicData);
				}
			}
			else {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_createControllersForTemplateNode", "Text creator " + currentTextClassName + " doesn't exist.");
			}
		}
		else if(!ignoreChildren) {
			var currentArray = XmlChildRetreiver.getChilds(aNode);
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				this._createControllersForTemplateNode(currentArray[i], newPath, aDynamicData, aTemplateResult);
			}
		}
		
		return newObject;
	};
});