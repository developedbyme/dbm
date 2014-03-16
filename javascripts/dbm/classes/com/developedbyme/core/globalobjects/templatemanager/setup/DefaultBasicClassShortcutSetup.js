/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup");
	
	var DefaultBasicClassShortcutSetup = dbm.importClass("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	var StaticImage = dbm.importClass("com.developedbyme.gui.images.StaticImage");
	var StateImage = dbm.importClass("com.developedbyme.gui.images.StateImage");
	var InputField = dbm.importClass("com.developedbyme.gui.form.InputField");
	var TreeStructureView = dbm.importClass("com.developedbyme.gui.data.treestructure.TreeStructureView");
	var TreeStructureItemView = dbm.importClass("com.developedbyme.gui.data.treestructure.TreeStructureItemView");
	var SwitchableAreaHolder = dbm.importClass("com.developedbyme.gui.abstract.switchablearea.SwitchableAreaHolder");
	var HorizontalScaleSlider = dbm.importClass("com.developedbyme.gui.form.sliders.HorizontalScaleSlider");
	
	var TemplateClassShortcutNames = dbm.importClass("com.developedbyme.constants.TemplateClassShortcutNames");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_DISPLAY_BASE_OBJECT, DisplayBaseObject);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_BASE_BUTTON, BaseButton);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_STATIC_IMAGE, StaticImage);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_STATE_IMAGE, StateImage);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_INPUT_FIELD, InputField);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_HORIZONTAL_SCALE_SLIDER, HorizontalScaleSlider);
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_SWITCHABLE_AREA_HOLDER, SwitchableAreaHolder);
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_TREE_STRUCTURE_VIEW, TreeStructureView);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_TREE_STRUCTURE_ITEM_VIEW, TreeStructureItemView);
		
	};
});