dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.InvertedInterpolationCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.InvertedInterpolationCreator");
	
	var InvertedInterpolationCreator = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.InvertedInterpolationCreator");
	
	var InvertedInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.InvertedInterpolation");
	
	objectFunctions.init = function() {
		return this;
	};
	
	objectFunctions.create = function(aType, aInvertedType) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.InvertedInterpolationCreator::create");
		
		return InvertedInterpolation.create(dbm.singletons.dbmAnimationManager.getInterpolationObject(aInvertedType));
	};
});