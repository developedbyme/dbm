dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup");
	
	var InterpolationDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.setup.InterpolationDefaultSetup");
	
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	var LinearInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.LinearInterpolation");
	var ExponentialInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.ExponentialInterpolation");
	var InvertedInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.InvertedInterpolation");
	
	var ExponentialInterpolationCreator = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.ExponentialInterpolationCreator");
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.LINEAR, LinearInterpolation.create());
		
		var quadricInterpolation = ExponentialInterpolation.create(2);
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.QUADRIC, quadricInterpolation);
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.INVERTED_QUADRIC, InvertedInterpolation.create(quadricInterpolation));
		
		var cubicInterpolation = ExponentialInterpolation.create(3);
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.CUBIC, cubicInterpolation);
		dbm.singletons.dbmAnimationManager.addInterpolationObject(InterpolationTypes.INVERTED_CUBIC, InvertedInterpolation.create(cubicInterpolation));
		
		dbm.singletons.dbmAnimationManager.addDynamicInterpolationCreator(InterpolationTypes.DYNAMIC_EXPONENTIAL, (new ExponentialInterpolationCreator()).init());
	};
});