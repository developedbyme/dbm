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
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.compiler.DbmCompiler::init");
		
		this.superCall();
		
		this._loadedFilePaths = new Array();
		this._loadedScripts = new Array();
		this._scriptBreakdowns = NamedArray.create(true);
		
		this._loader = LoadingSequence.create();
		this._loader._maxNumberOfSimiltaniousLoaders = 1;
		this.addDestroyableObject(this._loader);
		
		return this;
	};
	
	objectFunctions.loadForCompile = function(/* ... aFiles*/) {
		//console.log("com.developedbyme.compiler.DbmCompiler::loadForCompile");
		
		aFiles = arguments;
		
		var currentArray = aFiles;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this.addFile(currentArray[i]);
		}
		
		this._loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this.compileFiles, [])); //MEDEBUG
		this._loader.load();
		
		return this;
	};
	
	objectFunctions.addFile = function(aPath) {
		//console.log("com.developedbyme.compiler.DbmCompiler::addFile");
		//console.log(aPath);
		
		if(ArrayFunctions.indexOfInArray(this._loadedFilePaths, aPath) != -1) {
			return;
		}
		this._loadedFilePaths.push(aPath);
		
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
		
		var newBreakdown = ScriptBreakdown.create(this, currentFile);
		this._scriptBreakdowns.addObject(aPath, newBreakdown);
		var currentArray = newBreakdown.getIncludedFiles();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this.addFile(currentArray[i]);
		}
	};
	
	objectFunctions.combineFiles = function() {
		//console.log("com.developedbyme.compiler.DbmCompiler::combineFiles");
		
		var returnString = "";
		var currentArray = this._loadedScripts;
		var currentArrayLength = currentArray.length;
		
		var tabReplace = new RegExp("\t*", "g");
		
		for(var i = 0; i < currentArrayLength; i++) {
			returnString += currentArray[i].replace(tabReplace, "") + "\n";
		}
		
		returnString += "";
		
		//console.log(returnString);
		
		return returnString;
	}
	
	objectFunctions.compileFiles = function() {
		//console.log("com.developedbyme.compiler.DbmCompiler::compileFiles");
		
		var returnString = "";
		
		var currentArray = this._loadedFilePaths;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			returnString += this._scriptBreakdowns.getObject(currentArray[i]).compile();
		}
		
		console.log(returnString);
		
		return returnString;
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._loadedFiles = null;
		this._loader = null;
		
		this.superCall();
	};
});