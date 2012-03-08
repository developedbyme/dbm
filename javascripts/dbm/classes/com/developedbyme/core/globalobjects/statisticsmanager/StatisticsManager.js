dbm.registerClass("com.developedbyme.core.globalobjects.statisticsmanager.StatisticsManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.statisticsmanager.StatisticsManager");
	
	var StatisticsManager = dbm.importClass("com.developedbyme.core.globalobjects.statisticsmanager.StatisticsManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	dbm.setClassAsSingleton("dbmStatisticsManager");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.statisticsmanager.StatisticsManager::_init");
		
		this.superCall();
		
		this._trackers = new Array();
		
		return this;
	};
	
	objectFunctions.addTracker = function(aTracker) {
		//console.log("com.developedbyme.core.globalobjects.statisticsmanager.StatisticsManager::addTracker");
		
		this._trackers.push(aTracker);
		
	};
	
	objectFunctions.trackPage = function(aPage) {
		//console.log("com.developedbyme.core.globalobjects.statisticsmanager.StatisticsManager::trackPage");
		
		var currentArray = this._trackers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTracker = currentArray[i];
			currentTracker.trackPage(aPage);
		}
		
	};
	
	objectFunctions.trackEvent = function(aCategory, aAction, aLabel, aValue) {
		//console.log("com.developedbyme.core.globalobjects.statisticsmanager.StatisticsManager::trackEvent");
		
		var currentArray = this._trackers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTracker = currentArray[i];
			currentTracker.trackEvent(aCategory, aAction, aLabel, aValue);
		}
	};
});