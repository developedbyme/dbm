/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevalutor that selects an attribute of an xml element.
 */
dbm.registerClass("dbm.utils.reevaluation.xmlreevaluation.GetAttributeReevaluationObject", "dbm.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.xmlreevaluation.GetAttributeReevaluationObject");
	
	//Self reference
	var GetAttributeReevaluationObject = dbm.importClass("dbm.utils.reevaluation.xmlreevaluation.GetAttributeReevaluationObject");
	
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
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetAttributeReevaluationObject::_init");
		
		this.superCall();
		
		this.attributeNameReevaluator = null;
		
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
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetAttributeReevaluationObject::reevaluate");
		//console.log(aBaseObject);
		
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		var theAttributeName = this.attributeNameReevaluator.reevaluate(aBaseObject);
		
		return XmlChildRetreiver.getAttribute(theObject, theAttributeName);
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyIfExists(this.attributeNameReevaluator);
		
		this.superCall();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.attributeNameReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that gets a property on a static object.
	 * 
	 * @param	aElement			ReevalutionBaseObject|Node		The object to get the property on.
	* @param	aAttributeName		ReevalutionBaseObject|String	The name of the attribute to get.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aElement, aAttributeName) {
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetAttributeReevaluationObject::createCommand (static)");
		var newCommand = (new GetAttributeReevaluationObject()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aElement);
		newCommand.attributeNameReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aAttributeName);
		
		return newCommand;
	};
	
	staticFunctions.createSelectOnBaseObjectCommand = function(aAttributeName) {
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetAttributeReevaluationObject::createSelectOnBaseObjectCommand (static)");
		//console.log(aPropertyName);
		
		return ClassReference.createCommand((new SelectBaseObjectObject()).init(), aAttributeName);
	};
});