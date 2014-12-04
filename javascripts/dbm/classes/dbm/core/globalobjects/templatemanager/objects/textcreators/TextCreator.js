/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.templatemanager.objects.textcreators.TextCreator", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.templatemanager.objects.textcreators.TextCreator");
	
	var TextCreator = dbm.importClass("dbm.core.globalobjects.templatemanager.objects.textcreators.TextCreator");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var TextElement = dbm.importClass("dbm.gui.text.TextElement");
	
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.templatemanager.objects.textcreators.TextCreator::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.createObject = function(aDataNode) {
		//console.log("dbm.core.globalobjects.templatemanager.objects.textcreators.TextCreator::createObject");
		
		var newText = (new TextElement()).init();
		
		var firstChild = XmlChildRetreiver.getFirstTextNode(aDataNode);
		if(firstChild === null) {
			firstChild = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(aDataNode.ownerDocument).createText("");
			aDataNode.appendChild(firstChild);
		}
		
		newText.setElement(firstChild);
		
		return newText;
	};
	
	staticFunctions.create = function() {
		
		var newTextCreator = (new TextCreator()).init();
		
		return newTextCreator;
	};
});