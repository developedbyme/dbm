/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example that shows an input field list that auto adds fields as you start typing.
 */
dbm.registerClass("com.developedbyme.projects.examples.gui.form.InputFieldListWithAutoAddApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var InputFieldListWithAutoAddApplication = dbm.importClass("com.developedbyme.projects.examples.gui.form.InputFieldListWithAutoAddApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var InputFieldList = dbm.importClass("com.developedbyme.gui.form.abstract.InputFieldList");
	var InputField = dbm.importClass("com.developedbyme.gui.form.InputField");
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	var ValueInArrayNode = dbm.importClass("com.developedbyme.flow.nodes.data.ValueInArrayNode");
	var SubtractionNode = dbm.importClass("com.developedbyme.flow.nodes.math.SubtractionNode");
	var LengthOfArrayNode = dbm.importClass("com.developedbyme.flow.nodes.data.LengthOfArrayNode");
	var ConditionNode = dbm.importClass("com.developedbyme.flow.nodes.logic.ConditionNode");
	var BooleanSwitchedNode = dbm.importClass("com.developedbyme.flow.nodes.logic.BooleanSwitchedNode");
	var ExtendedEventProperty = dbm.importClass("com.developedbyme.core.objectparts.ExtendedEventProperty");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var FormFieldExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.FormFieldExtendedEventIds");
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.gui.form.InputFieldListWithAutoAddApplication::_init");
		
		this.superCall();
		
		this._inputFields = new Array();
		this._inputFieldList = null;
		this._fieldsHolder = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		//console.log("com.developedbyme.projects.examples.gui.form.InputFieldListWithAutoAddApplication::_createPage");
		
		this._inputFieldList = this.addDestroyableObject(InputFieldList.create());
		this._inputFieldList.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.CHANGE, CallFunctionCommand.createCommand(this, this._valueUpdated, [GetVariableObject.createSelectDataCommand()]));
		this._inputFieldList.getProperty("display").startUpdating();
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		this._fieldsHolder = htmlCreator.createDiv();
		dbm.getDocument().body.appendChild(this._fieldsHolder);
		
		this.createNewField();
		
		var lengthOfArrayNode = LengthOfArrayNode.create(this._inputFieldList.getProperty("value"));
		var lastPositionNode = SubtractionNode.create(lengthOfArrayNode.getProperty("length"), 1);
		var secondToLastPositionNode = SubtractionNode.create(lengthOfArrayNode.getProperty("length"), 2);
		
		var lastValueNode = ValueInArrayNode.create(this._inputFieldList.getProperty("value"), lastPositionNode.getProperty("outputValue"));
		var secondToLastValueNode = ValueInArrayNode.create(this._inputFieldList.getProperty("value"), secondToLastPositionNode.getProperty("outputValue"));
		
		var lastValueIsNotEmptyNode = ConditionNode.create("!==", lastValueNode.getProperty("outputValue"), "");
		var secondToLastValueIsEmptyNode = ConditionNode.create("===", secondToLastValueNode.getProperty("outputValue"), "");
		
		var removeStateNode = BooleanSwitchedNode.create(secondToLastValueIsEmptyNode.getProperty("outputValue"), "remove", "normal");
		var addStateNode = BooleanSwitchedNode.create(lastValueIsNotEmptyNode.getProperty("outputValue"), "add", removeStateNode.getProperty("outputValue"));
		
		var commandProperty = ExtendedEventProperty.create(addStateNode.getProperty("outputValue")).startUpdating();
		this.addProperty("commands", commandProperty);
		
		commandProperty.getExtendedEvent().addCommandToEvent("add", CallFunctionCommand.createCommand(this, this.createNewField, []));
		commandProperty.getExtendedEvent().addCommandToEvent("remove", CallFunctionCommand.createCommand(this, this.destroyLastField, []));
	};
	
	objectFunctions._valueUpdated = function(aValue) {
		console.log("com.developedbyme.projects.examples.gui.form.InputFieldListWithAutoAddApplication::_valueUpdated");
		console.log(aValue);
	};
	
	objectFunctions.createNewField = function() {
		console.log("com.developedbyme.projects.examples.gui.form.InputFieldListWithAutoAddApplication::createNewField");
		
		var newField = InputField.createOnParent(this._fieldsHolder, true, "Field " + (this._inputFields.length+1), "text", {"style": "display: block; width: 300px;"}).activate();
		this._inputFields.push(newField);
		this._inputFieldList.addField(newField);
	};
	
	objectFunctions.destroyLastField = function() {
		console.log("com.developedbyme.projects.examples.gui.form.InputFieldListWithAutoAddApplication::destroyLastField");
		
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