/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.experiments.splineselection.gui.Card", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.projects.experiments.splineselection.gui.Card");
	//"use strict";
	
	var Card = dbm.importClass("com.developedbyme.projects.experiments.splineselection.gui.Card");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ExternalCssVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalCssVariableProperty");
	
	objectFunctions._init = function() {
		console.log("com.developedbyme.projects.experiments.splineselection.gui.Card::_init");
		
		this.superCall();
		
		this._zIndex = this.addProperty("zIndex", ExternalCssVariableProperty.createWithoutExternalObject(this._objectProperty));
		this._updateFunctions.getObject("display").addInputConnection(this._zIndex);
		
		return this;
	};
	
	objectFunctions._connectObjectToZIndex = function() {
		this._zIndex.setupExternalObject(this._element.getValue(), "z-index", null, 1);
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this._connectObjectToZIndex();
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.projects.experiments.splineselection.gui.Card::create");
		//console.log(aElement);
		
		var newCard = (new ClassReference()).init();
		return newCard;
	};
});