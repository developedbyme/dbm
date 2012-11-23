dbm.registerClass("com.developedbyme.thirdparty.facebook.constants.OpenGraphPermissionTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.thirdparty.facebook.constants.OpenGraphPermissionTypes");
	
	//REFERENCE :http://developers.facebook.com/docs/reference/login/open-graph-permissions/
	//MENOTE: Not including user_actions:APP_NAMESPACE or friends_actions:APP_NAMESPACE
	
	var OpenGraphPermissionTypes = dbm.importClass("com.developedbyme.thirdparty.facebook.constants.OpenGraphPermissionTypes");
	
	staticFunctions.PUBLISH_ACTIONS = "publish_actions";
	staticFunctions.USER_ACTIONS_MUSIC = "user_actions.music";
	staticFunctions.FRIENDS_ACTIONS_MUSIC = "friends_actions.music";
	staticFunctions.USER_ACTIONS_NEWS = "user_actions.news";
	staticFunctions.FRIENDS_ACTIONS_NEWS = "friends_actions.news";
	staticFunctions.USER_ACTIONS_VIDEO = "user_actions.video";
	staticFunctions.FRIENDS_ACTIONS_VIDEO = "friends_actions.video";
	staticFunctions.USER_GAME_ACTIVITY = "user_games_activity";
	staticFunctions.FRIENDS_GAMES_ACTIVITY = "friends_games_activity";
	
});