dbm.registerClass("com.developedbyme.compiler.DbmCompiler", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.compiler.DbmCompiler");
	
	var DbmCompiler = dbm.importClass("com.developedbyme.compiler.DbmCompiler");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var LoadingSequence = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence");
	var TextAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.TextAsset");
	var ScriptBreakdown = dbm.importClass("com.developedbyme.compiler.breakdown.ScriptBreakdown");
	var CompileData = dbm.importClass("com.developedbyme.compiler.compiledata.CompileData");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.compiler.DbmCompiler::_init");
		
		this.superCall();
		
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
	
	
	objectFunctions.loadForCompile = function(/* ... aFiles*/) {
		//console.log("com.developedbyme.compiler.DbmCompiler::loadForCompile");
		
		aFiles = arguments;
		
		var currentArray = aFiles;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this.addFile(currentArray[i], -1);
		}
		
		this._loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this.compileFiles, [])); //MEDEBUG
		this._loader.load();
		
		return this;
	};
	
	objectFunctions.addFile = function(aPath, aPosition) {
		//console.log("com.developedbyme.compiler.DbmCompiler::addFile");
		//console.log(aPath, aPosition);
		
		if(ArrayFunctions.indexOfInArray(this._loadedFilePaths, aPath) != -1) {
			return;
		}
		if(aPosition != -1) {
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
		//console.log("com.developedbyme.compiler.DbmCompiler::combineFiles");
		
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
	}
	
	objectFunctions.compileFiles = function() {
		//console.log("com.developedbyme.compiler.DbmCompiler::compileFiles");
		
		var returnString = "(function(){";
		
		var compileData = (this._compileData != null) ? this._compileData : CompileData.create();
		
		var beforeImportCode = "";
		var code = "";
		
		var currentArray = this._loadedFilePaths;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			console.log("compile: " + currentArray[i]);
			var compiledFileCode = this._scriptBreakdowns.getObject(currentArray[i]).compile(compileData);
			if(i < this._numberOfFilesBeforeImport) {
				beforeImportCode += compiledFileCode
			}
			else {
				code += compiledFileCode
			}
			
		}
		
		returnString += compileData.getCompiledStringsCode();
		returnString += beforeImportCode;
		returnString += compileData.getCompiledImportsCode();
		returnString += code;
		returnString += "})();";
		
		console.log(returnString);
		
		return returnString;
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._loadedFiles = null;
		this._loader = null;
		
		this.superCall();
	};
});