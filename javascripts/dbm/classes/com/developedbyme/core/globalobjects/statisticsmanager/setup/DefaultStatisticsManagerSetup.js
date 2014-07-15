/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup");
	
	//Self reference
	var DefaultStatisticsManagerSetup = dbm.importClass("com.developedbyme.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var GoogleAnalyticsTracker = dbm.importClass("com.developedbyme.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker");
	
	//Utils
	
	//Constants
	
	/**
	 * Sets up the analytics manager.
	 */
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmStatisticsManager.addTracker(GoogleAnalyticsTracker.create());
		
	};
});