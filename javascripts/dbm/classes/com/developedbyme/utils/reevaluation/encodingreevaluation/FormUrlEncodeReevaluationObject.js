/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.reevaluation.encodingreevaluation.FormUrlEncodeReevaluationObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.encodingreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var FormUrlEncodeReevaluationObject = dbm.importClass("com.developedbyme.utils.reevaluation.encodingreevaluation.FormUrlEncodeReevaluationObject");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.encodingreevaluation.FormUrlEncodeReevaluationObject::_init");
		
		this.superCall();
		
		this.formObjectReevaluator = null;
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference.
	 *
	 * @param	aBaseObject	The object to base the reevaluation from.
	 * @return	The property on the base object.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.encodingreevaluation.FormUrlEncodeReevaluationObject::reevaluate");
		var parametersObject = this.formObjectReevaluator.reevaluate(aBaseObject);
		var returnArray = new Array();
		
		for(var objectName in parametersObject) {
			returnArray.push(encodeURIComponent(objectName) + "=" + encodeURIComponent(parametersObject[objectName]));
		}
		
		return returnArray.join("&");
	};
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyIfExists(this.formObjectReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.formObjectReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a command that encodes an object to a form url string.
	 * 
	 * @param	aParametersObject	The object with the parameters
	 * @return	The new command.
	 */
	staticFunctions.createCommand = function(aParametersObject) {
		//console.log("com.developedbyme.utils.reevaluation.encodingreevaluation.FormUrlEncodeReevaluationObject::createCommand (static)");
		
		var newCommand = (new FormUrlEncodeReevaluationObject()).init();
		
		newCommand.formObjectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aParametersObject);
		
		return newCommand;
	};
});