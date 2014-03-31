/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.authorization.OauthFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.authorization.OauthFunctions");
	
	//Self reference
	var OauthFunctions = dbm.importClass("com.developedbyme.utils.authorization.OauthFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var StringEncodingFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringEncodingFunctions");
	var NonceGenerator = dbm.importClass("com.developedbyme.utils.random.NonceGenerator");
	
	//Constants
	
	staticFunctions.DEFAULT_SIGNATURE_METHOD = "HMAC-SHA1";
	staticFunctions.DEFAULT_NONCE_LENGTH = 32;
	
	staticFunctions.createHeader = function(aParametersObject, aSignature) {
		console.log("com.developedbyme.utils.authorization.OauthFunctions::createHeader");
		var returnString = "OAuth ";
		
		for(var objectName in aParametersObject) {
			returnString += objectName + "=\"" + aParametersObject[objectName] + "\", ";
		}
		
		returnString += "oauth_signature=\"" + aSignature + "\"";
		
		console.log(returnString);
		return returnString;
	};
	
	staticFunctions.createOauthParametersObject = function(aConsumerKey, aToken, aSignatureMethod, aVersion, aNonce, aTimestamp) {
		console.log("com.developedbyme.utils.authorization.OauthFunctions::createOauthParametersObject");
		
		aSignatureMethod = VariableAliases.valueWithDefault(aSignatureMethod, ClassReference.DEFAULT_SIGNATURE_METHOD);
		aVersion = VariableAliases.valueWithDefault(aVersion, "1.0");
		if(!VariableAliases.isSet(aNonce)) {
			aNonce =  NonceGenerator.generateNonce(ClassReference.DEFAULT_NONCE_LENGTH);
		}
		if(!VariableAliases.isSet(aTimestamp)) {
			aTimestamp =  Math.floor(0.001*Date.now());
		}
		
		var returnObject = new Object();
		returnObject["oauth_consumer_key"] = aConsumerKey;
		returnObject["oauth_nonce"] = aNonce;
		returnObject["oauth_signature_method"] = aSignatureMethod;
		returnObject["oauth_timestamp"] = aTimestamp;
		returnObject["oauth_token"] = aToken;
		returnObject["oauth_version"] = aVersion;
		
		console.log(returnObject);
		return returnObject;
	};
	
	staticFunctions.createParametersString = function(aParameters, aOauthParameters) {
		console.log("com.developedbyme.utils.authorization.OauthFunctions::createParametersString");
		
		var returnArray = new Array();
		
		for(var objectName in aParameters) {
			returnArray.push(StringEncodingFunctions.encodeRfc3986(objectName) + "=" + StringEncodingFunctions.encodeRfc3986(aParameters[objectName]));
		}
		for(var objectName in aOauthParameters) {
			returnArray.push(StringEncodingFunctions.encodeRfc3986(objectName) + "=" + StringEncodingFunctions.encodeRfc3986(aOauthParameters[objectName]));
		}
		
		returnArray.sort();
		
		console.log(returnArray.join("&"));
		return returnArray.join("&");
	};
	
	staticFunctions.createSignatureBaseString = function(aMethod, aUrl, aParametersString) {
		console.log("com.developedbyme.utils.authorization.OauthFunctions::createSignatureBaseString");
		var returnValue = aMethod + "&" + StringEncodingFunctions.encodeRfc3986(aUrl) + "&" + StringEncodingFunctions.encodeRfc3986(aParametersString);
		console.log(returnValue);
		return returnValue;
	};
	
	staticFunctions.createSignature = function(aConsumerSecret, aTokenSecret, aBaseString, aSignatureMethod) {
		//console.log("com.developedbyme.utils.authorization.OauthFunctions::createSignatureBaseString");
		
		aSignatureMethod = VariableAliases.valueWithDefault(aSignatureMethod, ClassReference.DEFAULT_SIGNATURE_METHOD);
		
		var signingKey = StringEncodingFunctions.encodeRfc3986(aConsumerSecret) + "&" + StringEncodingFunctions.encodeRfc3986(aTokenSecret);
		
		return StringEncodingFunctions.encodeRfc3986(dbm.singletons.dbmEncodingManager.encode(aSignatureMethod, signingKey, aBaseString));
	};
});