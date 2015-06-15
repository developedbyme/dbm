/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator");
	
	var HtmlTextCreator = dbm.importClass("dbm.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var HtmlTextElement = dbm.importClass("dbm.gui.text.HtmlTextElement");
	
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.createObject = function(aDataNode) {
		//console.log("dbm.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator::createObject");
		//console.log(aDataNode);
		
		var htmlString = aDataNode.innerHTML;
		//METODO: remove all children
		
		var newText = HtmlTextElement.create(aDataNode, true, htmlString);
		
		return newText;
	};
	
	staticFunctions.create = function() {
		
		var newHtmlTextCreator = (new HtmlTextCreator()).init();
		
		return newHtmlTextCreator;
	};
});