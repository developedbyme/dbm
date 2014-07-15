/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Data holder that can be qualified to certain conditions.
 * 
 * @authur	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.utils.data.qualifier.QualifierDataHolder", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.qualifier.QualifierDataHolder");
	
	//Self reference
	var QualifierDataHolder = dbm.importClass("com.developedbyme.utils.data.qualifier.QualifierDataHolder");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.qualifier.QualifierDataHolder::_init");
		
		this.superCall();
		
		this.data = null;
		this.qualifierReevaluator = null;
		this.ownsData = false;
		
		return this;
	}; //End function QualifierDataHolder
	
	/**
	 * Qualifies a base object to be valid for this data.
	 *
	 * @param	aBaseObject	Any	The base data for the reevaluation of the quailification.
	 *
	 * @return	Boolean	True if the base object is qualified for this data.
	 */
	objectFunctions.qualify = function(aBaseObject) {
		return this.qualifierReevaluator.reevaluate(aBaseObject);
	};
	
	/**
	 * Destroys all the data of the object.
	 */
	objectFunctions.performDestroy = function() {
		//console.log("com.developedbyme.utils.data.retainableobjects.RetainableDataHolder::performDestroy");
		//console.log(this.ownsData, this.data !== null, this.data.destroy);
		
		ClassReference.destroyIfExists(this.qualifierReevaluator);
		
		if(this.ownsData && this.data !== null && this.data.destroy) {
			this.data.destroy();
		}
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "data":
				return this.ownsData;
		}
		return this.superCall();
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.data = null;
		this.qualifierReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aReevaluator, aData, aOwnsData) {
		var newQualifierDataHolder = (new ClassReference()).init();
		
		newQualifierDataHolder.qualifierReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aReevaluator);
		newQualifierDataHolder.data = aData;
		newQualifierDataHolder.ownsData = VariableAliases.isTrue(aOwnsData);
		
		return newQualifierDataHolder;
	}
});