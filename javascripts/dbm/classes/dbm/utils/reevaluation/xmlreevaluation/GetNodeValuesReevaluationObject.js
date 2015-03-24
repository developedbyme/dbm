/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevalutor that selects the node values from a list of elements.
 */
dbm.registerClass("dbm.utils.reevaluation.xmlreevaluation.GetNodeValuesReevaluationObject", "dbm.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.xmlreevaluation.GetNodeValuesReevaluationObject");
	
	//Self reference
	var GetNodeValuesReevaluationObject = dbm.importClass("dbm.utils.reevaluation.xmlreevaluation.GetNodeValuesReevaluationObject");
	
	//Error report
	
	//Dependencies
	var SelectBaseObjectObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetNodeValuesReevaluationObject::_init");
		
		this.superCall();
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference.
	 *
	 * @param	aBaseObject		*	The object to base the reevaluation from.
	 *
	 * @return	*	The property on the base object.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetNodeValuesReevaluationObject::reevaluate");
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		
		var currentArray = theObject;
		var currentArrayLength = currentArray.length;
		var returnArray = new Array(currentArrayLength);
		for(var i = 0; i < currentArrayLength; i++) {
			returnArray[i] = XmlChildRetreiver.getNodeValue(currentArray[i]);
		}
		
		return returnArray;
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		
		this.superCall();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	/**
	 * Creates a command that gets a property on a static object.
	 * 
	 * @param	aArray			ReevalutionBaseObject|Array		The array to get node values from.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aArray) {
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetNodeValuesReevaluationObject::createCommand (static)");
		var newCommand = (new GetNodeValuesReevaluationObject()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aArray);
		
		return newCommand;
	};
	
	staticFunctions.createSelectOnBaseObjectCommand = function() {
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetNodeValuesReevaluationObject::createSelectOnBaseObjectCommand (static)");
		//console.log(aPropertyName);
		
		return ClassReference.createCommand((new SelectBaseObjectObject()).init());
	};
});