/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.startup.standalone.StandAlonePage", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var StandAlonePage = dbm.importClass("dbm.gui.abstract.startup.standalone.StandAlonePage");
	
	//Error report
	
	//Dependencies
	var LoadingSequence = dbm.importClass("dbm.core.globalobjects.assetrepository.loaders.LoadingSequence");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.startup.standalone.StandAlonePage::_init");
		
		this.superCall();
		
		var theDocument = dbm.getDocument();
		this._contentHolder = null;
		if(theDocument !== null) {
			this._contentHolder = theDocument.body;
		}
		this._assetsLoader = LoadingSequence.create();
		this._templatePaths = this.addDestroyableObject(NamedArray.create(true));
		
		return this;
	};
	
	objectFunctions._addLayoutTemplate = function(aTemplatePath) {
		//console.log("dbm.gui.abstract.startup.standalone.StandAlonePage::_addLayoutTemplate");
		
		this._assetsLoader.addAssetByPath(aTemplatePath);
		this._assetsLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._applyLayoutTemplate, [aTemplatePath]));
	};
	
	objectFunctions._applyLayoutTemplate = function(aTemplatePath) {
		//console.log("dbm.gui.abstract.startup.standalone.StandAlonePage::_applyLayoutTemplate");
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(aTemplatePath, null, true, this._contentHolder, true);
		
		var newContentHolder = templateResult.rootElement.querySelectorAll("*[name=contentHolder]")[0];
		if(newContentHolder) {
			this._contentHolder = newContentHolder;
		}
		
	};
	
	objectFunctions._addTemplate = function(aId, aPath) {
		this._templatePaths.addObject(aId, aPath);
		this._assetsLoader.addAssetByPath(aPath);
	};
	
	objectFunctions._createControllerFromTemplate = function(aId, aHolder, aAddToParent) {
		
		aHolder = VariableAliases.valueWithDefault(aHolder, this._contentHolder);
		aAddToParent = VariableAliases.valueWithDefault(aAddToParent, true);
		
		return dbm.singletons.dbmTemplateManager.createControllersForAsset(this._templatePaths.getObject(aId), {}, true, aHolder, aAddToParent);
	}
	
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