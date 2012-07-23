dbm.registerClass("com.developedbyme.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup");
	
	var DefaultStatisticsManagerSetup = dbm.importClass("com.developedbyme.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var GoogleAnalyticsTracker = dbm.importClass("com.developedbyme.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker");
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmStatisticsManager.addTracker(GoogleAnalyticsTracker.create());
		
	};
});