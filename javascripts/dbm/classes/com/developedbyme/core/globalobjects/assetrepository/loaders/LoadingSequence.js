dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	var LoadingSequence = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	staticFunctions.DEFAULT_MAX_NUMBER_OF_SIMILTANIOUS_LOADERS = 5;
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence::init");
		
		this.superCall();
		
		this._groupId = dbm.singletons.dbmIdManager.getNewId("loadingSequence");
		
		this._time = this._createProperty("time", dbm.singletons.dbmAnimationManager.getGlobalTimeNode().getProperty("time"));
		this._progress = this._createProperty("progress", 0);
		this._maxNumberOfSimiltaniousLoaders = ClassReference.DEFAULT_MAX_NUMBER_OF_SIMILTANIOUS_LOADERS;
		this._loaders = new Array();
		this._loadingLoaders = new Array();
		this._waitingLoaders = new Array();
		this._loadedLoaders = new Array();
		
		this._continueOnError = true;
		this._status = AssetStatusTypes.NOT_LOADED;
		this._isLoading = false;
		
		this.createUpdateFunction("progress", this._updateProgressFlow, [this._time], [this._progress]);
		
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
	
	objectFunctions.load = function() {
		
		if(this._isLoading) return;
		
		this._isLoading = true;
		this._status = AssetStatusTypes.LOADING;
		this._continueLoading();
		
		return this;
	};
	
	objectFunctions.addAsset = function(aAsset) {
		
		if(ArrayFunctions.indexOfInArray(this._loaders, aAsset) != -1) {
			return this;
		}
		
		aAsset.retain();
		this._loaders.push(aAsset);
		
		if(this._isLoading && (this._loadingLoaders.length < this._maxNumberOfSimiltaniousLoaders || this._maxNumberOfSimiltaniousLoaders <= 0)) {
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
		
		this._status = AssetStatusTypes.LOADING;
		
		if(aAsset.getStatus() == AssetStatusTypes.LOADED) {
			this._loadedLoaders.push(aAsset);
		}
		else if(aAsset.getStatus() == AssetStatusTypes.ERROR) {
			this._loadedLoaders.push(aAsset);
			if(!this._continueOnError) {
				this._isLoading = false;
				this._status = AssetStatusTypes.LOADING_ERROR;
				if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.LOADING_ERROR)) {
					this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADING_ERROR)
				}
			}
		}
		else if(aAsset.getStatus() == AssetStatusTypes.LOADING) {
			this._addListenersToLoader(aAsset);
			this._loadingLoaders.push(aAsset);
		}
		else {
			this._startLoadingLoader(aAsset);
		}
	};
	
	objectFunctions._startLoadingLoader = function(aLoader) {
		
		this._addListenersToLoader(aLoader);
		aLoader.load();
	};
	
	objectFunctions._continueLoading = function() {
		
		while(this._waitingLoaders.length > 0) {
			var currentLoader = this._waitingLoaders.shift();
			this._loadLoader(currentLoader);
			if(!(this._isLoading && (this._loadingLoaders.length < this._maxNumberOfSimiltaniousLoaders || this._maxNumberOfSimiltaniousLoaders <= 0))) {
				break;
			}
		}
		
		if(this._loadingLoaders.length == 0 && this._waitingLoaders == 0) {
			this._status = AssetStatusTypes.LOADED;
			if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.LOADED)) {
				this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADED)
			}
		}
	};
	
	objectFunctions._setLoaderAsLoaded = function(aLoader) {
		
		var currentIndex = ArrayFunctions.indexOfInArray(this._loadingLoaders);
		if(currentIndex != -1) {
			this._loadingLoaders.splice(currentIndex, 1);
		}
		
		this._loadedLoaders.push(aLoader);
		
		aLoader.getExtendedEvent().removeCommandFromEventById(LoadingExtendedEventIds.LOADED, this._groupId);
		aLoader.getExtendedEvent().removeCommandFromEventById(LoadingExtendedEventIds.LOADING_ERROR, this._groupId);
		
	};
	
	objectFunctions._loaderLoader = function(aLoader) {
		
		this._setLoaderAsLoaded(aLoader);
		this._continueLoading();
	};
	
	objectFunctions._loaderError = function(aLoader) {
		
		this._setLoaderAsLoaded(aLoader);
		
		if(!this._continueOnError) {
			this._isLoading = false;
			this._status = AssetStatusTypes.LOADING_ERROR;
			if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.LOADING_ERROR)) {
				this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADING_ERROR)
			}
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case LoadingExtendedEventIds.LOADED:
			case LoadingExtendedEventIds.LOADING_ERROR:
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