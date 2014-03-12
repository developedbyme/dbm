dbm.runTempFunction(function() {
	
	dbm.addSpecificClassesFolder("com.developedbyme", "dbm/classes");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var UpdateManager = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.UpdateManager");
	var FlowManager = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.FlowManager");
	
	var WindowManager = dbm.importClass("com.developedbyme.core.globalobjects.windowmanager.WindowManager");
	//var HtmlDomManager = dbm.importClass("com.developedbyme.core.globalobjects.htmldommanager.HtmlDomManager");
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
	
	var ErrorManagerDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.setup.ErrorManagerDefaultSetup");
	var InterpolationDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup");
	var DefaultStatisticsManagerSetup = dbm.importClass("com.developedbyme.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup");
	var DefaultBasicClassShortcutSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup");
	var DefaultWorkspaceClassShortcutSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup");
	var DefaultTextCreatorsSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup");
	var DefaultBasicParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultBasicParsersSetup");
	var DefaultTextParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultTextParsersSetup");
	var DefaultComplexParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultComplexParsersSetup");
	
	var BezierEvaluator = dbm.importClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator");
	var IntervalTimer = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.timer.IntervalTimer");
	
	dbm.addStartFunction(function() {
		
		ErrorManagerDefaultSetup.setup();
		InterpolationDefaultSetup.setup();
		
		UpdateManager.getInstance().setTimer(IntervalTimer.create(null, 60)).start();
		FlowManager.getInstance().start();
		AnimationManager.getInstance().setupDefaultPlayback();
		AnimationManager.getInstance().start();
		
		AssetRepository.getInstance().setRoot(global.process.env.PWD);
		
		DebugManager.getInstance().setCheckForDeletion(true);
		
		CurveEvaluator.getInstance().addEvaluator((new BezierEvaluator()).init());
		
		DefaultStatisticsManagerSetup.setup();
		
		DefaultBasicClassShortcutSetup.setup();
		DefaultWorkspaceClassShortcutSetup.setup();
		DefaultTextCreatorsSetup.setup();
		
		dbm.xmlNamespaces.dbmData = "http://developedbyme.com/schemas/xml/data/";
		dbm.xmlNamespaces.dbmTreeStructureAttribute = "http://developedbyme.com/schemas/xml/tree-structure-attribute/";
		
		DefaultBasicParsersSetup.setup();
		DefaultTextParsersSetup.setup();
		DefaultComplexParsersSetup.setup();
		
	});
});