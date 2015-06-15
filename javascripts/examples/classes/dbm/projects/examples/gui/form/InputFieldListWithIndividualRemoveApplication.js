/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example that shows how the input field list (that has indiviual remove buttons) works.
 */
dbm.registerClass("dbm.projects.examples.gui.form.InputFieldListWithIndividualRemoveApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var InputFieldListWithIndividualRemoveApplication = dbm.importClass("dbm.projects.examples.gui.form.InputFieldListWithIndividualRemoveApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var InputFieldList = dbm.importClass("dbm.gui.form.abstract.InputFieldList");
	var InputField = dbm.importClass("dbm.gui.form.InputField");
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var FormFieldExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.FormFieldExtendedEventIds");
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.gui.form.InputFieldListWithIndividualRemoveApplication::_init");
		
		this.superCall();
		
		this._inputFieldList = null;
		this._fieldsHolder = null;
		this._addButton = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		//console.log("dbm.projects.examples.gui.form.InputFieldListWithIndividualRemoveApplication::_createPage");
		
		this._inputFieldList = this.addDestroyableObject(InputFieldList.create());
		this._inputFieldList.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.CHANGE, CallFunctionCommand.createCommand(this, this._valueUpdated, [GetVariableObject.createSelectDataCommand()]));
		this._inputFieldList.getProperty("display").startUpdating();
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		this._fieldsHolder = htmlCreator.createDiv();
		dbm.getDocument().body.appendChild(this._fieldsHolder);
		
		this.createNewField();
		
		var buttonsHolder = htmlCreator.createDiv();
		dbm.getDocument().body.appendChild(buttonsHolder);
		
		this._addButton = this.addDestroyableObject(BaseButton.createButton(buttonsHolder, true, null, "Add"));
		this._addButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this.createNewField, []));
		this._addButton.activate();
	};
	
	objectFunctions._valueUpdated = function(aValue) {
		console.log("dbm.projects.examples.gui.form.InputFieldListWithIndividualRemoveApplication::_valueUpdated");
		console.log(aValue);
	};
	
	objectFunctions.createNewField = function() {
		//console.log("dbm.projects.examples.gui.form.InputFieldListWithIndividualRemoveApplication::createNewField");
		
		var holder =  DisplayBaseObject.createDiv(this._fieldsHolder, true);
		
		var newField = InputField.createOnParent(holder.getElement(), true, "Field " + (this._inputFieldList.getProperty("value").getValue().length+1), "text", {"style": "display: inline-block; width: 300px;"}).activate();
		this._inputFieldList.addField(newField);
		holder.addDestroyableObject(newField);
		
		var removeButton = this.addDestroyableObject(BaseButton.createButton(holder.getElement(), true, {"style": "display: inline-block;"}, "Remove"));
		removeButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this.destroyField, [newField, holder]));
		removeButton.activate();
		holder.addDestroyableObject(removeButton);
	};
	
	objectFunctions.destroyField = function(aField, aHolder) {
		//console.log("dbm.projects.examples.gui.form.InputFieldListWithIndividualRemoveApplication::destroyLastField");
		
		this._inputFieldList.removeField(aField);
		aHolder.destroy();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputFieldList = null;
		this._fieldsHolder = null;
		this._addButton = null;
		
		this.superCall();
	};
});