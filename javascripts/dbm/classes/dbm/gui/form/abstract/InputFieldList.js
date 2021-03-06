/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A list of inpur fields.
 */
dbm.registerClass("dbm.gui.form.abstract.InputFieldList", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.form.abstract.InputFieldList");
	
	//Self reference
	var InputFieldList = dbm.importClass("dbm.gui.form.abstract.InputFieldList");
	
	//Error report
	
	//Dependencies
	var ExtendedEventValueProperty = dbm.importClass("dbm.core.objectparts.ExtendedEventValueProperty");
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	var PropertiesToArrayNode = dbm.importClass("dbm.flow.nodes.data.PropertiesToArrayNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var FormFieldExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.FormFieldExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.form.abstract.InputFieldList::_init");
		
		this.superCall();
		
		this._inputFieldsInputNode = this.addDestroyableObject(PropertiesToArrayNode.create());
		
		this._value = this.addProperty("value", ExtendedEventValueProperty.create(this._inputFieldsInputNode.getProperty("array"), FormFieldExtendedEventIds.CHANGE));
		this._value.changeToExternalEventController(this.getExtendedEvent());
		this._value.setAlwaysUpdateFlow(true);
		
		this._display = this.addProperty("display", AnyChangeMultipleInputProperty.create());
		this._display.connectInput(this._value);
		
		return this;
	};
	
	/**
	 * Gets the values of all the fields
	 *
	 * @return	Array	The values of every field.
	 */
	objectFunctions.getValue = function() {
		return this._value.getValue();
	};
	
	/**
	 * Adds a field to this list.
	 *
	 * @param	FlowBaseObject	The field or any object that has a value property.
	 */
	objectFunctions.addField = function(aField) {
		this._inputFieldsInputNode.push(aField.getProperty("value"));
	};
	
	/**
	 * Removes a field from this list.
	 *
	 * @param	FlowBaseObject	The field or any object that has a value property.
	 */
	objectFunctions.removeField = function(aField) {
		this._inputFieldsInputNode.removeByInput(aField.getProperty("value"));
	};
	
	objectFunctions.removeLastField = function() {
		this._inputFieldsInputNode.pop();
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case FormFieldExtendedEventIds.CHANGE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputFieldsInputNode = null;
		this._value = null;
		this._display = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new InputFieldList()).init();
	};
});