/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.statisticsmanager.StatisticsManager", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.statisticsmanager.StatisticsManager");
	
	var StatisticsManager = dbm.importClass("dbm.core.globalobjects.statisticsmanager.StatisticsManager");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.statisticsmanager.StatisticsManager::_init");
		
		this.superCall();
		
		this._trackers = new Array();
		
		return this;
	};
	
	objectFunctions.addTracker = function(aTracker) {
		//console.log("dbm.core.globalobjects.statisticsmanager.StatisticsManager::addTracker");
		
		this._trackers.push(aTracker);
		
	};
	
	objectFunctions.trackPage = function(aPage) {
		//console.log("dbm.core.globalobjects.statisticsmanager.StatisticsManager::trackPage");
		
		var currentArray = this._trackers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTracker = currentArray[i];
			currentTracker.trackPage(aPage);
		}
		
	};
	
	objectFunctions.trackEvent = function(aCategory, aAction, aLabel, aValue) {
		//console.log("dbm.core.globalobjects.statisticsmanager.StatisticsManager::trackEvent");
		
		var currentArray = this._trackers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTracker = currentArray[i];
			currentTracker.trackEvent(aCategory, aAction, aLabel, aValue);
		}
	};
});