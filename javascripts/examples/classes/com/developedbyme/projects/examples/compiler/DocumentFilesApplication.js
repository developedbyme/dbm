/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example of how to document a project.
 */
dbm.registerClass("com.developedbyme.projects.examples.compiler.DocumentFilesApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication");
	
	//Self reference
	var DocumentFilesApplication = dbm.importClass("com.developedbyme.projects.examples.compiler.DocumentFilesApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var DbmCompiler = dbm.importClass("com.developedbyme.compiler.DbmCompiler");
	var TemplateWithCommands = dbm.importClass("com.developedbyme.utils.templates.TemplateWithCommands");
	var JsonAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.JsonAsset");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var RemoveIdCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.RemoveIdCommand");
	var SetTextContentCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.SetTextContentCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var GetNamedArrayValueObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject");
	var CallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var InsertTemplatedArrayCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.template.InsertTemplatedArrayCommand");
	var RemoveElementCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.RemoveElementCommand");
	var SnippetsGenerator = dbm.importClass("com.developedbyme.compiler.snippets.SnippetsGenerator");
	var DocumentationTreeStructureFunctions = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.DocumentationTreeStructureFunctions");
	var IsoDate = dbm.importClass("com.developedbyme.utils.native.date.IsoDate");
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	
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
		
		this._classTemplatePath = "../assets/examples/compiler/documentationTemplates.html#class";
		this._functionTemplatePath = "../assets/examples/compiler/documentationTemplates.html#function";
		
		var currentDate = new Date();
		var dateString = IsoDate.getCompactIsoDateAndTime(currentDate);
		this._rootFolderForSaving = "documentation/" + dateString + "/classes";
		
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
	
	/**
	 * Generates a documentation for a compiler.
	 *
	 * @param	aCompiler	DbmCompiler		The compiler to generate the documentation from.
	 */
	objectFunctions._generateDocumentation = function(aCompiler) {
		console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication::_generateDocumentation");
		console.log(aCompiler);
		
		var documentationTree = aCompiler.documentFiles();
		console.log(documentationTree);
		
		var selectTreeStructureReevaluator = GetNamedArrayValueObject.createCommand(GetVariableObject.createSelectDataCommand(), "data");
		var selectDataReevaluator = GetVariableObject.createCommand(selectTreeStructureReevaluator, "data");
		var selectDefinitionReevaluator = GetVariableObject.createCommand(selectDataReevaluator, "definition");
		var selectDocumentationReevaluator = GetVariableObject.createCommand(selectDataReevaluator, "documentation");
		
		var classTemplate = TemplateWithCommands.create(dbm.singletons.dbmAssetRepository.getAssetData(this._classTemplatePath));
		var functionTemplate = TemplateWithCommands.create(dbm.singletons.dbmAssetRepository.getAssetData(this._functionTemplatePath));
		
		classTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, RemoveIdCommand.createOnTemplateOutputCommand());
		
		this._createSetTextContentCommand(classTemplate, "h1", CallFunctionObject.createCommand(SnippetsGenerator, SnippetsGenerator.getClassNameFromPath, [GetVariableObject.createCommand(selectDefinitionReevaluator, "classPath")]));
		classTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, RemoveElementCommand.createOnTemplateOutputWithQueryCommand("#function"));
		this._createSetTextContentCommand(classTemplate, ".classPath", GetVariableObject.createCommand(selectDefinitionReevaluator, "classPath"));
		this._createSetTextContentCommand(classTemplate, ".description", GetVariableObject.createCommand(selectDocumentationReevaluator, "_description")); //METODO: do not access private variable
		this._createSetTextContentCommand(classTemplate, ".code", GetVariableObject.createCommand(selectDataReevaluator, "fullCode"));
		this._createSetTextContentCommand(classTemplate, ".importSnippet", CallFunctionObject.createCommand(SnippetsGenerator, SnippetsGenerator.createImport, [GetVariableObject.createCommand(selectDefinitionReevaluator, "classPath")]));
		
		
		classTemplate.getExtendedEvent().addCommandToEvent(
			GenericExtendedEventIds.NEW,
			InsertTemplatedArrayCommand.createOnTemplateOutputWithQueryCommand(
				".localFunctions",
				functionTemplate,
				CallFunctionObject.createCommand(
					DocumentationTreeStructureFunctions,
					DocumentationTreeStructureFunctions.getChildrenByType,
					[selectTreeStructureReevaluator, DocumentationTypes.LOCAL_CLASS_FUNCTION]
				)
			)
		);
		
		classTemplate.getExtendedEvent().addCommandToEvent(
			GenericExtendedEventIds.NEW,
			InsertTemplatedArrayCommand.createOnTemplateOutputWithQueryCommand(
				".staticFunctions",
				functionTemplate,
				CallFunctionObject.createCommand(
					DocumentationTreeStructureFunctions,
					DocumentationTreeStructureFunctions.getChildrenByType,
					[selectTreeStructureReevaluator, DocumentationTypes.STATIC_CLASS_FUNCTION]
				)
			)
		);
		
		functionTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, RemoveIdCommand.createOnTemplateOutputCommand());
		this._createSetTextContentCommand(functionTemplate, ".functionName", GetVariableObject.createCommand(selectDefinitionReevaluator, "functionName"));
		this._createSetTextContentCommand(functionTemplate, ".description", GetVariableObject.createCommand(selectDocumentationReevaluator, "_description")); //METODO: do not access private variable
		this._createSetTextContentCommand(functionTemplate, ".code", GetVariableObject.createCommand(selectDataReevaluator, "fullCode"));
		
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
			var returnValue = aClassTemplate.createNewItem(currentChildren[0]);
			
			this._saveClassDocumentation(currentChildren[0].data.definition.classPath, returnValue);
			return returnValue;
		}
		return null;
	};
	
	objectFunctions._saveClassDocumentation = function(aClassPath, aHtmlDocument) {
		console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication::_saveClassDocumentation");
		
		var loader = JsonAsset.create("http://localhost:8080/dbm/examples/saveFile");
		
		var filePath = aClassPath.split(".").join("/");
		
		loader.setupAsFormObjectPost({"fileName": this._rootFolderForSaving + "/" + filePath + ".html", "dataEncoding": "ascii", "data": XmlCreator.createStringFromXml(aHtmlDocument)});
		console.log(loader);
		
		loader.load();
	};
	
	/**
	 * Creates a command that sets the text of an element in the template output.
	 *
	 * @param	aTemplate	TemplateWithCommands			The template to add the command to.
	 * @param	aQuery		String							The query to select the node to set the text in.
	 * @param	aData		ReevaluationBaseObject|String	The reevaluator for the text.
	 */
	objectFunctions._createSetTextContentCommand = function(aTemplate, aQuery, aData) {
		aTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, SetTextContentCommand.createOnTemplateOutputWithQueryCommand(aQuery, aData));
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});