dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator");
	
	var HtmlTextCreator = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var HtmlTextElement = dbm.importClass("com.developedbyme.gui.text.HtmlTextElement");
	
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.createObject = function(aDataNode) {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.objects.textcreators.HtmlTextCreator::createObject");
		
		var newText = (new HtmlTextElement()).init();
		
		var htmlString = aDataNode.innerHTML;
		//METODO: remove all children
		HtmlTextElement.create(aDataNode, true, htmlString);
		
		return newText;
	};
	
	staticFunctions.create = function() {
		
		var newHtmlTextCreator = (new HtmlTextCreator()).init();
		
		return newHtmlTextCreator;
	};
});