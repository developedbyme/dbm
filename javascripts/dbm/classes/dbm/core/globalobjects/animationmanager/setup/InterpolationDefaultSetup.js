/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup");
	
	var InterpolationDefaultSetup = dbm.importClass("dbm.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup");
	
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
	var StepInterpolation = dbm.importClass("dbm.utils.math.interpolation.StepInterpolation");
	var LinearInterpolation = dbm.importClass("dbm.utils.math.interpolation.LinearInterpolation");
	var ExponentialInterpolation = dbm.importClass("dbm.utils.math.interpolation.ExponentialInterpolation");
	var SineInterpolation = dbm.importClass("dbm.utils.math.interpolation.SineInterpolation");
	
	var InvertedInterpolation = dbm.importClass("dbm.utils.math.interpolation.InvertedInterpolation");
	var OffsettedInterpolation = dbm.importClass("dbm.utils.math.interpolation.OffsettedInterpolation");
	
	var ExponentialInterpolationCreator = dbm.importClass("dbm.core.globalobjects.animationmanager.interpolationcreators.ExponentialInterpolationCreator");
	var InvertedInterpolationCreator = dbm.importClass("dbm.core.globalobjects.animationmanager.interpolationcreators.InvertedInterpolationCreator");
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.STEP, StepInterpolation.create());
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.LINEAR, LinearInterpolation.create());
		
		var quadricInterpolation = ExponentialInterpolation.create(2);
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.QUADRATIC, quadricInterpolation);
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.INVERTED_QUADRATIC, InvertedInterpolation.create(quadricInterpolation));
		
		var cubicInterpolation = ExponentialInterpolation.create(3);
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.CUBIC, cubicInterpolation);
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.INVERTED_CUBIC, InvertedInterpolation.create(cubicInterpolation));
		
		var sineInterpoaltion = SineInterpolation.create();
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.SINE, sineInterpoaltion);
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.INVERTED_SINE, InvertedInterpolation.create(sineInterpoaltion));
		
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.NORMALIZED_COSINE, OffsettedInterpolation.create(SineInterpolation.create(0, Math.PI, -0.5*Math.PI), 0.5, 0.5));
		
		dbm.singletons.dbmAnimationManager.addDynamicInterpolationCreator(InterpolationTypes.DYNAMIC_EXPONENTIAL, (new ExponentialInterpolationCreator()).init());
		dbm.singletons.dbmAnimationManager.addDynamicInterpolationCreator(InterpolationTypes.DYNAMIC_INVERTED, (new InvertedInterpolationCreator()).init());
	};
});