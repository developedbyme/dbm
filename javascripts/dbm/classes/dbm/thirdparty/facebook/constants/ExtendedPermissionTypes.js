/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.facebook.constants.ExtendedPermissionTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.thirdparty.facebook.constants.ExtendedPermissionTypes");
	
	//REFERENCE: http://developers.facebook.com/docs/reference/login/extended-permissions/
	
	var ExtendedPermissionTypes = dbm.importClass("dbm.thirdparty.facebook.constants.ExtendedPermissionTypes");
	
	staticFunctions.READ_FRIEND_LIST = "read_friendlists";
	staticFunctions.READ_INSIGHTS = "read_insights";
	staticFunctions.READ_MAILBOX = "read_mailbox";
	staticFunctions.READ_REQUESTS = "read_requests";
	staticFunctions.READ_STREAM = "read_stream";
	staticFunctions.XMPP_LOGIN = "xmpp_login";
	staticFunctions.ADS_MANAGEMENT = "ads_management";
	staticFunctions.CREATE_EVENT = "create_event";
	staticFunctions.MANAGE_FRIENDLISTS = "manage_friendlists";
	staticFunctions.MANAGE_NOTIFICATIONS = "manage_notifications";
	staticFunctions.USER_ONLINE_PRESENCE = "user_online_presence";
	staticFunctions.FRIEND_ONLINE_PRESENCE = "friends_online_presence";
	staticFunctions.PUBLISH_CHECKINS = "publish_checkins";
	staticFunctions.PUBLISH_STREAM = "publish_stream";
	staticFunctions.RSVP_EVENT = "rsvp_event";
	
});