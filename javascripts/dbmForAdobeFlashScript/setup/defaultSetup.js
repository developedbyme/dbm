dbm.runTempFunction(function() {
	
	dbm.addSpecificClassesFolder("dbm", "dbm/classes");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var UpdateManager = dbm.importClass("dbm.core.globalobjects.updatemanager.UpdateManager");
	var FlowManager = dbm.importClass("dbm.core.globalobjects.flowmanager.FlowManager");
	
	//var WindowManager = dbm.importClass("dbm.core.globalobjects.windowmanager.WindowManager");
	//var HtmlDomManager = dbm.importClass("dbm.core.globalobjects.htmldommanager.HtmlDomManager");
	//var BrowserDetector = dbm.importClass("dbm.core.globalobjects.browserdetector.BrowserDetector");
	//var LinkManager = dbm.importClass("dbm.core.globalobjects.linkmanager.LinkManager");
	var IdManager = dbm.importClass("dbm.core.globalobjects.idmanager.IdManager");
	var AnimationManager = dbm.importClass("dbm.core.globalobjects.animationmanager.AnimationManager");
	var CurveEvaluator = dbm.importClass("dbm.core.globalobjects.curveevaluator.CurveEvaluator");
	var CurveCreator = dbm.importClass("dbm.core.globalobjects.curvecreator.CurveCreator");
	var DebugManager = dbm.importClass("dbm.core.globalobjects.debugmanager.DebugManager");
	var AssetRepository = dbm.importClass("dbm.core.globalobjects.assetrepository.AssetRepository");
	var AudioManager = dbm.importClass("dbm.core.globalobjects.audiomanager.AudioManager");
	//var PageManager = dbm.importClass("dbm.core.globalobjects.pagemanager.PageManager");
	//var StatisticsManager = dbm.importClass("dbm.core.globalobjects.statisticsmanager.StatisticsManager");
	//var TemplateManager = dbm.importClass("dbm.core.globalobjects.templatemanager.TemplateManager");
	var DataManager = dbm.importClass("dbm.core.globalobjects.datamanager.DataManager");
	var EncodingManager = dbm.importClass("dbm.core.globalobjects.encodingmanager.EncodingManager");
	var XmlObjectEncoder = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.XmlObjectEncoder");
	
	//var DefaultAssetRepositoryNodejsSetup = dbm.importClass("dbm.nodejs.core.globalobjects.assetrepository.setup.DefaultAssetRepositoryNodejsSetup");
	var ErrorManagerDefaultSetup = dbm.importClass("dbm.core.globalobjects.errormanager.setup.ErrorManagerDefaultSetup");
	var InterpolationDefaultSetup = dbm.importClass("dbm.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup");
	//var DefaultStatisticsManagerSetup = dbm.importClass("dbm.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup");
	//var DefaultBasicClassShortcutSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup");
	//var DefaultWorkspaceClassShortcutSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultWorkspaceClassShortcutSetup");
	//var DefaultTextCreatorsSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultTextCreatorsSetup");
	var DefaultBasicParsersSetup = dbm.importClass("dbm.core.globalobjects.datamanager.setup.DefaultBasicParsersSetup");
	var DefaultTextParsersSetup = dbm.importClass("dbm.core.globalobjects.datamanager.setup.DefaultTextParsersSetup");
	var DefaultComplexParsersSetup = dbm.importClass("dbm.core.globalobjects.datamanager.setup.DefaultComplexParsersSetup");
	var EncodingManagerDefaultSetup = dbm.importClass("dbm.core.globalobjects.encodingmanager.setup.EncodingManagerDefaultSetup");
	//var EncodingManagerDefaultNodejsSetup = dbm.importClass("dbm.nodejs.core.globalobjects.encodingmanager.setup.EncodingManagerDefaultNodejsSetup");
	var XmlObjectEncoderDefaultSetup = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.setup.XmlObjectEncoderDefaultSetup");
	
	var BezierEvaluator = dbm.importClass("dbm.core.globalobjects.curveevaluator.evaluators.BezierEvaluator");
	var IntervalTimer = dbm.importClass("dbm.core.globalobjects.updatemanager.timer.IntervalTimer");
	
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var GlobalVariables = dbm.importClass("dbm.core.globalobjects.GlobalVariables");
	var MersenneTwister = dbm.importClass("dbm.utils.random.MersenneTwister");
	var UuidGenerator = dbm.importClass("dbm.utils.id.UuidGenerator");
	var UuidV4IdGroup = dbm.importClass("dbm.core.globalobjects.idmanager.objects.UuidV4IdGroup");
	
	dbm.addStartFunction(function() {
		
		ArrayFunctions.concatToArray(GlobalVariables.RANDOM_VALUES, dbm.getStartupSeed());
		
		ErrorManagerDefaultSetup.setup();
		InterpolationDefaultSetup.setup();
		
		//UpdateManager.getInstance().setTimer(IntervalTimer.create(null, 60)).start();
		FlowManager.getInstance().start();
		AnimationManager.getInstance().setupDefaultPlayback();
		AnimationManager.getInstance().start();
		
		//AssetRepository.getInstance().setRoot(global.process.env.PWD); //METODO: set this
		
		DebugManager.getInstance().setCheckForDeletion(true);
		
		CurveEvaluator.getInstance().addEvaluator((new BezierEvaluator()).init());
		
		//DefaultAssetRepositoryNodejsSetup.setup();
		//DefaultStatisticsManagerSetup.setup();
		EncodingManagerDefaultSetup.setup();
		//EncodingManagerDefaultNodejsSetup.setup();
		
		//DefaultBasicClassShortcutSetup.setup();
		//DefaultWorkspaceClassShortcutSetup.setup();
		//DefaultTextCreatorsSetup.setup();
		XmlObjectEncoderDefaultSetup.setup();
		
		dbm.xmlNamespaces.dbmData = "http://developedbyme.com/schemas/xml/data/";
		dbm.xmlNamespaces.dbmTreeStructureAttribute = "http://developedbyme.com/schemas/xml/tree-structure-attribute/";
		
		DefaultBasicParsersSetup.setup();
		DefaultTextParsersSetup.setup();
		DefaultComplexParsersSetup.setup();
		
		GlobalVariables.SHARED_RANDOM_NUMBER_GENERATOR = MersenneTwister.create().initByArray(GlobalVariables.RANDOM_VALUES);
		
		var uuidGenerator = UuidGenerator.create();
		uuidGenerator.randomGenerator = GlobalVariables.SHARED_RANDOM_NUMBER_GENERATOR;
		IdManager.getInstance().setIdGroup("uuid", UuidV4IdGroup.create(uuidGenerator));
	});
});