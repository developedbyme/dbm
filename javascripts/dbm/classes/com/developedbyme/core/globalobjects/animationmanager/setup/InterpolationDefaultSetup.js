dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup");
	
	var InterpolationDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup");
	
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	var StepInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.StepInterpolation");
	var LinearInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.LinearInterpolation");
	var ExponentialInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.ExponentialInterpolation");
	var SineInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.SineInterpolation");
	
	var InvertedInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.InvertedInterpolation");
	var OffsettedInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.OffsettedInterpolation");
	
	var ExponentialInterpolationCreator = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.ExponentialInterpolationCreator");
	var InvertedInterpolationCreator = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.InvertedInterpolationCreator");
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.STEP, StepInterpolation.create());
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.LINEAR, LinearInterpolation.create());
		
		var quadricInterpolation = ExponentialInterpolation.create(2);
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.QUADRIC, quadricInterpolation);
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.INVERTED_QUADRIC, InvertedInterpolation.create(quadricInterpolation));
		
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