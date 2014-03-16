/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.data.TemporaryTimelineHolder", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.data.TemporaryTimelineHolder");
	
	var TemporaryTimelineHolder = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.data.TemporaryTimelineHolder");
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var ExternalCssVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalCssVariableProperty");
	
	var CssFunctions = dbm.importClass("com.developedbyme.utils.css.CssFunctions");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.data.TemporaryTimelineHolder::_init");
		
		this.superCall();
		
		this.theObject = null;
		this._timelines = new Array();
		
		return this;
	};
	
	objectFunctions.getProperty = function(aName) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.data.TemporaryTimelineHolder::getProperty");
		if(this._properties.select(aName)) {
			return this._properties.currentSelectedItem;
		}
		var newProperty = ExternalVariableProperty.create(this._objectProperty, this.theObject, aName);
		newProperty.setValue(this.theObject[newProperty]);
		newProperty.name = this.__className + "::" + aName + "(e)";
		this._properties.addObject(aName, newProperty);
		
		var newTimeline = dbm.singletons.dbmAnimationManager.createTimeline(this.theObject[newProperty], newProperty);
		this._timelines.push(newTimeline);
		
		newProperty.startUpdating();
		return newProperty;
	};
	
	objectFunctions.getCssProperty = function(aName) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.data.TemporaryTimelineHolder::getProperty");
		if(this._properties.select(aName)) {
			return this._properties.currentSelectedItem;
		}
		
		var theUnit = null;
		if(CssFunctions.isLengthProperty(aName)) {
			theUnit = "px";
		}
		
		var newProperty = ExternalCssVariableProperty.create(this._objectProperty, this.theObject, aName, theUnit);
		newProperty.name = this.__className + "::" + aName + "(css)";
		//METODO: set start value
		//var cssDeclaration = aHtmlElement.ownerDocument.defaultView.getComputedStyle(aHtmlElement);
		//var currentValue = cssDeclaration.getPropertyValue(aVariable);
		this._properties.addObject(aName, newProperty);
		
		var newTimeline = dbm.singletons.dbmAnimationManager.createTimeline(newProperty.getValue(), newProperty);
		this._timelines.push(newTimeline);
		
		newProperty.startUpdating();
		return newProperty;
	};
	
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyArrayIfExists(this._timelines);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.theObject = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObject) {
		var newTemporaryTimelineHolder = (new ClassReference()).init();
		newTemporaryTimelineHolder.theObject = aObject;
		return newTemporaryTimelineHolder;
	};
});