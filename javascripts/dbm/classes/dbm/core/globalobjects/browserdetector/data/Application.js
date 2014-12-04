/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.browserdetector.data.Application", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.browserdetector.data.Application");
	
	var Application = dbm.importClass("dbm.core.globalobjects.browserdetector.data.Application");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.browserdetector.data.Application::_init");
		
		this.superCall();
		
		this.name = null;
		this.version = null;
		this.comment = null;
		this.squareBracketComments = null;
		
		return this;
		
	};
	
	objectFunctions.setData = function(aName, aVersion, aComment, aSquareBracketComments) {
		this.name = aName;
		this.version = aVersion;
		this.comment = aComment;
		this.squareBracketComments = aSquareBracketComments;
		
		return this;
	};
});