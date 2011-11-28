dbm.registerClass("com.developedbyme.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker");
	
	var GoogleAnalyticsTracker = dbm.importClass("com.developedbyme.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker::init");
		
		this.superCall();
		
		this.id = "ga";
		
		return this;
	};
	
	objectFunctions.trackPage = function(aPage) {
		console.log("com.developedbyme.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker::trackPage");
		console.log(aPage);
		
		_gaq.push(['_trackPageview', aPage]);
		
	};
	
	objectFunctions.trackEvent = function(aCategory, aAction, aLabel, aValue) {
		console.log("com.developedbyme.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker::trackEvent");
		console.log(aCategory, aAction, aLabel, aValue);
		
		if(aLabel != null) {
			if(aValue != null) {
				_gaq.push(['_trackEvent', aCategory, aAction, aLabel, aValue]);
			}
			else {
				_gaq.push(['_trackEvent', aCategory, aAction, aLabel]);
			}
		}
		else {
			_gaq.push(['_trackEvent', aCategory, aAction]);
		}
		
	};
	
	staticFunctions.create = function() {
		var newTracker = (new ClassReference()).init();
		
		return newTracker;
	}
});