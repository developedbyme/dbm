dbm.runTempFunction(function() {
	
	dbm.addSpecificClassesFolder("com.developedbyme", "dbm/classes");
	
	//dbm.addLibrary("sizzle", "libraries/sizzle/sizzle.js", "Sizzle");
	//dbm.addLibrary("easel", "libraries/easel/easel.js", "window");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var UpdateManager = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.UpdateManager");
	var FlowManager = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.FlowManager");
	
	var WindowManager = dbm.importClass("com.developedbyme.core.globalobjects.windowmanager.WindowManager");
	var HtmlDomManager = dbm.importClass("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager");
	var BrowserDetector = dbm.importClass("com.developedbyme.core.globalobjects.browserdetector.BrowserDetector");
	var LinkManager = dbm.importClass("com.developedbyme.core.globalobjects.linkmanager.LinkManager");
	var IdManager = dbm.importClass("com.developedbyme.core.globalobjects.idmanager.IdManager");
	var AnimationManager = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.AnimationManager");
	var CurveEvaluator = dbm.importClass("com.developedbyme.core.globalobjects.curveevaluator.CurveEvaluator");
	var CurveCreator = dbm.importClass("com.developedbyme.core.globalobjects.curvecreator.CurveCreator");
	var DebugManager = dbm.importClass("com.developedbyme.core.globalobjects.debugmanager.DebugManager");
	var AssetRepository = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.AssetRepository");
	var AudioManager = dbm.importClass("com.developedbyme.core.globalobjects.audiomanager.AudioManager");
	var PageManager = dbm.importClass("com.developedbyme.core.globalobjects.pagemanager.PageManager");
	var StatisticsManager = dbm.importClass("com.developedbyme.core.globalobjects.statisticsmanager.StatisticsManager");
	var TemplateManager = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.TemplateManager");
	var DataManager = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.DataManager");
	var PerformanceManager = dbm.importClass("com.developedbyme.core.globalobjects.performancemanager.PerformanceManager");
	var EncodingManager = dbm.importClass("com.developedbyme.core.globalobjects.encodingmanager.EncodingManager");
	
	var ErrorManagerDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.setup.ErrorManagerDefaultSetup");
	var InterpolationDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup");
	var UpdateManagerDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.setup.UpdateManagerDefaultSetup");
	var DefaultStatisticsManagerSetup = dbm.importClass("com.developedbyme.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup");
	var DefaultBasicClassShortcutSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup");
	var DefaultWorkspaceClassShortcutSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup");
	var DefaultTemplateCommandsSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTemplateCommandsSetup");
	var DefaultTextCreatorsSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup");
	var DefaultBasicParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultBasicParsersSetup");
	var DefaultTextParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultTextParsersSetup");
	var DefaultComplexParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultComplexParsersSetup");
	var EncodingManagerDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.encodingmanager.setup.EncodingManagerDefaultSetup");
	
	var BezierEvaluator = dbm.importClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var GlobalVariables = dbm.importClass("com.developedbyme.core.globalobjects.GlobalVariables");
	var MersenneTwister = dbm.importClass("com.developedbyme.utils.random.MersenneTwister");
	var UuidGenerator = dbm.importClass("com.developedbyme.utils.id.UuidGenerator");
	var UuidV4IdGroup = dbm.importClass("com.developedbyme.core.globalobjects.idmanager.objects.UuidV4IdGroup");
	
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
		
		DefaultStatisticsManagerSetup.setup();
		EncodingManagerDefaultSetup.setup();
		
		DefaultBasicClassShortcutSetup.setup();
		DefaultWorkspaceClassShortcutSetup.setup();
		DefaultTextCreatorsSetup.setup();
		DefaultTemplateCommandsSetup.setup();
		
		dbm.xmlNamespaces.dbmData = "http://developedbyme.com/schemas/xml/data/";
		dbm.xmlNamespaces.dbmTreeStructureAttribute = "http://developedbyme.com/schemas/xml/tree-structure-attribute/";
		
		DefaultBasicParsersSetup.setup();
		DefaultTextParsersSetup.setup();
		DefaultComplexParsersSetup.setup();
		
		dbm.singletons.dbmAssetRepository.linkFolderToServer("remotes/localhost", "http://localhost");
		dbm.singletons.dbmAssetRepository.linkFolderToServer("remotes/dbm", "http://www.developedbyme.com");
		
		GlobalVariables.SHARED_RANDOM_NUMBER_GENERATOR = MersenneTwister.create().initByArray(GlobalVariables.RANDOM_VALUES);
		
		var uuidGenerator = UuidGenerator.create();
		uuidGenerator.randomGenerator = GlobalVariables.SHARED_RANDOM_NUMBER_GENERATOR;
		IdManager.getInstance().setIdGroup("uuid", UuidV4IdGroup.create(uuidGenerator));
		
	});
});