dbm.runTempFunction(function() {
	
	dbm.addSpecificClassesFolder("dbm", "dbm/classes");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var UpdateManager = dbm.importClass("dbm.core.globalobjects.updatemanager.UpdateManager");
	var FlowManager = dbm.importClass("dbm.core.globalobjects.flowmanager.FlowManager");
	
	var WindowManager = dbm.importClass("dbm.core.globalobjects.windowmanager.WindowManager");
	var HtmlDomManager = dbm.importClass("dbm.core.globalobjects.htmldommanager.HtmlDomManager");
	var BrowserDetector = dbm.importClass("dbm.core.globalobjects.browserdetector.BrowserDetector");
	var LinkManager = dbm.importClass("dbm.core.globalobjects.linkmanager.LinkManager");
	var IdManager = dbm.importClass("dbm.core.globalobjects.idmanager.IdManager");
	var AnimationManager = dbm.importClass("dbm.core.globalobjects.animationmanager.AnimationManager");
	var CurveEvaluator = dbm.importClass("dbm.core.globalobjects.curveevaluator.CurveEvaluator");
	var CurveCreator = dbm.importClass("dbm.core.globalobjects.curvecreator.CurveCreator");
	var DebugManager = dbm.importClass("dbm.core.globalobjects.debugmanager.DebugManager");
	var AssetRepository = dbm.importClass("dbm.core.globalobjects.assetrepository.AssetRepository");
	var AudioManager = dbm.importClass("dbm.core.globalobjects.audiomanager.AudioManager");
	var PageManager = dbm.importClass("dbm.core.globalobjects.pagemanager.PageManager");
	var StatisticsManager = dbm.importClass("dbm.core.globalobjects.statisticsmanager.StatisticsManager");
	var TemplateManager = dbm.importClass("dbm.core.globalobjects.templatemanager.TemplateManager");
	var DataManager = dbm.importClass("dbm.core.globalobjects.datamanager.DataManager");
	var PerformanceManager = dbm.importClass("dbm.core.globalobjects.performancemanager.PerformanceManager");
	var EncodingManager = dbm.importClass("dbm.core.globalobjects.encodingmanager.EncodingManager");
	var ObjectPoolManager = dbm.importClass("dbm.core.globalobjects.objectpoolmanager.ObjectPoolManager");
	var XmlObjectEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder");
	
	var ErrorManagerDefaultSetup = dbm.importClass("dbm.core.globalobjects.errormanager.setup.ErrorManagerDefaultSetup");
	var InterpolationDefaultSetup = dbm.importClass("dbm.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup");
	var UpdateManagerDefaultSetup = dbm.importClass("dbm.core.globalobjects.updatemanager.setup.UpdateManagerDefaultSetup");
	var DefaultStatisticsManagerSetup = dbm.importClass("dbm.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup");
	var DefaultBasicClassShortcutSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup");
	var DefaultDevelopmentClassShortcutSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultDevelopmentClassShortcutSetup");
	var DefaultWorkspaceClassShortcutSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup");
	var DefaultTemplateCommandsSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup");
	var DefaultTextCreatorsSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup");
	var DefaultBasicParsersSetup = dbm.importClass("dbm.core.globalobjects.datamanager.setup.DefaultBasicParsersSetup");
	var DefaultTextParsersSetup = dbm.importClass("dbm.core.globalobjects.datamanager.setup.DefaultTextParsersSetup");
	var DefaultComplexParsersSetup = dbm.importClass("dbm.core.globalobjects.datamanager.setup.DefaultComplexParsersSetup");
	var DefaultDataManagerClassShortcutSetup = dbm.importClass("dbm.core.globalobjects.datamanager.setup.DefaultDataManagerClassShortcutSetup");
	var EncodingManagerDefaultSetup = dbm.importClass("dbm.core.globalobjects.encodingmanager.setup.EncodingManagerDefaultSetup");
	var DefaultAssetRepositoryBrowserSetup = dbm.importClass("dbm.core.globalobjects.assetrepository.setup.DefaultAssetRepositoryBrowserSetup");
	var XmlObjectEncoderDefaultSetup = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.setup.XmlObjectEncoderDefaultSetup");
	var CurveCreatorDefaultSetup = dbm.importClass("dbm.core.globalobjects.curvecreator.setup.CurveCreatorDefaultSetup");
	var ObjectPoolManagerDefaultSetup = dbm.importClass("dbm.core.globalobjects.objectpoolmanager.setup.ObjectPoolManagerDefaultSetup");
	
	var BezierEvaluator = dbm.importClass("dbm.core.globalobjects.curveevaluator.evaluators.BezierEvaluator");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var GlobalVariables = dbm.importClass("dbm.core.globalobjects.GlobalVariables");
	var MersenneTwister = dbm.importClass("dbm.utils.random.MersenneTwister");
	var UuidGenerator = dbm.importClass("dbm.utils.id.UuidGenerator");
	var UuidV4IdGroup = dbm.importClass("dbm.core.globalobjects.idmanager.objects.UuidV4IdGroup");
	
	dbm.addStartFunction(function() {
		
		ArrayFunctions.concatToArray(GlobalVariables.RANDOM_VALUES, dbm.getStartupSeed());
		
		ErrorManagerDefaultSetup.setup();
		InterpolationDefaultSetup.setup();
		
		UpdateManagerDefaultSetup.setup();
		UpdateManager.getInstance().start();
		
		FlowManager.getInstance().start();
		AnimationManager.getInstance().setupDefaultPlayback();
		AnimationManager.getInstance().start();
		
		BrowserDetector.getInstance().detectBrowserFromUserAgent();
		BrowserDetector.getInstance().addToSharedRandomValues(GlobalVariables.RANDOM_VALUES);
		PageManager.getInstance().setDocument(dbm.getDocument());
		PageManager.getInstance().setupQueryStringParameters();
		PageManager.getInstance().addToSharedRandomValues(GlobalVariables.RANDOM_VALUES);
		AssetRepository.getInstance().setupDefaultExtensions();
		AssetRepository.getInstance().setRoot(PageManager.getInstance().getCurrentFolderPath());
		
		WindowManager.getInstance().setMasterWindow(dbm.getWindow());
		WindowManager.getInstance().addToSharedRandomValues(GlobalVariables.RANDOM_VALUES);
		PerformanceManager.getInstance().addToSharedRandomValues(GlobalVariables.RANDOM_VALUES);
		
		DebugManager.getInstance().setCheckForDeletion(true);
		
		CurveEvaluator.getInstance().addEvaluator((new BezierEvaluator()).init());
		
		DefaultAssetRepositoryBrowserSetup.setup();
		DefaultStatisticsManagerSetup.setup();
		EncodingManagerDefaultSetup.setup();
		
		DefaultBasicClassShortcutSetup.setup();
		DefaultDevelopmentClassShortcutSetup.setup();
		DefaultWorkspaceClassShortcutSetup.setup();
		DefaultTextCreatorsSetup.setup();
		DefaultTemplateCommandsSetup.setup();
		XmlObjectEncoderDefaultSetup.setup();
		CurveCreatorDefaultSetup.setup();
		ObjectPoolManagerDefaultSetup.setup();
		
		dbm.xmlNamespaces.dbmData = "http://developedbyme.com/schemas/xml/data/";
		dbm.xmlNamespaces.dbmTreeStructureAttribute = "http://developedbyme.com/schemas/xml/tree-structure-attribute/";
		
		DefaultBasicParsersSetup.setup();
		DefaultTextParsersSetup.setup();
		DefaultComplexParsersSetup.setup();
		DefaultDataManagerClassShortcutSetup.setup();
		
		dbm.singletons.dbmAssetRepository.linkFolderToServer("remotes/localhost", "http://localhost");
		dbm.singletons.dbmAssetRepository.linkFolderToServer("remotes/dbm", "http://www.developedbyme.com");
		
		GlobalVariables.SHARED_RANDOM_NUMBER_GENERATOR = MersenneTwister.create().initByArray(GlobalVariables.RANDOM_VALUES);
		
		var uuidGenerator = UuidGenerator.create();
		uuidGenerator.randomGenerator = GlobalVariables.SHARED_RANDOM_NUMBER_GENERATOR;
		IdManager.getInstance().setIdGroup("uuid", UuidV4IdGroup.create(uuidGenerator));
		
	});
});