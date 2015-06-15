/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup");
	
	//Self reference
	var DefaultStatisticsManagerSetup = dbm.importClass("dbm.core.globalobjects.statisticsmanager.setup.DefaultStatisticsManagerSetup");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var GoogleAnalyticsTracker = dbm.importClass("dbm.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker");
	
	//Utils
	
	//Constants
	
	/**
	 * Sets up the analytics manager.
	 */
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmStatisticsManager.addTracker(GoogleAnalyticsTracker.create());
		
	};
});