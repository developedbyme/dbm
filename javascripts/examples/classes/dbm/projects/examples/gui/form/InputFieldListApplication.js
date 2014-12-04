/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example that shows how the input field list works.
 */
dbm.registerClass("dbm.projects.examples.gui.form.InputFieldListApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var InputFieldListApplication = dbm.importClass("dbm.projects.examples.gui.form.InputFieldListApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var InputFieldList = dbm.importClass("dbm.gui.form.abstract.InputFieldList");
	var InputField = dbm.importClass("dbm.gui.form.InputField");
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	
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
		//console.log("dbm.projects.examples.gui.form.InputFieldListApplication::_init");
		
		this.superCall();
		
		this._inputFields = new Array();
		this._inputFieldList = null;
		this._fieldsHolder = null;
		this._addButton = null;
		this._removeButton = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		//console.log("dbm.projects.examples.gui.form.InputFieldListApplication::_createPage");
		
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
		
		this._removeButton = this.addDestroyableObject(BaseButton.createButton(buttonsHolder, true, null, "Remove"));
		this._removeButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this.destroyLastField, []));
		this._removeButton.activate();
	};
	
	objectFunctions._valueUpdated = function(aValue) {
		console.log("dbm.projects.examples.gui.form.InputFieldListApplication::_valueUpdated");
		console.log(aValue);
	};
	
	objectFunctions.createNewField = function() {
		//console.log("dbm.projects.examples.gui.form.InputFieldListApplication::createNewField");
		
		var newField = InputField.createOnParent(this._fieldsHolder, true, "Field " + (this._inputFields.length+1), "text", {"style": "display: block; width: 300px;"}).activate();
		this._inputFields.push(newField);
		this._inputFieldList.addField(newField);
	};
	
	objectFunctions.destroyLastField = function() {
		//console.log("dbm.projects.examples.gui.form.InputFieldListApplication::destroyLastField");
		
		if(this._inputFields.length > 0) {
			var removeField = this._inputFields.pop();
			this._inputFieldList.removeLastField();
			removeField.destroy();
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputFields = null;
		this._inputFieldList = null;
		this._fieldsHolder = null;
		this._addButton = null;
		this._removeButton = null;
		
		this.superCall();
	};
});