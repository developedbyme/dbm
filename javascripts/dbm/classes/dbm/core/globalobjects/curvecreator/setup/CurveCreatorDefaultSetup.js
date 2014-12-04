/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Default setup for the global curve creator.
 */
dbm.registerClass("dbm.core.globalobjects.curvecreator.setup.CurveCreatorDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.curvecreator.setup.CurveCreatorDefaultSetup");
	//"use strict";
	
	//Self reference
	var CurveCreatorDefaultSetup = dbm.importClass("dbm.core.globalobjects.curvecreator.setup.CurveCreatorDefaultSetup");
	
	//Error report
	
	//Dependencies
	var CurveCreator = dbm.importClass("dbm.core.globalobjects.curvecreator.CurveCreator");
	var LinearInterpolationTimelineCurveCreator = dbm.importClass("dbm.core.globalobjects.curvecreator.timeline.LinearInterpolationTimelineCurveCreator");
	var InterpolationTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart");
	var TangentRoundedTimelineCurveCreator = dbm.importClass("dbm.core.globalobjects.curvecreator.timeline.TangentRoundedTimelineCurveCreator");
	
	//Utils
	var AndObject = dbm.importClass("dbm.utils.reevaluation.logicreevaluation.AndObject");
	var InstanceOfClassObject = dbm.importClass("dbm.utils.reevaluation.logicreevaluation.InstanceOfClassObject");
	var SelectBaseObjectObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	var CallFunctionObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ConditionObject = dbm.importClass("dbm.utils.reevaluation.logicreevaluation.ConditionObject");
	var ConditionAnyOfMultipleValuesObject = dbm.importClass("dbm.utils.reevaluation.logicreevaluation.ConditionAnyOfMultipleValuesObject");
	
	//Constants
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
	/**
	 * Sets up the default timeline curve creators.
	 */
	staticFunctions.setup = function() {
		
		var isInterpolationTimelinePartCommand = InstanceOfClassObject.createCommand(
			SelectBaseObjectObject.createCommand(),
			InterpolationTimelinePart
		);
		var selectInterpolationMethodCommand = CallFunctionObject.createCommand(
			dbm.singletons.dbmAnimationManager,
			dbm.singletons.dbmAnimationManager.identifyInterpolationObject,
			[
				GetVariableObject.createCommand(
					SelectBaseObjectObject.createCommand(),
					"interpolationObject"
				)
			]
		);
		
		//Add curve creators
		CurveCreator.getInstance().addTimelineCurveCreator(
			AndObject.createCommand(
				isInterpolationTimelinePartCommand,
				ConditionObject.createCommand(
					selectInterpolationMethodCommand,
					"===",
					InterpolationTypes.LINEAR
				)
			),
			LinearInterpolationTimelineCurveCreator.create()
		);
		
		CurveCreator.getInstance().addTimelineCurveCreator(
			AndObject.createCommand(
				isInterpolationTimelinePartCommand,
				ConditionAnyOfMultipleValuesObject.createCommand(
					selectInterpolationMethodCommand,
					"===",
					[
						InterpolationTypes.QUADRATIC,
						InterpolationTypes.INVERTED_QUADRATIC,
						InterpolationTypes.CUBIC,
						InterpolationTypes.INVERTED_CUBIC
					]
				)
			),
			TangentRoundedTimelineCurveCreator.create(1)
		);
		
		CurveCreator.getInstance().addTimelineCurveCreator(
			AndObject.createCommand(
				isInterpolationTimelinePartCommand,
				ConditionAnyOfMultipleValuesObject.createCommand(
					selectInterpolationMethodCommand,
					"===",
					[
						InterpolationTypes.SINE,
						InterpolationTypes.INVERTED_SINE,
						InterpolationTypes.NORMALIZED_COSINE
					]
				)
			),
			TangentRoundedTimelineCurveCreator.create(2)
		);
	};
});