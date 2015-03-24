/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevalutor that selects the node value of an xml element.
 */
dbm.registerClass("dbm.utils.reevaluation.xmlreevaluation.GetNodeValueReevaluationObject", "dbm.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.xmlreevaluation.GetNodeValueReevaluationObject");
	
	//Self reference
	var GetNodeValueReevaluationObject = dbm.importClass("dbm.utils.reevaluation.xmlreevaluation.GetNodeValueReevaluationObject");
	
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
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetNodeValueReevaluationObject::_init");
		
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
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetNodeValueReevaluationObject::reevaluate");
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		
		return XmlChildRetreiver.getNodeValue(theObject);
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
	 * @param	aElement			ReevalutionBaseObject|Node		The object to get the property on.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aElement) {
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetNodeValueReevaluationObject::createCommand (static)");
		var newCommand = (new GetNodeValueReevaluationObject()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aElement);
		
		return newCommand;
	};
	
	staticFunctions.createSelectOnBaseObjectCommand = function() {
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetNodeValueReevaluationObject::createSelectOnBaseObjectCommand (static)");
		//console.log(aPropertyName);
		
		return ClassReference.createCommand((new SelectBaseObjectObject()).init());
	};
});