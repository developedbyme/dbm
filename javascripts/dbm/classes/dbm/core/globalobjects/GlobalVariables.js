/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Static object with global variables that can be used by all classes.
 */
dbm.registerClass("dbm.core.globalobjects.GlobalVariables", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.GlobalVariables");
	//"use strict";
	
	//Self reference
	var GlobalVariables = dbm.importClass("dbm.core.globalobjects.GlobalVariables");
	
	/**
	 * The global flow update number.
	 */
	staticFunctions.FLOW_UPDATE_NUMBER = 1;
	
	/**
	 * Array of random values generated at startup to have a unique seed for the shared random generator.
	 * @type	Array
	 */
	staticFunctions.RANDOM_VALUES = new Array();
	
	/**
	 * A shared random generator that gets seeded with the initial random values.
	 * @type	MersenneTwister
	 */
	staticFunctions.SHARED_RANDOM_NUMBER_GENERATOR = null;
});