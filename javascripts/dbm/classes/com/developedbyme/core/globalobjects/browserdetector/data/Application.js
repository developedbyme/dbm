dbm.registerClass("com.developedbyme.core.globalobjects.browserdetector.data.Application", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.browserdetector.data.Application");
	
	var Application = dbm.importClass("com.developedbyme.core.globalobjects.browserdetector.data.Application");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.browserdetector.data.Application::_init");
		
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