/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.gui.form.sliders.HorizontalPlayheadSliderApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var HorizontalPlayheadSliderApplication = dbm.importClass("com.developedbyme.projects.examples.gui.form.sliders.HorizontalPlayheadSliderApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var HorizontalPlayheadSlider = dbm.importClass("com.developedbyme.gui.form.sliders.HorizontalPlayheadSlider");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.gui.form.sliders.HorizontalPlayheadSliderApplication::_init");
		
		this.superCall();
		
		this._slider = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.gui.form.sliders.HorizontalPlayheadSliderApplication::_createPage");
		
		this._slider = HorizontalPlayheadSlider.createSimple2ColorSlider(this._contentHolder, true, 300, 30, 1, 0xFF0000, 0xCCCCCC);
		this._slider.activate();
		this._slider.getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});