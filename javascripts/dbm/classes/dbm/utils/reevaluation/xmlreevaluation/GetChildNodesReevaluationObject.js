/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Reevalutor that selects the a childs of an xml element.
 */
dbm.registerClass("dbm.utils.reevaluation.xmlreevaluation.GetChildNodesReevaluationObject", "dbm.utils.reevaluation.objectreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.xmlreevaluation.GetChildNodesReevaluationObject");
	
	//Self reference
	var GetChildNodesReevaluationObject = dbm.importClass("dbm.utils.reevaluation.xmlreevaluation.GetChildNodesReevaluationObject");
	
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
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetChildNodesReevaluationObject::_init");
		
		this.superCall();
		
		this.childNameReevaluator = null;
		
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
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetChildNodesReevaluationObject::reevaluate");
		var theObject = this.objectReevaluator.reevaluate(aBaseObject);
		var childName = this.childNameReevaluator.reevaluate(aBaseObject);
		
		return XmlChildRetreiver.getChilds(theObject, childName);
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyIfExists(this.childNameReevaluator);
		
		this.superCall();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.childNameReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that gets a property on a static object.
	 * 
	 * @param	aElement			ReevalutionBaseObject|Node		The object to get the property on.
	 * @param	aChildName			ReevalutionBaseObject|String	The name of the child to get.
	 *
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aElement, aChildName) {
		//console.log("dbm.utils.reevaluation.xmlreevaluation.GetChildNodesReevaluationObject::createCommand (static)");
		var newCommand = (new GetChildNodesReevaluationObject()).init();
		
		newCommand.objectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aElement);
		newCommand.childNameReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aChildName);
		
		return newCommand;
	};
});