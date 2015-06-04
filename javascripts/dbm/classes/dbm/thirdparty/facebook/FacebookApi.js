/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.facebook.FacebookApi", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.thirdparty.facebook.FacebookApi");
	
	//Self reference
	var FacebookApi = dbm.importClass("dbm.thirdparty.facebook.FacebookApi");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var JavascriptWithCallbackLoader = dbm.importClass("dbm.core.globalobjects.assetrepository.loaders.JavascriptWithCallbackLoader");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var GraphData = dbm.importClass("dbm.thirdparty.facebook.GraphData");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var StaticCallbackLink = dbm.importClass("dbm.core.extendedevent.eventlink.StaticCallbackLink");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var StatusTypes = dbm.importClass("dbm.thirdparty.facebook.constants.StatusTypes");
	var AccessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.AccessExtendedEventIds");
	
	staticFunctions._LOGIN_CALLBACK = "loginCallback";
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.thirdparty.facebook.FacebookApi::_init");
		
		this.superCall();
		
		var callbackName = dbm.singletons.dbmIdManager.getNewId("callback");
		this._scriptLoader = JavascriptWithCallbackLoader.create("//connect.facebook.net/en_US/sdk.js", callbackName);
		dbm.getWindow().fbAsyncInit = this._scriptLoader._callbackEventLink.getCallbackFunction();
		
		this._scriptLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setApi, [GetVariableObject.createCommand(dbm.getWindow(), "FB")]));
		
		this._api = null;
		this._graphData = this.addDestroyableObject(NamedArray.create(true));
		
		this._appId = null;
		this._status = false;
		this._xfbml = false;
		this._version = "v2.3"; //METODO: Move this to default constants
		
		this._connected = this.createProperty("connected", false);
		this._userId = this.createProperty("userId", null);
		this._token = this.createProperty("token", null);
		
		this._loginCallbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), ClassReference._LOGIN_CALLBACK);
		this.getExtendedEvent().addEventLink(this._loginCallbackEventLink, ClassReference._LOGIN_CALLBACK, true);
		this.getExtendedEvent().addCommandToEvent(ClassReference._LOGIN_CALLBACK, CallFunctionCommand.createCommand(this, this._callback_login, [GetVariableObject.createSelectDataCommand()]));
		
		
		return this;
	};
	
	objectFunctions.setup = function(aAppId, aVersion) {
		this._appId = aAppId;
		
		if(VariableAliases.isSet(aVersion)) {
			this._version = aVersion;
		}
		
		this._scriptLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._initApi, [this._appId, this._status, this._xfbml, this._version]));
		
		return this;
	};
	
	objectFunctions.getLoader = function() {
		return this._scriptLoader;
	};
	
	objectFunctions.load = function() {
		//console.log("dbm.thirdparty.facebook.FacebookApi::load");
		
		this._scriptLoader.load();
	};
	
	objectFunctions._setApi = function(aApi) {
		//console.log("dbm.thirdparty.facebook.FacebookApi::_setApi");
		this._api = aApi;
		
		return this;
	};
	
	objectFunctions._initApi = function(aAppId, aStatus, aXfbml, aVersion) {
		//console.log("dbm.thirdparty.facebook.FacebookApi::_initApi");
		this._api.init({
			"appId": aAppId,
			"status": aStatus,
			"xfbml": aXfbml,
			"version": aVersion
		});
	};
	
	objectFunctions.checkLogin = function() {
		//console.log("dbm.thirdparty.facebook.FacebookApi::checkLogin");
		
		this._api.getLoginStatus(this._loginCallbackEventLink.getCallbackFunction());
	};
	
	objectFunctions.login = function() {
		//console.log("dbm.thirdparty.facebook.FacebookApi::login");
		
		//METODO: add permissions
		var scopeString = "user_posts"; //"user_posts, publish_actions";
		
		
		this._api.login(this._loginCallbackEventLink.getCallbackFunction(), {"scope": scopeString});
	};
	
	objectFunctions._callback_login = function(aEvent) {
		//console.log("dbm.thirdparty.facebook.FacebookApi::_callback_login");
		//console.log(aEvent);
		
		if(aEvent.status === StatusTypes.CONNECTED) {
			this._connected.setValue(true);
			
			var userId = aEvent.authResponse.userID;
			
			this._userId.setValue(userId);
			this._token.setValue(aEvent.authResponse.accessToken);
			
			var newGraphData = this.getGraphData("me");
			newGraphData.setPropertyInput("id", userId);
			this._graphData.addObject(userId, newGraphData);
			
			if(this.getExtendedEvent().hasEvent(AccessExtendedEventIds.SIGNED_IN)) {
				this.getExtendedEvent().perform(AccessExtendedEventIds.SIGNED_IN, null);
			}
		}
		else {
			this._connected.setValue(false);
			this._userId.setValue(null);
			this._token.setValue(null);
			
			if(this.getExtendedEvent().hasEvent(AccessExtendedEventIds.UNSUCCESSFUL_SIGN_IN)) {
				this.getExtendedEvent().perform(AccessExtendedEventIds.UNSUCCESSFUL_SIGN_IN, null);
			}
		}
	};
	
	objectFunctions.getGraphData = function(aId) {
		if(this._graphData.select(aId)) {
			return this._graphData.currentSelectedItem;
		}
		else {
			var newGraphData = GraphData.create(this._api, aId);
			this._graphData.addObject(aId, newGraphData);
			return newGraphData;
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case AccessExtendedEventIds.SIGNED_IN:
			case AccessExtendedEventIds.UNSUCCESSFUL_SIGN_IN:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aAppId, aVersion) {
		
		var newFacebookApi = (new ClassReference()).init();
		
		newFacebookApi.setup(aAppId, aVersion);
		
		return newFacebookApi;
	};
});