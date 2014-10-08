/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Holder for a template with commands.
 */
dbm.registerClass("com.developedbyme.utils.templates.TemplateWithCommands", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.templates.TemplateWithCommands");
	//"use strict";
	
	//Self reference
	var TemplateWithCommands = dbm.importClass("com.developedbyme.utils.templates.TemplateWithCommands");
	
	//Error report
	
	//Dependencies
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	//Utils
	var DomManipulationFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomManipulationFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.templates.TemplateWithCommands::_init");
		
		this.superCall();
		
		this._template = null;
		this.getExtendedEvent().createEvent(GenericExtendedEventIds.NEW);
		
		return this;
	}; //End function _init
	
	/**
	 * Sets the template for this holder.
	 * 
	 * @param	aTemplate	HTMLElement	The HTML template to use when generating a new item.
	 *
	 * @return	self
	 */
	objectFunctions.setTemplate = function(aTemplate) {
		//console.log("com.developedbyme.utils.templates.TemplateWithCommands::setTemplate");
		//console.log(aTemplate);
		
		this._template = aTemplate;
		
		return this;
	}; //End function setTemplate
	
	/**
	 * Creates a new item from this template and applies all commands to it.
	 *
	 * @param	aData	*	The data to apply to the template.
	 *
	 * @return	HTMLElement		The new item.
	 */
	objectFunctions.createNewItem = function(aData) {
		//console.log("com.developedbyme.utils.templates.TemplateWithCommands::createNewItem");
		//console.log(aData);
		
		var newElement = DomManipulationFunctions.cloneNode(this._template, true);
		
		var commandData = NamedArray.create(false);
		commandData.addObject("output", newElement);
		commandData.addObject("data", aData);
		this.getExtendedEvent().perform(GenericExtendedEventIds.NEW, commandData);
		
		return newElement;
	}; //End function createNewItem
	
	/**
	 * Sets all the refernences to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._template = null;
		
		this.superCall();
	}; //End function setAllReferencesToNull
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aTemplate	HTMLElement	The HTML template to use when generating a new item.
	 *
	 * @return	TemplateWithCommands	The newly created object.
	 */
	staticFunctions.create = function(aTemplate) {
		var newTemplateWithCommands = (new TemplateWithCommands()).init();
		newTemplateWithCommands.setTemplate(aTemplate);
		return newTemplateWithCommands;
	}; //End function create
});