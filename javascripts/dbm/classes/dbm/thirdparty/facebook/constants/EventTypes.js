/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.facebook.constants.EventTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.thirdparty.facebook.constants.EventTypes");
	
	//REFERENCE: http://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/
	
	var EventTypes = dbm.importClass("dbm.thirdparty.facebook.constants.EventTypes");
	
	staticFunctions.AUTH_LOGIN = "auth.login";
	staticFunctions.AUTH_RESPONSE_CHANGE = "auth.authResponseChange";
	staticFunctions.AUTH_STATUS_CHANGE = "auth.statusChange";
	staticFunctions.AUTH_LOGOUT = "auth.logout";
	staticFunctions.AUTH_PROMPT = "auth.prompt";
	staticFunctions.XFBML_RENDER = "xfbml.render";
	staticFunctions.EDGE_CREATE = "edge.create";
	staticFunctions.EDGE_REMOVE = "edge.remove";
	staticFunctions.COMMENT_CREATE = "comment.create";
	staticFunctions.COMMENT_REMOVE = "comment.remove";
	staticFunctions.MESSAGE_SEND = "message.send";
	
});