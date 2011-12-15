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
	var DataManager = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.DataManager");
	
	var ErrorManagerDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.setup.ErrorManagerDefaultSetup");
	var InterpolationDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup");
	var DefaultStatisticsManagerSetup = dbm.importClass("com.developedbyme.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup");
	var DefaultBasicParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultBasicParsersSetup");
	var DefaultTextParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultTextParsersSetup");
	
	var BezierEvaluator = dbm.importClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator");
	
	dbm.addStartFunction(function() {
		
		ErrorManagerDefaultSetup.setup();
		InterpolationDefaultSetup.setup();
		
		UpdateManager.getInstance().start();
		FlowManager.getInstance().start();
		AnimationManager.getInstance().setupDefaultPlayback();
		AnimationManager.getInstance().start();
		
		BrowserDetector.getInstance().detectBrowserFromUserAgent();
		PageManager.getInstance().setDocument(document);
		PageManager.getInstance().setupQueryStringParameters();
		AssetRepository.getInstance().setRoot(PageManager.getInstance().getCurrentFolderPath());
		
		WindowManager.getInstance().setMasterWindow(dbm._window);
		
		DebugManager.getInstance().setCheckForDeletion(true);
		
		CurveEvaluator.getInstance().addEvaluator((new BezierEvaluator()).init());
		
		DefaultStatisticsManagerSetup.setup();
		
		dbm.xmlNamespaces.dbmData = "http://developedbyme.com/schemas/xml/data/";
		
		DefaultBasicParsersSetup.setup();
		DefaultTextParsersSetup.setup();
	});
	
	dbm.setupLoaderHook();
});