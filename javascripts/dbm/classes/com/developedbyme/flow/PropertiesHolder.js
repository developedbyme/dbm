/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A standalone holder for properties.
 */
dbm.registerClass("com.developedbyme.flow.PropertiesHolder", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.PropertiesHolder");
	//"use strict";
	
	//Self refernce
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	
	//Error report
	
	//Dependnecies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.PropertiesHolder::_init");
		
		this.superCall();
		
		return this;
	};
	
	/**
	 * Gets the names of all the properties.
	 *
	 * @return	Array<String>	The array of names.
	 */
	objectFunctions.getPropertyNames = function() {
		return this._properties.getNamesArray();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aProperties		Object	An associative array with properties to add to this holder.
	 *
	 * @return	PropertiesHolder	The newly created object.
	 */
	staticFunctions.create = function(aProperties) {
		//console.log("com.developedbyme.flow.PropertiesHolder::create");
		var newNode = ClassReference._createAndInitClass(ClassReference);
		if(VariableAliases.isSet(aProperties)) {
			for(var objectName in aProperties) {
				newNode.createProperty(objectName, aProperties[objectName]);
			}
		}
		return newNode;
	};
});