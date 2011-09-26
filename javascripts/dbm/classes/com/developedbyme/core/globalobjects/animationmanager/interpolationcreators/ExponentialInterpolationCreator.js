dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.ExponentialInterpolationCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.ExponentialInterpolationCreator");
	
	var ExponentialInterpolationCreator = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.ExponentialInterpolationCreator");
	
	var ExponentialInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.ExponentialInterpolation");
	
	objectFunctions.init = function() {
		return this;
	};
	
	objectFunctions.create = function(aType, aExponent) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.ExponentialInterpolationCreator::create");
		//console.log(aExponent, parseFloat(aExponent), ExponentialInterpolation.create(parseFloat(aExponent)));
		return ExponentialInterpolation.create(parseFloat(aExponent));
	};
});