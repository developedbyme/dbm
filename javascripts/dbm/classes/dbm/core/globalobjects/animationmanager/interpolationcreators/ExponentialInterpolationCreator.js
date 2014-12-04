/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.animationmanager.interpolationcreators.ExponentialInterpolationCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.animationmanager.interpolationcreators.ExponentialInterpolationCreator");
	
	var ExponentialInterpolationCreator = dbm.importClass("dbm.core.globalobjects.animationmanager.interpolationcreators.ExponentialInterpolationCreator");
	
	var ExponentialInterpolation = dbm.importClass("dbm.utils.math.interpolation.ExponentialInterpolation");
	
	objectFunctions.init = function() {
		this._init();
		return this;
	};
	
	/**
	 * Init function
	 */
	objectFunctions._init = function() {
		
		//MENOTE: should be overridden
		
		return this;
	}; //End function _init
	
	
	objectFunctions.create = function(aType, aExponent) {
		//console.log("dbm.core.globalobjects.animationmanager.interpolationcreators.ExponentialInterpolationCreator::create");
		//console.log(aExponent, parseFloat(aExponent), ExponentialInterpolation.create(parseFloat(aExponent)));
		return ExponentialInterpolation.create(parseFloat(aExponent));
	};
});