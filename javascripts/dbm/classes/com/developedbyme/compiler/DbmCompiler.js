/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.compiler.DbmCompiler", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.DbmCompiler");
	
	//Self reference
	var DbmCompiler = dbm.importClass("com.developedbyme.compiler.DbmCompiler");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ScriptBreakdown = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdown");
	var CompileData = dbm.importClass("com.developedbyme.compiler.compiledata.CompileData");
	var DocumentationData = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.DocumentationData");
	var DocumentedItem = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.DocumentedItem");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var LoadingSequence = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence");
	var TextAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.TextAsset");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var DocumentationFunctions = dbm.importClass("com.developedbyme.compiler.compiledata.documentation.DocumentationFunctions");
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var BreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.BreakdownTypes");
	var DbmBreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.DbmBreakdownTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.DbmCompiler::_init");
		
		this.superCall();
		
		this._notice = null;
		this._loadedFilePaths = new Array();
		this._loadedScripts = new Array();
		this._scriptBreakdowns = NamedArray.create(true);
		this._compileData = null;
		this._numberOfFilesBeforeImport = 0;
		
		this._loader = LoadingSequence.create();
		this._loader._maxNumberOfSimiltaniousLoaders = 1;
		this.addDestroyableObject(this._loader);
		
		return this;
	};
	
	/**
	 * Sets the compile data.
	 */
	objectFunctions.setCompileData = function(aCompileData) {
		this._compileData = aCompileData;
		
		return this;
	}; //End function setCompileData
	
	/**
	 * Sets the number of files to compile before import code.
	 */
	objectFunctions.setNumberOfFilesBeforeImport = function(aNumberOfFiles) {
		this._numberOfFilesBeforeImport = aNumberOfFiles;
		
		return this;
	}; //End function setNumberOfFilesBeforeImport
	
	objectFunctions.setNotice = function(aNotice) {
		this._notice = aNotice;
	};
	
	objectFunctions.addFiles = function(/* ... aFiles*/) {
		//console.log("com.developedbyme.compiler.DbmCompiler::addFiles");
		
		var aFiles = arguments;
		
		var currentArray = aFiles;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this.addFile(currentArray[i], -1);
		}
		
		return this;
	};
	
	objectFunctions.load = function() {
		//console.log("com.developedbyme.compiler.DbmCompiler::load");
		
		this._loader.load();
	};
	
	objectFunctions.addFile = function(aPath, aPosition) {
		//console.log("com.developedbyme.compiler.DbmCompiler::addFile");
		//console.log(aPath, aPosition);
		
		if(ArrayFunctions.indexOfInArray(this._loadedFilePaths, aPath) !== -1) {
			return;
		}
		if(aPosition !== -1) {
			this._loadedFilePaths.splice(aPosition+1, 0, aPath);
		}
		else {
			this._loadedFilePaths.push(aPath);
		}
		
		if(!dbm.singletons.dbmAssetRepository.hasAsset(aPath)) {
			var newAsset = TextAsset.create(aPath);
			dbm.singletons.dbmAssetRepository.addAsset(aPath, newAsset);
		}
		
		var currentAsset = dbm.singletons.dbmAssetRepository.getAsset(aPath);
		currentAsset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._fileLoaded, [aPath, currentAsset]));
		this._loader.addAsset(currentAsset);
	};
	
	objectFunctions.addScript = function(aScript, aPosition) {
		
		aPosition = VariableAliases.valueWithDefault(aPosition, -1);
		
		var internalPath = dbm.singletons.dbmIdManager.getNewId("internalFile");
		
		var newAsset = TextAsset.create(internalPath);
		
		newAsset._internalFunctionality_setData(aScript);
		
		if(aPosition !== -1) {
			this._loadedFilePaths.splice(aPosition+1, 0, internalPath);
		}
		else {
			this._loadedFilePaths.push(internalPath);
		}
		
		dbm.singletons.dbmAssetRepository.addAsset(internalPath, newAsset);
		this._fileLoaded(internalPath, newAsset);
	};
	
	objectFunctions._fileLoaded = function(aPath, aAsset) {
		//console.log("com.developedbyme.compiler.DbmCompiler::_fileLoaded");
		//console.log(aPath);
		var currentFile = aAsset.getData();
		this._loadedScripts.push(currentFile);
		
		var insertPosition = ArrayFunctions.indexOfInArray(this._loadedFilePaths, aPath);
		
		var newBreakdown = ScriptBreakdown.create(this, currentFile);
		this._scriptBreakdowns.addObject(aPath, newBreakdown);
		var currentArray = newBreakdown.getIncludedFiles();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this.addFile(currentArray[i], insertPosition+i);
		}
	};
	
	objectFunctions.combineFiles = function() {
		console.log("com.developedbyme.compiler.DbmCompiler::combineFiles");
		
		var returnString = "";
		var currentArray = this._loadedScripts;
		var currentArrayLength = currentArray.length;
		
		var tabReplace = new RegExp("\t*", "g");
		
		for(var i = 0; i < currentArrayLength; i++) {
			//returnString += currentArray[i].replace(tabReplace, "") + "\n";
			returnString += currentArray[i] + "\n";
		}
		
		returnString += "";
		
		console.log(returnString);
		
		return returnString;
	};
	
	objectFunctions.compileFiles = function() {
		console.log("com.developedbyme.compiler.DbmCompiler::compileFiles");
		
		var returnString = "";
		
		if(this._notice !== null) {
			returnString += this._notice + "\n";
		}
		returnString += "(function(){";
		
		var compileData = (this._compileData !== null) ? this._compileData : CompileData.create();
		
		var beforeImportCode = "";
		var code = "";
		
		var currentArray = this._loadedFilePaths;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			console.log("compile: " + currentArray[i]);
			//console.log(this._scriptBreakdowns.getObject(currentArray[i]));
			var compiledFileCode = this._scriptBreakdowns.getObject(currentArray[i]).compile(compileData);
			if(i < this._numberOfFilesBeforeImport) {
				beforeImportCode += compiledFileCode;
			}
			else {
				code += compiledFileCode;
			}
		}
		
		returnString += compileData.getCompiledStringsCode();
		returnString += beforeImportCode;
		returnString += compileData.getCompiledImportsCode();
		returnString += code;
		returnString += "})();";
		
		console.log(returnString);
		
		return returnString;
	};
	
	objectFunctions.documentFiles = function() {
		console.log("com.developedbyme.compiler.DbmCompiler::documentFiles");
		
		var documentationTreeStructure = TreeStructure.create();
		
		var currentArray = this._loadedFilePaths;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			console.log("document: " + currentArray[i]);
			var currentTreeStructureItem = documentationTreeStructure.getItemByPath(encodeURIComponent(currentArray[i]));
			this.documentFile(currentArray[i], currentTreeStructureItem);
		}
		
		console.log(documentationTreeStructure);
	};
	
	objectFunctions.documentFile = function(aPath, aTreeStructureItem) {
		//console.log("com.developedbyme.compiler.DbmCompiler::documentFile");
		
		var breakDown = this._scriptBreakdowns.getObject(aPath);
		
		//METODO: add file documentation
		
		this._constructDocumentation(breakDown.getChildBreakdowns(), aTreeStructureItem);
	};
	
	objectFunctions._constructDocumentation = function(aBreakdowns, aParentTreeStructureItem) {
		
		var currentDocumentationData = null;
		
		var currentArray = aBreakdowns;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentBreakdown = currentArray[i];
			var currentBreakdownType = currentBreakdown.getType();
			//if(currentDocumentationData !== null) {
			//	
			//	if(currentBreakdownType !== BreakdownTypes.COMMENT) {
			//		var newDocumentedItem = DocumentedItem.create(currentBreakdown.getScript());
			//		newDocumentedItem.documentation = currentDocumentationData;
			//		console.log(newDocumentedItem, currentBreakdown);
			//		currentDocumentationData = null;
			//	}
			//}
			switch(currentBreakdownType) {
				case DbmBreakdownTypes.REGISTER_CLASS:
					var newTreeStructureItem = aParentTreeStructureItem.getRoot().getItemByPath("class_" + aParentTreeStructureItem.getNumberOfChildren(), aParentTreeStructureItem);
					var newDocumentation = DocumentationFunctions.documentDbmClass(currentBreakdown, currentDocumentationData);
					newTreeStructureItem.data = newDocumentation;
					this._constructDocumentation(currentBreakdown.getChildBreakdowns(), newTreeStructureItem);
					break;
				case BreakdownTypes.NAMED_FUNCTION_DECLARATION:
					var newTreeStructureItem = aParentTreeStructureItem.getRoot().getItemByPath("function_" + aParentTreeStructureItem.getNumberOfChildren(), aParentTreeStructureItem);
					var newDocumentation = DocumentationFunctions.documentNamedFunction(currentBreakdown, currentDocumentationData);
					newTreeStructureItem.data = newDocumentation;
					this._constructDocumentation(currentBreakdown.getChildBreakdowns(), newTreeStructureItem);
					break;
				case BreakdownTypes.CODE:
				case BreakdownTypes.EVALUATION:
				case BreakdownTypes.CALL_FUNCTION:
				case BreakdownTypes.FUNCTION_DECLARATION:
				case BreakdownTypes.LIST:
				case BreakdownTypes.LINE:
					//METODO: if there is a documentation, we should add a code documentation
					this._constructDocumentation(currentBreakdown.getChildBreakdowns(), aParentTreeStructureItem);
					break;
				case BreakdownTypes.DOCUMENTATION:
					currentDocumentationData = DocumentationData.create(currentBreakdown.getScript());
				case BreakdownTypes.COMMENT:
					//MENOTE: skip the reset of currentDocumentationData
					continue;
				default:
					//METODO: error message
					ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_constructDocumentation", "Unknown type " + currentBreakdownType + ".");
				case BreakdownTypes.VARIABLE_ON_OBJECT_REFERENCE:
				case BreakdownTypes.STRING:
				case BreakdownTypes.VARIABLE_REFERENCE:
				case BreakdownTypes.RETURN:
				case BreakdownTypes.DECLARE_VARIABLE:
				case BreakdownTypes.NUMBER:
				case BreakdownTypes.LITERAL_ARRAY:
				case BreakdownTypes.LITERAL_NAME:
				case BreakdownTypes.LITERAL_OBJECT:
				case BreakdownTypes.FOR:
				case BreakdownTypes.WHILE:
				case BreakdownTypes.ASSOCIATIVE_VARIABLE_ON_OBJECT_REFERENCE:
				case BreakdownTypes.NEW:
				case BreakdownTypes.SWITCH:
				case BreakdownTypes.CONDITION:
				case BreakdownTypes.CASE:
				case BreakdownTypes.TRY:
				case BreakdownTypes.CATCH:
				case BreakdownTypes.FINALLY:
				case BreakdownTypes.DELETE:
				case BreakdownTypes.DEFAULT:
				case BreakdownTypes.KEYWORD:
				case DbmBreakdownTypes.IMPORT_CLASS:
					//MENOTE: do nothing
					break;
			}
			currentDocumentationData = null;
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._loadedFiles = null;
		this._loader = null;
		
		this.superCall();
	};
});