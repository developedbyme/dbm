/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup");
	
	var DefaultBasicClassShortcutSetup = dbm.importClass("dbm.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	var StaticImage = dbm.importClass("dbm.gui.images.StaticImage");
	var StateImage = dbm.importClass("dbm.gui.images.StateImage");
	var InputField = dbm.importClass("dbm.gui.form.InputField");
	var FileUploadButton = dbm.importClass("dbm.gui.buttons.FileUploadButton");
	var LinkElement = dbm.importClass("dbm.gui.text.LinkElement");
	var TreeStructureView = dbm.importClass("dbm.gui.data.treestructure.TreeStructureView");
	var TreeStructureItemView = dbm.importClass("dbm.gui.data.treestructure.TreeStructureItemView");
	var SwitchableAreaHolder = dbm.importClass("dbm.gui.abstract.switchablearea.SwitchableAreaHolder");
	var HorizontalScaleSlider = dbm.importClass("dbm.gui.form.sliders.HorizontalScaleSlider");
	var HorizontalPlayheadSlider = dbm.importClass("dbm.gui.form.sliders.HorizontalPlayheadSlider");
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	
	var TemplateClassShortcutNames = dbm.importClass("dbm.constants.TemplateClassShortcutNames");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.templatemanager.setup.DefaultBasicClassShortcutSetup::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_DISPLAY_BASE_OBJECT, DisplayBaseObject);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_BASE_BUTTON, BaseButton);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_STATIC_IMAGE, StaticImage);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_STATE_IMAGE, StateImage);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_INPUT_FIELD, InputField);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_FILE_UPLOAD_BUTTON, FileUploadButton);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_LINK_ELEMENT, LinkElement);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_HORIZONTAL_SCALE_SLIDER, HorizontalScaleSlider);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_HORIZONTAL_PLAYHEAD_SLIDER, HorizontalPlayheadSlider);
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_CANVAS_VIEW, CanvasView);
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_SWITCHABLE_AREA_HOLDER, SwitchableAreaHolder);
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_TREE_STRUCTURE_VIEW, TreeStructureView);
		dbm.singletons.dbmTemplateManager.registerClassShortcut(TemplateClassShortcutNames.DBM_TREE_STRUCTURE_ITEM_VIEW, TreeStructureItemView);
		
	};
});