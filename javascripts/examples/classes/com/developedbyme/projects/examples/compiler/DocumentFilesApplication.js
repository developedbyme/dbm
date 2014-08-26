/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example of how to document a project.
 */
dbm.registerClass("com.developedbyme.projects.examples.compiler.DocumentFilesApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var DocumentFilesApplication = dbm.importClass("com.developedbyme.projects.examples.compiler.DocumentFilesApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var DbmCompiler = dbm.importClass("com.developedbyme.compiler.DbmCompiler");
	var TemplateWithCommands = dbm.importClass("com.developedbyme.utils.templates.TemplateWithCommands");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var RemoveIdCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.RemoveIdCommand");
	var SetTextContentCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.SetTextContentCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var GetNamedArrayValueObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var DocumentationTypes = dbm.importClass("com.developedbyme.constants.compiler.DocumentationTypes");
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication::_init");
		
		this.superCall();
		
		this._classTemplatePath = "../assets/examples/compiler/documentationTemplates.xml#class";
		this._functionTemplatePath = "../assets/examples/compiler/documentationTemplates.xml#function";
		
		this._assetsLoader.addAssetsByPath(this._classTemplatePath, this._functionTemplatePath);
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication::_createPage");
		
		var compiler = (new DbmCompiler()).init();
		
		compiler.setNumberOfFilesBeforeImport(3);
		compiler.addFiles("../javascripts/dbm/dbm.js", "../javascripts/dbm/setup/defaultDocumentSetup.js", "../javascripts/dbm/classes/com/developedbyme/core/globalobjects/classmanager/ClassManager.js", "../javascripts/dbm/setup/defaultSetup.js", "../javascripts/dbm/setup/compiledStart.js", "../javascripts/tests/inverseKinematicTest.js");
		compiler._loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._generateDocumentation, [compiler]));
		compiler.load();
	};
	
	objectFunctions._generateDocumentation = function(aCompiler) {
		console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication::_generateDocumentation");
		console.log(aCompiler);
		
		var documentationTree = aCompiler.documentFiles();
		console.log(documentationTree);
		
		var selectDataReevaluator = GetNamedArrayValueObject.createCommand(GetVariableObject.createSelectDataCommand(), "data");
		var selectDefinitionReevaluator = GetVariableObject.createCommand(selectDataReevaluator, "definition");
		
		var classTemplate = TemplateWithCommands.create(dbm.singletons.dbmAssetRepository.getAssetData(this._classTemplatePath));
		classTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, RemoveIdCommand.createOnTemplateOutputCommand());
		classTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, SetTextContentCommand.createOnTemplateOutputWithQueryCommand("h1", GetVariableObject.createCommand(selectDefinitionReevaluator, "classPath")));
		classTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, SetTextContentCommand.createOnTemplateOutputWithQueryCommand(".description", GetVariableObject.createCommand(selectDataReevaluator, "_description"))); //METODO: do not access private variable
		
		
		var functionTemplate = TemplateWithCommands.create(dbm.singletons.dbmAssetRepository.getAssetData(this._functionTemplatePath));
		
		console.log(classTemplate, functionTemplate);
		
		var currentArray = documentationTree.getRoot().getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentFile = currentArray[i];
			var outputData = this._generateDocumentationForFile(currentFile, classTemplate);
			console.log(currentFile.getName(), outputData);
		}
	};
	
	objectFunctions._generateDocumentationForFile = function(aTreeStructureItem, aClassTemplate) {
		var currentChildren = aTreeStructureItem.getChildren();
		if(currentChildren.length === 1 && currentChildren[0].data.type === DocumentationTypes.CLASS) {
			return aClassTemplate.createNewItem(currentChildren[0].data);
		}
		return null;
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});