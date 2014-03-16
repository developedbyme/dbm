/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.InvertedInterpolationCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.InvertedInterpolationCreator");
	
	var InvertedInterpolationCreator = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.InvertedInterpolationCreator");
	
	var InvertedInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.InvertedInterpolation");
	
	objectFunctions.init = function() {
		
		this._init();
		
		return this;
	};
	
	/**
	 * Initi function
	 */
	objectFunctions._init = function() {
		
		//MENOTE: should be overidden
		
		return this;
	}; //End function _init
	
	
	objectFunctions.create = function(aType, aInvertedType) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.interpolationcreators.InvertedInterpolationCreator::create");
		
		return InvertedInterpolation.create(dbm.singletons.dbmAnimationManager.getInterpolationObject(aInvertedType));
	};
});