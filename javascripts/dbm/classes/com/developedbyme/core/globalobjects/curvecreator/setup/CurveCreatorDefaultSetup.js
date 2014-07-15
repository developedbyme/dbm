/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Default setup for the global curve creator.
 */
dbm.registerClass("com.developedbyme.core.globalobjects.curvecreator.setup.CurveCreatorDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curvecreator.setup.CurveCreatorDefaultSetup");
	//"use strict";
	
	//Self reference
	var CurveCreatorDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.curvecreator.setup.CurveCreatorDefaultSetup");
	
	//Error report
	
	//Dependencies
	var CurveCreator = dbm.importClass("com.developedbyme.core.globalobjects.curvecreator.CurveCreator");
	var LinearInterpolationTimelineCurveCreator = dbm.importClass("com.developedbyme.core.globalobjects.curvecreator.timeline.LinearInterpolationTimelineCurveCreator");
	var InterpolationTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart");
	var TangentRoundedTimelineCurveCreator = dbm.importClass("com.developedbyme.core.globalobjects.curvecreator.timeline.TangentRoundedTimelineCurveCreator");
	
	//Utils
	var AndObject = dbm.importClass("com.developedbyme.utils.reevaluation.logicreevaluation.AndObject");
	var InstanceOfClassObject = dbm.importClass("com.developedbyme.utils.reevaluation.logicreevaluation.InstanceOfClassObject");
	var SelectBaseObjectObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	var CallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ConditionObject = dbm.importClass("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionObject");
	var ConditionAnyOfMultipleValuesObject = dbm.importClass("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionAnyOfMultipleValuesObject");
	
	//Constants
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
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