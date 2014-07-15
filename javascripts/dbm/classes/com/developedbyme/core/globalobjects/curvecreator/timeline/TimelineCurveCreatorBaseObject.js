/**
 * Base object for timeline curve creators.
 *
 * @authur	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.curvecreator.timeline.TimelineCurveCreatorBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curvecreator.timeline.TimelineCurveCreatorBaseObject");
	//"use strict";
	
	//Self reference
	var TimelineCurveCreatorBaseObject = dbm.importClass("com.developedbyme.core.globalobjects.curvecreator.timeline.TimelineCurveCreatorBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utilities
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.curvecreator.timeline.TimelineCurveCreatorBaseObject");
		
		this.superCall();
		
		return this;
	};
	
	/**
	 * Creates a curve from a timeline part.
	 */
	objectFunctions.createCurveFromPart = function(aTimelinePart, aStartTime, aEndTime, aDefaultNumberOfSteps, aXOffset, aReturnCurve, aPositionOnCurve) {
		//MENOTE: should be overridden
		
		return aPositionOnCurve;
	};
	
	staticFunctions.create = function() {
		var newTimelineCurveCreatorBaseObject = (new ClassReference()).init();
		return newTimelineCurveCreatorBaseObject;
	};
});