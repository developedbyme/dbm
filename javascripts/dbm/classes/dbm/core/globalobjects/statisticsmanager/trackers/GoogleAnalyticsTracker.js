/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker");
	
	var GoogleAnalyticsTracker = dbm.importClass("dbm.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker::_init");
		
		this.superCall();
		
		this.id = "ga";
		
		this._trackPageviewName = "_trackPageview";
		this._trackEventName = "_trackEvent";
		
		return this;
	};
	
	objectFunctions.setTrackNamesPrefix = function(aPrefix) {
		//console.log("dbm.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker::setTrackNamesPrefix");
		
		this._trackPageviewName = aPrefix + "._trackPageview";
		this._trackEventName = aPrefix + "._trackEvent";
		
		return this;
	};
	
	objectFunctions.trackPage = function(aPage) {
		//console.log("dbm.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker::trackPage");
		console.log(aPage);
		
		_gaq.push([this._trackPageviewName, aPage]);
		
	};
	
	objectFunctions.trackEvent = function(aCategory, aAction, aLabel, aValue) {
		//console.log("dbm.core.globalobjects.statisticsmanager.trackers.GoogleAnalyticsTracker::trackEvent");
		//console.log(aCategory, aAction, aLabel, aValue);
		
		if(aLabel !== null) {
			if(aValue !== null) {
				_gaq.push([this._trackEventName, aCategory, aAction, aLabel, aValue]);
			}
			else {
				_gaq.push([this._trackEventName, aCategory, aAction, aLabel]);
			}
		}
		else {
			_gaq.push([this._trackEventName, aCategory, aAction]);
		}
		
	};
	
	staticFunctions.create = function() {
		var newTracker = (new ClassReference()).init();
		
		return newTracker;
	};
	
	staticFunctions.createWithPrefix = function(aPrefix) {
		var newTracker = (new ClassReference()).init();
		newTracker.setTrackNamesPrefix(aPrefix);
		return newTracker;
	};
});