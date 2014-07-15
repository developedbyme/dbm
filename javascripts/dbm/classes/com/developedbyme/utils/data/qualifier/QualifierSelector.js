/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Selector for data that has to be qualified.
 * 
 * @authur	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.utils.data.qualifier.QualifierSelector", "com.developedbyme.utils.data.ArrayHolder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.qualifier.QualifierSelector");
	
	//Self reference
	var QualifierSelector = dbm.importClass("com.developedbyme.utils.data.qualifier.QualifierSelector");
	
	//Error report
	
	//Dependencies
	var QualifierDataHolder = dbm.importClass("com.developedbyme.utils.data.qualifier.QualifierDataHolder");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.qualifier.QualifierSelector::_init");
		
		this.superCall();
		
		this.ownsObjects = true;
		
		return this;
	}; //End function QualifierSelector
	
	objectFunctions.addQualifiedData = function(aQualificationReevaluator, aData, aOwnsData) {
		//console.log("com.developedbyme.utils.data.qualifier.QualifierSelector::addQualifiedData");
		//console.log(aQualificationReevaluator, aData, aOwnsData);
		
		this.array.push(QualifierDataHolder.create(aQualificationReevaluator, aData, aOwnsData));
		
		return this;
	};
	
	/**
	 * Selects the data that is qualified for a bas object
	 *
	 * @param	aBaseObject	Any	The base data for the reevaluation of the quailification.
	 *
	 * @return	Any	The first data that is qualified. Null if no data is qualified.
	 */
	objectFunctions.selectQualifiedData = function(aBaseObject) {
		//console.log("com.developedbyme.utils.data.qualifier.QualifierSelector::selectQualifiedData");
		//console.log(this);
		
		var currentArray = this.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentQualifier = currentArray[i];
			if(currentQualifier.qualify(aBaseObject)) {
				return currentQualifier.data;
			}
		}
		
		return null;
	};
	
	/**
	 * Creates a new selector.
	 */
	staticFunctions.create = function() {
		//trace("breel.utils.data.ArrayHolder.create");
		var newQualifierSelector = (new ClassReference()).init();
		return newQualifierSelector;
	}; //End function create
});