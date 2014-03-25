/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.performancemanager.PerformanceManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.performancemanager.PerformanceManager");
	
	var PerformanceManager = dbm.importClass("com.developedbyme.core.globalobjects.performancemanager.PerformanceManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	dbm.setClassAsSingleton("dbmPerformanceManager");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.performancemanager.PerformanceManager::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.addToSharedRandomValues = function(aValuesArray) {
		console.log("com.developedbyme.core.globalobjects.performancemanager.PerformanceManager::addToSharedRandomValues");
		
		var perfomanceData = dbm.getWindow().performance;
		
		if(perfomanceData) {
			var timingsData = perfomanceData.timing;
			
			aValuesArray.push(timingsData.navigationStart);
			aValuesArray.push(timingsData.unloadEventStart);
			aValuesArray.push(timingsData.unloadEventEnd);
			aValuesArray.push(timingsData.redirectStart);
			aValuesArray.push(timingsData.redirectEnd);
			aValuesArray.push(timingsData.fetchStart);
			aValuesArray.push(timingsData.domainLookupStart);
			aValuesArray.push(timingsData.domainLookupEnd);
			aValuesArray.push(timingsData.connectStart);
			aValuesArray.push(timingsData.connectEnd);
			aValuesArray.push(timingsData.secureConnectionStart);
			aValuesArray.push(timingsData.requestStart);
			aValuesArray.push(timingsData.responseStart);
			aValuesArray.push(timingsData.responseEnd);
			aValuesArray.push(timingsData.domLoading);
			aValuesArray.push(timingsData.domInteractive);
			aValuesArray.push(timingsData.domContentLoadedEventStart);
			aValuesArray.push(timingsData.domContentLoadedEventEnd);
			aValuesArray.push(timingsData.domComplete);
			aValuesArray.push(timingsData.loadEventStart);
			aValuesArray.push(timingsData.loadEventEnd);
			
			var currentTime = perfomanceData.now();
			var flooredValue = Math.floor(currentTime);
			
			aValuesArray.push(flooredValue);
			aValuesArray.push(Math.floor((currentTime-flooredValue)*Math.pow(10, 12)));
		}
		
		return this;
	};
	
});