dbm.registerClass("com.developedbyme.core.globalobjects.linkmanager.LinkManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.linkmanager.LinkManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var HtmlElementControllerLink = dbm.importClass("com.developedbyme.core.globalobjects.htmldommanager.data.HtmlElementControllerLink");
	var HtmlCreator = dbm.importClass("com.developedbyme.core.globalobjects.htmldommanager.objects.HtmlCreator");
	
	dbm.setClassAsSingleton("dbmLinkManager");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.linkmanager.LinkManager::_init");
		
		this.superCall();
		
		this._displayObjects = new Array();
		this._htmlCreators = new Array();
		
		return this;
	};
	
	objectFunctions.handleLink = function(aUrl, aTarget) {
		//console.log("com.developedbyme.core.globalobjects.linkmanager.LinkManager::handleLink");
		if(aTarget !== null) {
			window.open(aUrl, aTarget);
			return false;
		}
		return true;
	};
});