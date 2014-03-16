/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.TextCreator", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.TextCreator");
	
	var TextCreator = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.TextCreator");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.TextCreator::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.createObject = function(aDataNode) {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.TextCreator::createObject");
		
		var newText = (new TextElement()).init();
		
		newText.setElement(XmlChildRetreiver.getFirstTextNode(aDataNode));
		
		return newText;
	};
	
	staticFunctions.create = function() {
		
		var newTextCreator = (new TextCreator()).init();
		
		return newTextCreator;
	};
});