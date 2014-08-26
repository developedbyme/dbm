/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevaluation that selects an element based on a query from another element.
 */
dbm.registerClass("com.developedbyme.utils.reevaluation.objectreevaluation.htmldom.QuerySelectorObject", "com.developedbyme.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.htmldom.ObjectReevaluationBaseObject");
	
	//Self reference
	var QuerySelectorObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.htmldom.QuerySelectorObject");
	
	//Error report
	
	//Dependnecies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.htmldom.QuerySelectorObject::_init");
		
		this.superCall();
		
		this.queryReevaluator = null;
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference.
	 *
	 * @param	aBaseObject	The object to base the reevaluation from.
	 *
	 * @return	The selected value in the named array.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.htmldom.QuerySelectorObject::reevaluate");
		//console.log(this);
		
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		var queryPath = this.queryReevaluator.reevaluate(aBaseObject);
		
		//console.log(theObject, queryPath);
		
		return theObject.querySelector(queryPath);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.queryReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that executes a query selector on an element.
	 * 
	 * @param	aObject		HTMLElement		The element to search from.
	 * @param	aQuery		String			The name of the value to get.
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aObject, aQuery) {
		//console.log("com.developedbyme.utils.reevaluation.objectreevaluation.htmldom.QuerySelectorObject::createCommand (static)");
		//console.log(aName);
		var newCommand = (new QuerySelectorObject()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aObject);
		newCommand.queryReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aQuery);
		
		return newCommand;
	};
});