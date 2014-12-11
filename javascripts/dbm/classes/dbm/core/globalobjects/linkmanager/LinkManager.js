/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.linkmanager.LinkManager", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.linkmanager.LinkManager");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var HtmlElementControllerLink = dbm.importClass("dbm.core.globalobjects.htmldommanager.data.HtmlElementControllerLink");
	var HtmlCreator = dbm.importClass("dbm.core.globalobjects.htmldommanager.objects.HtmlCreator");
	
	
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.linkmanager.LinkManager::_init");
		
		this.superCall();
		
		this._displayObjects = new Array();
		this._htmlCreators = new Array();
		
		return this;
	};
	
	objectFunctions.handleLink = function(aUrl, aTarget) {
		//console.log("dbm.core.globalobjects.linkmanager.LinkManager::handleLink");
		if(aTarget !== null) {
			window.open(aUrl, aTarget);
			return false;
		}
		return true;
	};
});