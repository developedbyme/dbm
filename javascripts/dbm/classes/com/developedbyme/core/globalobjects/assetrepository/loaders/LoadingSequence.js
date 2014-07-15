/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Loader for a sequence of assets or loaders. Can run both sequencially or simultaneously.
 */
dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	//Self reference
	var LoadingSequence = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	staticFunctions.DEFAULT_MAX_NUMBER_OF_SIMILTANIOUS_LOADERS = 5;
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence::_init");
		
		this.superCall();
		
		this._groupId = dbm.singletons.dbmIdManager.getNewId("loadingSequence");
		
		this._time = this.createProperty("time", dbm.singletons.dbmAnimationManager.getGlobalTimeNode().getProperty("time"));
		this._progress = this.createProperty("progress", 0);
		this._loadedSize = this.createProperty("loadedSize", 0);
		this._totalSize = this.createProperty("totalSize", 0);
		this._maxNumberOfSimiltaniousLoaders = ClassReference.DEFAULT_MAX_NUMBER_OF_SIMILTANIOUS_LOADERS;
		this._loaders = new Array();
		this._loadingLoaders = new Array();
		this._waitingLoaders = new Array();
		this._loadedLoaders = new Array();
		
		this._continueOnError = true;
		this._status = AssetStatusTypes.NOT_LOADED;
		this._isLoading = false;
		this._isAddingLoaders = false;
		
		this.createUpdateFunction("progress", this._updateProgressFlow, [this._time], [this._progress, this._loadedSize, this._totalSize]);
		
		return this;
	};
	
	objectFunctions.getData = function() {
		return this._data;
	};
	
	objectFunctions.getStatus = function() {
		return this._status;
	};
	
	objectFunctions.getProgress = function() {
		return this._progress.getValue();
	};
	
	objectFunctions.getLoadedSize = function() {
		return this._loadedSize.getValue();
	};
	
	objectFunctions.getTotalSize = function() {
		return this._totalSize.getValue();
	};
	
	objectFunctions.load = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence::load");
		
		if(this._isLoading) return;
		
		this._isLoading = true;
		this._status = AssetStatusTypes.LOADING;
		this._continueLoading();
		
		return this;
	};
	
	objectFunctions.addLoader = function(aLoader) {
		this._loaders.push(aLoader);
		
		if(this._isLoading && !this._isAddingLoaders && (this._loadingLoaders.length < this._maxNumberOfSimiltaniousLoaders || this._maxNumberOfSimiltaniousLoaders <= 0)) {
			this._loadLoader(aLoader);
		}
		else {
			this._waitingLoaders.push(aLoader);
		}
		
		return this;
	};
	
	objectFunctions.addAsset = function(aAsset) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence::addAsset");
		if(ArrayFunctions.indexOfInArray(this._loaders, aAsset) !== -1) {
			return this;
		}
		
		aAsset.retain();
		this._loaders.push(aAsset);
		
		if(this._isLoading && !this._isAddingLoaders && (this._loadingLoaders.length < this._maxNumberOfSimiltaniousLoaders || this._maxNumberOfSimiltaniousLoaders <= 0)) {
			this._loadLoader(aAsset);
		}
		else {
			this._waitingLoaders.push(aAsset);
		}
		
		return this;
	};
	
	objectFunctions.addAssetByPath = function(aPath) {
		
		var currentAsset = dbm.singletons.dbmAssetRepository.getAsset(aPath);
		this.addAsset(currentAsset);
		
		return this;
	};
	
	objectFunctions.addAssetsByPath = function(/* ... aPaths */) {
		
		var currentArray = arguments;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this.addAssetByPath(currentArray[i]);
		}
		
		return this;
	};
	
	objectFunctions._addListenersToLoader = function(aLoader) {
		
		
		aLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._loaderLoaded, [aLoader]).setId(this._groupId));
		aLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._loaderError, [aLoader]).setId(this._groupId));
		
	};
	
	objectFunctions._loadLoader = function(aLoader) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence::_loadLoader");
		//console.log(this, aLoader);
		
		this._status = AssetStatusTypes.LOADING;
		
		if(aLoader.getStatus() === AssetStatusTypes.LOADED) {
			this._loadedLoaders.push(aLoader);
		}
		else if(aLoader.getStatus() === AssetStatusTypes.ERROR) {
			this._loadedLoaders.push(aLoader);
			if(!this._continueOnError) {
				this._isLoading = false;
				this._status = AssetStatusTypes.LOADING_ERROR;
				if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.LOADING_ERROR)) {
					this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADING_ERROR);
				}
			}
		}
		else if(aLoader.getStatus() === AssetStatusTypes.LOADING) {
			this._addListenersToLoader(aLoader);
			this._loadingLoaders.push(aLoader);
		}
		else {
			this._startLoadingLoader(aLoader);
		}
	};
	
	objectFunctions._startLoadingLoader = function(aLoader) {
		
		this._addListenersToLoader(aLoader);
		this._loadingLoaders.push(aLoader);
		aLoader.load();
	};
	
	objectFunctions._hasWaitingLoaders = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence::_hasWaitingLoaders");
		this._isAddingLoaders = true;
		if(this._waitingLoaders.length === 0) {
			if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.REQUEST_MORE_LOADERS)) {
				this.getExtendedEvent().perform(LoadingExtendedEventIds.REQUEST_MORE_LOADERS);
			}
		}
		this._isAddingLoaders = false;
		return this._waitingLoaders.length > 0;
	};
	
	objectFunctions._continueLoading = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence::_continueLoading");
		
		while(this._hasWaitingLoaders()) {
			var currentLoader = this._waitingLoaders.shift();
			this._loadLoader(currentLoader);
			var allowedToLoadMore = (this._loadingLoaders.length < this._maxNumberOfSimiltaniousLoaders || this._maxNumberOfSimiltaniousLoaders <= 0);
			if(!(this._isLoading && allowedToLoadMore)) {
				break;
			}
		}
		
		//console.log(this._loadingLoaders.length, this._waitingLoaders.length, this._status);
		if(this._loadingLoaders.length === 0 && this._waitingLoaders.length === 0 && this._status === AssetStatusTypes.LOADING) {
			this._status = AssetStatusTypes.LOADED;
			if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.LOADED)) {
				this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADED);
			}
		}
	};
	
	objectFunctions._setLoaderAsLoaded = function(aLoader) {
		
		var currentIndex = ArrayFunctions.indexOfInArray(this._loadingLoaders, aLoader);
		if(currentIndex !== -1) {
			this._loadingLoaders.splice(currentIndex, 1);
		}
		
		this._loadedLoaders.push(aLoader);
		
		aLoader.getExtendedEvent().removeCommandByIdFromEvent(LoadingExtendedEventIds.LOADED, this._groupId);
		aLoader.getExtendedEvent().removeCommandByIdFromEvent(LoadingExtendedEventIds.LOADING_ERROR, this._groupId);
		
	};
	
	objectFunctions._loaderLoaded = function(aLoader) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence::_loaderLoaded");
		
		this._setLoaderAsLoaded(aLoader);
		this._continueLoading();
	};
	
	objectFunctions._loaderError = function(aLoader) {
		
		this._setLoaderAsLoaded(aLoader);
		
		if(!this._continueOnError) {
			this._isLoading = false;
			this._status = AssetStatusTypes.LOADING_ERROR;
			if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.LOADING_ERROR)) {
				this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADING_ERROR);
			}
		}
	};
	
	objectFunctions._updateProgressFlow = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence::_updateProgressFlow");
		
		var loadedSize = 0;
		var totalLoadSize = 0;
		
		var currentArray = this._loadingLoaders;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLoader = currentArray[i];
			loadedSize += currentLoader.getLoadedSize();
			totalLoadSize += currentLoader.getTotalSize();
		}
		
		var currentArray = this._waitingLoaders;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLoader = currentArray[i];
			totalLoadSize += currentLoader.getTotalSize();
		}
		
		var currentArray = this._loadedLoaders;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLoader = currentArray[i];
			loadedSize += currentLoader.getTotalSize();
			totalLoadSize += currentLoader.getTotalSize();
		}
		
		var progress = (totalLoadSize === 0) ? 0 : loadedSize/totalLoadSize;
		//console.log(loadedSize, totalLoadSize, progress);
		
		this._loadedSize.setValueWithFlow(loadedSize, aFlowUpdateNumber);
		this._totalSize.setValueWithFlow(totalLoadSize, aFlowUpdateNumber);
		this._progress.setValueWithFlow(progress, aFlowUpdateNumber);
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case LoadingExtendedEventIds.LOADED:
			case LoadingExtendedEventIds.LOADING_ERROR:
			case LoadingExtendedEventIds.REQUEST_MORE_LOADERS:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyArrayIfExists(this._loaders);
		
		this.superCall();
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._progress = null;
		this._loaders = null;
		this._loadingLoaders = null;
		this._waitingLoaders = null;
		this._loadedLoaders = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newLoadingSequence = (new ClassReference()).init();
		return newLoadingSequence;
	};
});