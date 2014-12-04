/**
 * Base object for timeline curve creators.
 *
 * @authur	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.curvecreator.timeline.TimelineCurveCreatorBaseObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.curvecreator.timeline.TimelineCurveCreatorBaseObject");
	//"use strict";
	
	//Self reference
	var TimelineCurveCreatorBaseObject = dbm.importClass("dbm.core.globalobjects.curvecreator.timeline.TimelineCurveCreatorBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utilities
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.curvecreator.timeline.TimelineCurveCreatorBaseObject");
		
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