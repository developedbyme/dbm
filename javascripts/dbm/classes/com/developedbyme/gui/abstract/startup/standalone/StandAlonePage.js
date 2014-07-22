/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var StandAlonePage = dbm.importClass("com.developedbyme.gui.abstract.startup.standalone.StandAlonePage");
	
	//Error report
	
	//Dependencies
	var LoadingSequence = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.abstract.startup.standalone.StandAlonePage::_init");
		
		this.superCall();
		
		var theDocument = dbm.getDocument();
		this._contentHolder = null;
		if(theDocument !== null) {
			this._contentHolder = theDocument.body;
		}
		this._assetsLoader = LoadingSequence.create();
		
		return this;
	};
	
	objectFunctions._addLayoutTemplate = function(aTemplatePath) {
		//console.log("com.developedbyme.gui.abstract.startup.standalone.StandAlonePage::_addLayoutTemplate");
		
		this._assetsLoader.addAssetByPath(aTemplatePath);
		this._assetsLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._applyLayoutTemplate, [aTemplatePath]));
	};
	
	objectFunctions._applyLayoutTemplate = function(aTemplatePath) {
		//console.log("com.developedbyme.gui.abstract.startup.standalone.StandAlonePage::_applyLayoutTemplate");
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(aTemplatePath, null, true, this._contentHolder, true);
		
		this._contentHolder = templateResult.rootElement.querySelectorAll("*[name=contentHolder]")[0];
	};
	
	objectFunctions._addStartFunction = function(aFunction, aArgumentsArray) {
		this._assetsLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, aFunction, aArgumentsArray));
	};
	
	objectFunctions.addCssLink = function(aPath) {
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		var newCss = htmlCreator.createNode("link", {"rel": "stylesheet", "type": "text/css", "href": aPath});
		dbm.getDocument().head.appendChild(newCss);
	};
	
	objectFunctions.start = function() {
		
		this._assetsLoader.load();
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._assetsLoader = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new StandAlonePage()).init();
	};
});