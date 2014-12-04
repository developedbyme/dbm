/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.experiments.splineselection.gui.Card", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.projects.experiments.splineselection.gui.Card");
	//"use strict";
	
	var Card = dbm.importClass("dbm.projects.experiments.splineselection.gui.Card");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var ExternalCssVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalCssVariableProperty");
	
	objectFunctions._init = function() {
		console.log("dbm.projects.experiments.splineselection.gui.Card::_init");
		
		this.superCall();
		
		this._zIndex = this.addProperty("zIndex", ExternalCssVariableProperty.createWithoutExternalObject());
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
		//console.log("dbm.projects.experiments.splineselection.gui.Card::create");
		//console.log(aElement);
		
		var newCard = (new ClassReference()).init();
		return newCard;
	};
});