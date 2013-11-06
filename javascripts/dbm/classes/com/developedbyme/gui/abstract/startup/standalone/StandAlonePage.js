dbm.registerClass("com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	var StandAlonePage = dbm.importClass("com.developedbyme.gui.abstract.startup.standalone.StandAlonePage");
	
	var LoadingSequence = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	objectFunctions._init = function() {
		console.log("com.developedbyme.gui.abstract.startup.standalone.StandAlonePage::_init");
		
		this.superCall();
		
		this._assetsLoader = LoadingSequence.create();
		
		return this;
	};
	
	objectFunctions._setup = function() {
		//MENOTE: should be overridden
	};
	
	objectFunctions.addCssLink = function(aPath) {
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		var newCss = htmlCreator.createNode("link", {"rel": "stylesheet", "type": "text/css", "href": aPath});
		dbm.getDocument().head.appendChild(newCss);
	};
	
	objectFunctions.start = function() {
		this._setup();
		this._performStart();
		
		return this;
	};
	
	objectFunctions._performStart = function() {
		console.log("com.developedbyme.gui.abstract.startup.standalone.StandAlonePage::_performStart");
		
		this._assetsLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._assetsLoaded, []));
		this._assetsLoader.load();
		
		return this;
	};
	
	objectFunctions._assetsLoaded = function() {
		//MENOTE: should be overridden
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._assetsLoader = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new StandAlonePage()).init();
	};
});