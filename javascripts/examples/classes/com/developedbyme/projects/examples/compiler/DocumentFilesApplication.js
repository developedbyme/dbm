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
	var UrlResolver = dbm.importClass("com.developedbyme.utils.file.UrlResolver");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var LoadingSequence = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var RemoveIdCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.RemoveIdCommand");
	var SetTextContentCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.SetTextContentCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var GetNamedArrayValueObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetNamedArrayValueObject");
	var CallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var InsertTemplatedArrayCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.template.InsertTemplatedArrayCommand");
	var RemoveElementCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.RemoveElementCommand");
	var RebaseDocumentLinksCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.htmldom.RebaseDocumentLinksCommand");
	var QuerySelectorObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.htmldom.QuerySelectorObject");
	var CreateClassObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.CreateClassObject");
	var ArgumentFromCallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.ArgumentFromCallFunctionObject");
	
	var SnippetsGenerator = dbm.importClass("com.developedbyme.compiler.snippets.SnippetsGenerator");
	var DocumentationFunctions = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.DocumentationFunctions");
	var DocumentationTreeStructureFunctions = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.DocumentationTreeStructureFunctions");
	var IsoDate = dbm.importClass("com.developedbyme.utils.native.date.IsoDate");
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var ArraySortingFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArraySortingFunctions");
	var DomManipulationFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomManipulationFunctions");
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var TreeStructureFunctions = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureFunctions");
	
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
		
		this._packageIndexTemplatePath = "../assets/examples/compiler/documentationIndexTemplates.html#package";
		this._packageIndexSubPackageTemplatePath = "../assets/examples/compiler/documentationIndexTemplates.html#subPackage";
		this._packageIndexClassTemplatePath = "../assets/examples/compiler/documentationIndexTemplates.html#class";
		
		this._classTemplatePath = "../assets/examples/compiler/documentationTemplates.html#class";
		this._functionTemplatePath = "../assets/examples/compiler/documentationTemplates.html#function";
		this._variableTemplatePath = "../assets/examples/compiler/documentationTemplates.html#variable";
		
		var currentDate = new Date();
		var dateString = IsoDate.getCompactIsoDateAndTime(currentDate);
		this._rootFolderForSaving = "documentation/" + dateString;
		this._currentFilePath = UrlResolver.create();
		
		this._externalTypes = NamedArray.create(false);
		this._externalTypes.addObject("Document", "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model");
		this._externalTypes.addObject("HTMLElement", "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement");
		this._externalTypes.addObject("Element", "https://developer.mozilla.org/en-US/docs/Web/API/Element");
		
		this._assetsLoader.addAssetsByPath(this._packageIndexTemplatePath, this._packageIndexSubPackageTemplatePath, this._packageIndexClassTemplatePath, this._classTemplatePath, this._functionTemplatePath, this._variableTemplatePath);
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
		
		var classHierarchyGraph = NamedArray.create(false);
		
		var documentationTree = aCompiler.documentFiles();
		console.log(documentationTree);
		
		aCompiler.getClassHierarchy(classHierarchyGraph);
		console.log(classHierarchyGraph);
		
		var selectTreeStructureReevaluator = GetNamedArrayValueObject.createCommand(GetVariableObject.createSelectDataCommand(), "data");
		var selectDataReevaluator = GetVariableObject.createCommand(selectTreeStructureReevaluator, "data");
		var selectDefinitionReevaluator = GetVariableObject.createCommand(selectDataReevaluator, "definition");
		var selectDocumentationReevaluator = GetVariableObject.createCommand(selectDataReevaluator, "documentation");
		
		//Index page
		var packageIndexTemplate = TemplateWithCommands.create(dbm.singletons.dbmAssetRepository.getAssetData(this._packageIndexTemplatePath));
		var packageIndexSubPackageTemplate = TemplateWithCommands.create(dbm.singletons.dbmAssetRepository.getAssetData(this._packageIndexSubPackageTemplatePath));
		var packageIndexClassTemplate = TemplateWithCommands.create(dbm.singletons.dbmAssetRepository.getAssetData(this._packageIndexClassTemplatePath));
		
		packageIndexTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, RemoveIdCommand.createOnTemplateOutputCommand());
		packageIndexTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, RemoveElementCommand.createOnTemplateOutputWithQueryCommand("#templates"));
		this._createSetTextContentCommand(packageIndexTemplate, "h1", CallFunctionObject.createFunctionOnObjectCommand(selectTreeStructureReevaluator, "getAttribute", ["packagePath"]));
		
		var createClassListCommand = InsertTemplatedArrayCommand.createOnTemplateOutputWithQueryCommand(
			".classList",
			packageIndexClassTemplate,
			ArgumentFromCallFunctionObject.createCommand(
				TreeStructureFunctions,
				TreeStructureFunctions.getItemsByAttribute,
				[
					CallFunctionObject.createFunctionOnObjectCommand(selectTreeStructureReevaluator, "getChildren", []),
					"type",
					"class",
					CreateClassObject.createCommand(Array)
				],
				3
			)
		);
		var createSubPackageListCommand = InsertTemplatedArrayCommand.createOnTemplateOutputWithQueryCommand(
			".classList",
			packageIndexSubPackageTemplate,
			ArgumentFromCallFunctionObject.createCommand(
				TreeStructureFunctions,
				TreeStructureFunctions.getItemsWithoutAttribute,
				[
					CallFunctionObject.createFunctionOnObjectCommand(selectTreeStructureReevaluator, "getChildren", []),
					"type",
					CreateClassObject.createCommand(Array)
				],
				2
			)
		);
		
		packageIndexTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, createClassListCommand);
		packageIndexTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, createSubPackageListCommand);
		
		
		
		this._createSetTextContentCommand(packageIndexSubPackageTemplate, ".packageName", CallFunctionObject.createFunctionOnObjectCommand(selectTreeStructureReevaluator, "getName", []));
		//packageIndexSubPackageTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this.insertClassLink, [QuerySelectorObject.createOnTemplateOutputCommand(".packageName"), CallFunctionObject.createFunctionOnObjectCommand(selectTreeStructureReevaluator, "getName", [])]));
		packageIndexSubPackageTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, createClassListCommand);
		packageIndexSubPackageTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, createSubPackageListCommand);
		
		
		packageIndexClassTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this.insertClassLink, [GetNamedArrayValueObject.createCommand(GetVariableObject.createSelectDataCommand(), "output"), CallFunctionObject.createFunctionOnObjectCommand(selectTreeStructureReevaluator, "getAttribute", ["classPath"])]));
		
		
		packageIndexTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, RebaseDocumentLinksCommand.createOnTemplateOutputCommand(this._currentFilePath));
		
		//Class page
		var classTemplate = TemplateWithCommands.create(dbm.singletons.dbmAssetRepository.getAssetData(this._classTemplatePath));
		var functionTemplate = TemplateWithCommands.create(dbm.singletons.dbmAssetRepository.getAssetData(this._functionTemplatePath));
		var variableTemplate = TemplateWithCommands.create(dbm.singletons.dbmAssetRepository.getAssetData(this._variableTemplatePath));
		
		classTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, RemoveIdCommand.createOnTemplateOutputCommand());
		
		
		this._createSetTextContentCommand(classTemplate, "h1", CallFunctionObject.createCommand(SnippetsGenerator, SnippetsGenerator.getClassNameFromPath, [GetVariableObject.createCommand(selectDefinitionReevaluator, "classPath")]));
		classTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, RemoveElementCommand.createOnTemplateOutputWithQueryCommand("#templates"));
		this._createSetTextContentCommand(classTemplate, ".classPath", GetVariableObject.createCommand(selectDefinitionReevaluator, "classPath"));
		this._createSetTextContentCommand(classTemplate, ".description", GetVariableObject.createCommand(selectDocumentationReevaluator, "_description")); //METODO: do not access private variable
		this._createSetTextContentCommand(classTemplate, ".fullCode .code", GetVariableObject.createCommand(selectDataReevaluator, "fullCode"));
		this._createSetTextContentCommand(classTemplate, ".snippet .code", CallFunctionObject.createCommand(SnippetsGenerator, SnippetsGenerator.createImport, [GetVariableObject.createCommand(selectDefinitionReevaluator, "classPath")]));
		
		classTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this.insertDependencyLinks, [QuerySelectorObject.createOnTemplateOutputCommand(".dependencies"), GetVariableObject.createCommand(selectDefinitionReevaluator, "dependencies")]));
		classTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this.insertClassInheritanceLinks, [QuerySelectorObject.createOnTemplateOutputCommand(".classInheritance"), GetVariableObject.createCommand(selectDefinitionReevaluator, "classPath"), classHierarchyGraph]));
		classTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this.insertSubclassLinks, [QuerySelectorObject.createOnTemplateOutputCommand(".subClasses"), GetVariableObject.createCommand(selectDefinitionReevaluator, "classPath"), classHierarchyGraph]));
		
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
				".localVariables",
				variableTemplate,
				CallFunctionObject.createCommand(
					DocumentationTreeStructureFunctions,
					DocumentationTreeStructureFunctions.getChildrenByType,
					[selectTreeStructureReevaluator, DocumentationTypes.LOCAL_CLASS_VARIABLE]
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
		
		classTemplate.getExtendedEvent().addCommandToEvent(
			GenericExtendedEventIds.NEW,
			InsertTemplatedArrayCommand.createOnTemplateOutputWithQueryCommand(
				".staticVariables",
				variableTemplate,
				CallFunctionObject.createCommand(
					DocumentationTreeStructureFunctions,
					DocumentationTreeStructureFunctions.getChildrenByType,
					[selectTreeStructureReevaluator, DocumentationTypes.STATIC_CLASS_VARIABLE]
				)
			)
		);
		
		functionTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, RemoveIdCommand.createOnTemplateOutputCommand());
		this._createSetTextContentCommand(functionTemplate, ".functionName", GetVariableObject.createCommand(selectDefinitionReevaluator, "functionName"));
		this._createSetTextContentCommand(functionTemplate, ".description", GetVariableObject.createCommand(selectDocumentationReevaluator, "_description")); //METODO: do not access private variable
		this._createSetTextContentCommand(functionTemplate, ".fullCode .code", GetVariableObject.createCommand(selectDataReevaluator, "fullCode"));
		functionTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this.insertArgumentsDefinition, [QuerySelectorObject.createOnTemplateOutputCommand(".arguments"), QuerySelectorObject.createOnTemplateOutputCommand(".argumentsDescription"), GetVariableObject.createCommand(selectDefinitionReevaluator, "argumentNames"), selectDocumentationReevaluator, classHierarchyGraph.getNamesArray()]));
		functionTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this.insertReturnValueDefinition, [QuerySelectorObject.createOnTemplateOutputCommand(".returnValue"), QuerySelectorObject.createOnTemplateOutputCommand(".returnValueDescription"), GetVariableObject.createCommand(selectDefinitionReevaluator, "returnType"), selectDocumentationReevaluator, classHierarchyGraph.getNamesArray()]));
		
		this._createSetTextContentCommand(variableTemplate, ".variableName", GetVariableObject.createCommand(selectDefinitionReevaluator, "variableName"));
		this._createSetTextContentCommand(variableTemplate, ".value", GetVariableObject.createCommand(selectDefinitionReevaluator, "value"));
		this._createSetTextContentCommand(variableTemplate, ".description", GetVariableObject.createCommand(selectDocumentationReevaluator, "_description")); //METODO: do not access private variable
		
		//Rebase all the links at the end
		classTemplate.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, RebaseDocumentLinksCommand.createOnTemplateOutputCommand(this._currentFilePath));
		
		var outputTreeStructure = TreeStructure.create();
		
		var currentArray = documentationTree.getRoot().getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentFile = currentArray[i];
			this._generateDocumentationForFile(currentFile, classTemplate, outputTreeStructure);
		}
		
		this._generatePackageIndexes(outputTreeStructure.getItemByPath("classes"), packageIndexTemplate, "(root)");
		console.log(">>>>>", outputTreeStructure);
		
		var saveFilesLoadingSequence = LoadingSequence.create();
		this._createLoaders(outputTreeStructure.getRoot(), saveFilesLoadingSequence);
		
		console.log(saveFilesLoadingSequence);
		saveFilesLoadingSequence.load();
	};
	
	objectFunctions._generateDocumentationForFile = function(aTreeStructureItem, aClassTemplate, aOutputTreeStructure) {
		var currentChildren = aTreeStructureItem.getChildren();
		if(currentChildren.length === 1 && currentChildren[0].data.type === DocumentationTypes.CLASS) {
			var currentClassPath = currentChildren[0].data.definition.classPath;
			var currentFilePath = "classes/" + currentClassPath.split(".").join("/")  + ".html";
			this._currentFilePath.setupBaseUrl("", currentFilePath.substring(0, currentFilePath.lastIndexOf("/")));
			
			var currentTreeStructureItem = aOutputTreeStructure.getItemByPath(currentFilePath);
			currentTreeStructureItem.data = aClassTemplate.createNewItem(currentChildren[0]);
			currentTreeStructureItem.setAttribute("type", "class");
			currentTreeStructureItem.setAttribute("classPath", currentClassPath);
		}
	};
	
	objectFunctions._generatePackageIndexes = function(aTreeStructureItem, aIndexTemplate, aCurrentPackage) {
		
		var currentType = "none";
		
		if(aTreeStructureItem.hasAttribute("type")) {
			currentType = aTreeStructureItem.getAttribute("type");
		}
		if(currentType !== "class") {
			var basePath = aTreeStructureItem.getPath();
			
			this._currentFilePath.setupBaseUrl("", basePath.substring(1, basePath.length));
			
			aTreeStructureItem.setAttribute("type", "packageIndex");
			aTreeStructureItem.setAttribute("packagePath", aCurrentPackage);
			aTreeStructureItem.data = aIndexTemplate.createNewItem(aTreeStructureItem);
			
		}
		
		var currentArray = aTreeStructureItem.getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentItem = currentArray[i];
			var newPath = (aCurrentPackage === "(root)") ? currentItem.getName() : aCurrentPackage + "." + currentItem.getName();
			this._generatePackageIndexes(currentArray[i], aIndexTemplate, newPath);
		}
	}
	
	objectFunctions._createLoaders = function(aTreeStructureItem, aLoadingSequence) {
		
		var currentType = "none";
		if(aTreeStructureItem.hasAttribute("type")) {
			currentType = aTreeStructureItem.getAttribute("type");
		}
		if(currentType === "class") {
			aLoadingSequence.addLoader(this._saveClassDocumentation(this._rootFolderForSaving + aTreeStructureItem.getPath(), aTreeStructureItem.data));
		}
		else if(currentType === "packageIndex") {
			aLoadingSequence.addLoader(this._saveClassDocumentation(this._rootFolderForSaving + aTreeStructureItem.getPath() + "/index.html", aTreeStructureItem.data));
		}
		
		var currentArray = aTreeStructureItem.getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this._createLoaders(currentArray[i], aLoadingSequence);
		}
	};
	
	objectFunctions._saveClassDocumentation = function(aFilePath, aHtmlDocument) {
		//console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication::_saveClassDocumentation");
		
		var loader = JsonAsset.create("http://localhost:8080/dbm/examples/saveFile");
		
		loader.setupAsFormObjectPost({"fileName": aFilePath, "dataEncoding": "ascii", "data": "<!DOCTYPE html>\n" + XmlCreator.createStringFromXml(aHtmlDocument)});
		
		return loader;
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
	 * Inserts inheritance links to a node.
	 *
	 * @param	aHolderElement			Element		The element to insert the links in.
	 * @param	aClass					String		The name of the class to get inheritance for.
	 * @param	aClassInheritanceGraph	NamedArray	The inheritance data graph.
	 */
	objectFunctions.insertClassInheritanceLinks = function(aHolderElement, aClass, aClassInheritanceGraph) {
		var currentClassName = aClassInheritanceGraph.getObject(aClass);
		var classArray = new Array();
		
		var debugCounter = 0;
		while(currentClassName) {
			if(debugCounter++ > 1000) {
				//METODO: error message
				break;
			}
			classArray.push(currentClassName);
			currentClassName = aClassInheritanceGraph.getObject(currentClassName);
		}
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(aHolderElement.ownerDocument);
		
		this.insertClassLinks(aHolderElement, classArray, htmlCreator.createText(" > "), "No inheritance");
	};
	
	/**
	 * Inserts subclass links to a node.
	 *
	 * @param	aHolderElement			Element		The element to insert the links in.
	 * @param	aClass					String		The name of the class to get subclasses for.
	 * @param	aClassInheritanceGraph	NamedArray	The inheritance data graph.
	 */
	objectFunctions.insertSubclassLinks = function(aHolderElement, aClass, aClassInheritanceGraph) {
		var currentClassName = aClassInheritanceGraph.getObject(aClass);
		var classArray = new Array();
		
		aClassInheritanceGraph.identifyObjectWithMultipleResults(aClass, classArray);
		classArray.sort(ArraySortingFunctions.classPathsByName);
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(aHolderElement.ownerDocument);
		
		this.insertClassLinks(aHolderElement, classArray, htmlCreator.createText(", "), "Class has no subclasses.");
	};
	
	/**
	 * Inserts dependency links to a node.
	 *
	 * @param	aHolderElement		Element		The element to insert the links in.
	 * @param	aClassPaths			Array		Array of class paths.
	 */
	objectFunctions.insertDependencyLinks = function(aHolderElement, aClassPaths) {
		var classArray = ArrayFunctions.copyArray(aClassPaths);
		classArray.sort(ArraySortingFunctions.classPathsByName);
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(aHolderElement.ownerDocument);
		
		this.insertClassLinks(aHolderElement, classArray, htmlCreator.createText(", "), "Class has no dependencies.");
	};
	
	/**
	 * Inserts a list of class links.
	 *
	 * @param	aHolderElement		HTMLElement		The element to insert the links in.
	 * @param	aClassPaths			Array<String>	Array of class paths.
	 * @param	aSpacingElement		HTMLElement		The element to insert between links.
	 * @param	aNoDataText			String			The text to display if there are no links.
	 */
	objectFunctions.insertClassLinks = function(aHolderElement, aClassPaths, aSpacingElement, aNoDataText) {
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(aHolderElement.ownerDocument);
		
		var currentArray = aClassPaths;
		var currentArrayLength = currentArray.length;
		if(currentArrayLength) {
			for(var i = 0; i < currentArrayLength; i++) {
				if(i !== 0) {
					aHolderElement.appendChild(DomManipulationFunctions.cloneNode(aSpacingElement, true));
				}
				aHolderElement.appendChild(this.createClassLink(currentArray[i], htmlCreator));
			}
		}
		else {
			aHolderElement.appendChild(htmlCreator.createNode("span", {"class": "noData"}, htmlCreator.createText(aNoDataText)));
		}
	};
	
	/**
	 * Inserts arguments in a function definition.
	 *
	 * @param	aHolderElement				HTMLElement			The element to insert the definition in.
	 * @param	aDescriptionHolderElement	HTMLElement			The element to insert the description in.
	 * @param	aArguments					Array<String>		The names of the arguments to insert.
	 * @param	aDocumentation				DocumentationData	The documentation data for the function.
	 * @param	aClassPaths					Array<String>		List of all the class paths.
	 */
	objectFunctions.insertArgumentsDefinition = function(aHolderElement, aDescriptionHolderElement, aArguments, aDocumentation, aClassPaths) {
		//console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication::insertArgumentsDefinition");
		//console.log(aHolderElement, aArguments, aDocumentation, aClassPaths);
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(aHolderElement.ownerDocument);
		
		var documentationFlags = aDocumentation.getFlags();
		
		var currentArray = aArguments;
		var currentArrayLength = currentArray.length;
		if(currentArrayLength > 0) {
			for(var i = 0; i < currentArrayLength; i++) {
				var currentArgumentName = currentArray[i];
				var currentDescription = htmlCreator.createDiv({"class": "argumentDescription"});
				aDescriptionHolderElement.appendChild(currentDescription);
				if(i !== 0) {
					aHolderElement.appendChild(htmlCreator.createText(", "));
				}
				aHolderElement.appendChild(htmlCreator.createText(currentArgumentName));
				currentDescription.appendChild(htmlCreator.createText(currentArgumentName));
				var documentationFlag = this._getParamFlagByName(currentArgumentName, documentationFlags);
				//console.log(currentArgumentName, documentationFlag, documentationFlags);
				if(documentationFlag !== null) {
					if(documentationFlag.arguments.length > 2) {
						var objectTypes = documentationFlag.arguments[1];
					
						var currentArray2 = StringFunctions.splitSeparatedString(objectTypes, "|");
						var currentArray2Length = currentArray2.length;
						for(var j = 0; j < currentArray2Length; j++) {
							var currentType = currentArray2[j];
						
							if(j === 0) {
								aHolderElement.appendChild(htmlCreator.createText(":"));
								currentDescription.appendChild(htmlCreator.createText(":"));
							}
							else {
								aHolderElement.appendChild(htmlCreator.createText(" | "));
								currentDescription.appendChild(htmlCreator.createText(" | "));
							}
						
							if(this._externalTypes.select(currentType)) {
								aHolderElement.appendChild(htmlCreator.createNode("a", {"href": this._externalTypes.currentSelectedItem, "rel": "external"}, htmlCreator.createText(currentType)));
								currentDescription.appendChild(htmlCreator.createNode("a", {"href": this._externalTypes.currentSelectedItem, "rel": "external"}, htmlCreator.createText(currentType)));
							}
							else {
								//METODO: typed arrays
								var matchingClassPaths = DocumentationFunctions.getFullClassPathsByName(currentType, aClassPaths);
							
								if(matchingClassPaths.length === 1) {
									aHolderElement.appendChild(this.createClassLink(matchingClassPaths[0], htmlCreator));
									currentDescription.appendChild(this.createClassLink(matchingClassPaths[0], htmlCreator));
								}
								else if(matchingClassPaths.length > 1) {
									//METODO: multiple matches
									//METODO: error message
								}
								else {
									var spanClassType = "unknownType";
									if(JavascriptLanguageFunctions.isTypeNative(currentType)) {
										spanClassType = "nativeType";
									}
									aHolderElement.appendChild(htmlCreator.createNode("span", {"class": spanClassType}, htmlCreator.createText(currentType)));
									currentDescription.appendChild(htmlCreator.createNode("span", {"class": spanClassType}, htmlCreator.createText(currentType)));
								}
							}
						}
					}
				
					if(documentationFlag.arguments.length > 1) {
						currentDescription.appendChild(htmlCreator.createText(" - "));
						currentDescription.appendChild(htmlCreator.createText(documentationFlag.arguments[documentationFlag.arguments.length-1]));
					}
				}
			}
		}
		else {
			aDescriptionHolderElement.appendChild(htmlCreator.createNode("span", {"class": "noData"}, htmlCreator.createText("Function has no arguments")));
		}
		
		//METODO: add rest parameter
	};
	
	/**
	 * Gets a param flag by its name.
	 *
	 * @param	aName	String							The name of param.
	 * @param	aFlags	Array<DocumentationFlagData>	Array of the flags to search in.
	 *
	 * @return	DocumentationFlagData	The first flag that matches the name.
	 */
	objectFunctions._getParamFlagByName = function(aName, aFlags) {
		var currentArray = aFlags;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentFlag = currentArray[i];
			if(currentFlag.type === "param" && currentFlag.arguments.length > 0 && currentFlag.arguments[0] === aName) {
				return currentFlag;
			}
		}
		return null;
	};
	
	/**
	 * Gets a flag by its type.
	 *
	 * @param	aType	String							The type of param.
	 * @param	aFlags	Array<DocumentationFlagData>	Array of the flags to search in.
	 *
	 * @return	DocumentationFlagData	The first flag that matches the type.
	 */
	objectFunctions._getFlagByType = function(aType, aFlags) {
		var currentArray = aFlags;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentFlag = currentArray[i];
			if(currentFlag.type === aType) {
				return currentFlag;
			}
		}
		return null;
	};
	
	/**
	 * Inserts a return value in a function definition.
	 *
	 * @param	aHolderElement				HTMLElement			The element to insert the definition in.
	 * @param	aDescriptionHolderElement	HTMLElement			The element to insert the description in.
	 * @param	aHasReturnValue				String				The type of return value.
	 * @param	aDocumentation				DocumentationData	The documentation data for the function.
	 * @param	aClassPaths					Array<String>		List of all the class paths.
	 */
	objectFunctions.insertReturnValueDefinition = function(aHolderElement, aDescriptionHolderElement, aReturnValueType, aDocumentation, aClassPaths) {
		//console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication::insertReturnValueDefinition");
		//console.log(aHolderElement, aDescriptionHolderElement, aReturnValueType, aDocumentation, aClassPaths);
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(aHolderElement.ownerDocument);
		
		var documentationFlags = aDocumentation.getFlags();
		
		aHolderElement.appendChild(htmlCreator.createText(":"));
		
		if(aReturnValueType === "none") {
			aHolderElement.appendChild(htmlCreator.createNode("span", {"class": "noData"}, htmlCreator.createText("void")));
			aDescriptionHolderElement.appendChild(htmlCreator.createNode("span", {"class": "noData"}, htmlCreator.createText("Function has no return value.")));
		}
		else if(aReturnValueType === "self") {
			aHolderElement.appendChild(htmlCreator.createNode("span", {"class": "noData"}, htmlCreator.createText("self")));
			aDescriptionHolderElement.appendChild(htmlCreator.createText("Self. Function is linkable."));
		}
		else {
			var documentationFlag = this._getFlagByType("return", documentationFlags);
			if(documentationFlag !== null) {
				var objectTypes = documentationFlag.arguments[0];
			
				var currentArray2 = StringFunctions.splitSeparatedString(objectTypes, "|");
				var currentArray2Length = currentArray2.length;
				for(var j = 0; j < currentArray2Length; j++) {
					var currentType = currentArray2[j];
				
					if(j !== 0) {
						aHolderElement.appendChild(htmlCreator.createText(" | "));
						aDescriptionHolderElement.appendChild(htmlCreator.createText(" | "));
					}
				
					if(this._externalTypes.select(currentType)) {
						aHolderElement.appendChild(htmlCreator.createNode("a", {"href": this._externalTypes.currentSelectedItem, "rel": "external"}, htmlCreator.createText(currentType)));
						aDescriptionHolderElement.appendChild(htmlCreator.createNode("a", {"href": this._externalTypes.currentSelectedItem, "rel": "external"}, htmlCreator.createText(currentType)));
					}
					else {
						//METODO: typed arrays
						var matchingClassPaths = DocumentationFunctions.getFullClassPathsByName(currentType, aClassPaths);
					
						if(matchingClassPaths.length === 1) {
							aHolderElement.appendChild(this.createClassLink(matchingClassPaths[0], htmlCreator));
							aDescriptionHolderElement.appendChild(this.createClassLink(matchingClassPaths[0], htmlCreator));
						}
						else if(matchingClassPaths.length > 1) {
							//METODO: multiple matches
							//METODO: error message
						}
						else {
							var spanClassType = "unknownType";
							if(JavascriptLanguageFunctions.isTypeNative(currentType)) {
								spanClassType = "nativeType";
							}
							aHolderElement.appendChild(htmlCreator.createNode("span", {"class": spanClassType}, htmlCreator.createText(currentType)));
							aDescriptionHolderElement.appendChild(htmlCreator.createNode("span", {"class": spanClassType}, htmlCreator.createText(currentType)));
						}
					}
				}
				
				//METODO: description
				aDescriptionHolderElement.appendChild(htmlCreator.createText(" - " + documentationFlag.arguments[documentationFlag.arguments.length-1]));
			}
			else {
				aHolderElement.appendChild(htmlCreator.createNode("span", {"class": "unknownType"}, htmlCreator.createText("Unknown")));
				aDescriptionHolderElement.appendChild(htmlCreator.createNode("span", {"class": "unknownType"}, htmlCreator.createText("Unknown")));
			}
		}
	};
	
	objectFunctions.insertClassLink = function(aHolderElement, aClassPath) {
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(aHolderElement.ownerDocument);
		aHolderElement.appendChild(this.createClassLink(aClassPath, htmlCreator));
	};
	
	/**
	 * Creates a new link to a class.
	 *
	 * @param	aClassPath		String			The path to the class.
	 * @param	aHtmlCreator	HtmlCreator		The creator for new nodes.
	 *
	 * @return	Element	The a tag that links to the class.
	 */
	objectFunctions.createClassLink = function(aClassPath, aHtmlCreator) {
		var filePath = "classes/" + aClassPath.split(".").join("/")  + ".html";
		var className = aClassPath.substring(aClassPath.lastIndexOf(".")+1, aClassPath.length);
		return aHtmlCreator.createNode("a", {"title": aClassPath, "href": filePath}, aHtmlCreator.createText(className));
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});