/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.authorization.OauthSetupFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.authorization.OauthSetupFunctions");
	
	//Self reference
	var OauthSetupFunctions = dbm.importClass("dbm.utils.authorization.OauthSetupFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var OauthAuthorizationEncodeReevaluationObject = dbm.importClass("dbm.utils.reevaluation.encodingreevaluation.OauthAuthorizationEncodeReevaluationObject");
	var OauthFunctions = dbm.importClass("dbm.utils.authorization.OauthFunctions");
	var CallFunctionObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	
	//Constants
	
	
	staticFunctions.setupAssetWithOauth = function(aAsset, aParameters, aConsumerKey, aConsumerSecret, aToken, aTokenSecret, aSignatureMethod, aVersion, aNonce, aTimestamp) {
		aSignatureMethod = VariableAliases.valueWithDefault(aSignatureMethod, OauthFunctions.DEFAULT_SIGNATURE_METHOD);
		aVersion = VariableAliases.valueWithDefault(aVersion, "1.0");
		aNonce = VariableAliases.valueWithDefault(aNonce, null);
		aTimestamp = VariableAliases.valueWithDefault(aTimestamp, null);
		
		var command = OauthAuthorizationEncodeReevaluationObject.createCommand();
		
		command.methodObjectReevaluator = CallFunctionObject.createCommand(aAsset, aAsset.getRequestMethod, []);
		command.urlObjectReevaluator = CallFunctionObject.createCommand(aAsset, aAsset.getUrl, []);
		command.formObjectReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aParameters);
		
		command.consumerKeyReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aConsumerKey);
		command.consumerSecretReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aConsumerSecret);
		
		command.tokenReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aToken);
		command.tokenSecretReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aTokenSecret);
		
		command.signatureMethodReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aSignatureMethod);
		command.versionReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aVersion);
		command.nonceReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aNonce);
		command.timestampReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aTimestamp);
		
		aAsset.setupFormObject(aParameters);
		aAsset.addHeader("Authorization", command);
		
		return aAsset;
	};
	
	staticFunctions.setupAssetWithOauthPost = function(aAsset, aParameters, aConsumerKey, aConsumerSecret, aToken, aTokenSecret, aSignatureMethod, aVersion, aNonce, aTimestamp) {
		aAsset.setupAsFormObjectPost(aParameters);
		ClassReference.setupAssetWithOauth(aAsset, aParameters, aConsumerKey, aConsumerSecret, aToken, aTokenSecret, aSignatureMethod, aVersion, aNonce, aTimestamp);
		
		return aAsset;
	};
});