/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.encodingreevaluation.OauthAuthorizationEncodeReevaluationObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.encodingreevaluation.ObjectReevaluationBaseObject");
	
	//Self reference
	var OauthAuthorizationEncodeReevaluationObject = dbm.importClass("dbm.utils.reevaluation.encodingreevaluation.OauthAuthorizationEncodeReevaluationObject");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	var OauthFunctions = dbm.importClass("dbm.utils.authorization.OauthFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.encodingreevaluation.OauthAuthorizationEncodeReevaluationObject::_init");
		
		this.superCall();
		
		this.methodObjectReevaluator = null;
		this.urlObjectReevaluator = null;
		this.formObjectReevaluator = null;
		
		this.consumerKeyReevaluator = null;
		this.consumerSecretReevaluator = null;
		
		this.tokenReevaluator = null;
		this.tokenSecretReevaluator = null;
		
		this.signatureMethodReevaluator = null;
		this.versionReevaluator = null;
		this.nonceReevaluator = null;
		this.timestampReevaluator = null;
		
		return this;
	};
	
	/**
	 * The function that reevalutes this reference.
	 *
	 * @param	aBaseObject	The object to base the reevaluation from.
	 * @return	The property on the base object.
	 */
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.encodingreevaluation.OauthAuthorizationEncodeReevaluationObject::reevaluate");
		var parametersObject = this.formObjectReevaluator.reevaluate(aBaseObject);
		
		var signatureMethod = this.signatureMethodReevaluator.reevaluate(aBaseObject);
		
		var oauthParametersObject = OauthFunctions.createOauthParametersObject(
			this.consumerKeyReevaluator.reevaluate(aBaseObject),
			this.tokenReevaluator.reevaluate(aBaseObject),
			signatureMethod,
			this.versionReevaluator.reevaluate(aBaseObject),
			this.nonceReevaluator.reevaluate(aBaseObject),
			this.timestampReevaluator.reevaluate(aBaseObject)
		);
		var parametersString = OauthFunctions.createParametersString(parametersObject, oauthParametersObject, signatureMethod);
		var signature = OauthFunctions.createSignature(
			this.consumerSecretReevaluator.reevaluate(aBaseObject),
			this.tokenSecretReevaluator.reevaluate(aBaseObject), 
			OauthFunctions.createSignatureBaseString(
				this.methodObjectReevaluator.reevaluate(aBaseObject),
				this.urlObjectReevaluator.reevaluate(aBaseObject),
				parametersString
			),
			signatureMethod
		);
		
		return OauthFunctions.createHeader(oauthParametersObject, signature);
	};
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyIfExists(this.methodObjectReevaluator);
		ClassReference.destroyIfExists(this.urlObjectReevaluator);
		ClassReference.destroyIfExists(this.formObjectReevaluator);
		
		ClassReference.destroyIfExists(this.consumerKeyReevaluator);
		ClassReference.destroyIfExists(this.consumerSecretReevaluator);
		
		ClassReference.destroyIfExists(this.tokenReevaluator);
		ClassReference.destroyIfExists(this.tokenSecretReevaluator);
		
		ClassReference.destroyIfExists(this.signatureMethodReevaluator);
		ClassReference.destroyIfExists(this.versionReevaluator);
		ClassReference.destroyIfExists(this.nonceReevaluator);
		ClassReference.destroyIfExists(this.timestampReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.methodObjectReevaluator = null;
		this.urlObjectReevaluator = null;
		this.formObjectReevaluator = null;
		
		this.consumerKeyReevaluator = null;
		this.consumerSecretReevaluator = null;
		
		this.tokenReevaluator = null;
		this.tokenSecretReevaluator = null;
		
		this.signatureMethodReevaluator = null;
		this.versionReevaluator = null;
		this.nonceReevaluator = null;
		this.timestampReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function() {
		//console.log("dbm.utils.reevaluation.encodingreevaluation.OauthAuthorizationEncodeReevaluationObject::createCommand (static)");
		
		var newCommand = (new OauthAuthorizationEncodeReevaluationObject()).init();
		
		return newCommand;
	};
});