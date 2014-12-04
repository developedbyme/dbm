/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.facebook.constants.BasicInformationTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.thirdparty.facebook.constants.BasicInformationTypes");
	
	//REFERENCE: http://developers.facebook.com/docs/reference/login/basic-info/
	
	var BasicInformationTypes = dbm.importClass("dbm.thirdparty.facebook.constants.BasicInformationTypes");
	
	staticFunctions.ID = "id";
	staticFunctions.NAME = "name";
	staticFunctions.FIRST_NAME = "first_name";
	staticFunctions.LAST_NAME = "last_name";
	staticFunctions.LINK = "link";
	staticFunctions.USERNAME = "username";
	staticFunctions.GENDER = "gender";
	staticFunctions.LOCALE = "locale";
	
});