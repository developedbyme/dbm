import Dbm from "../../../index.js";

export default class EditMultipleValues extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("editValues", {}); 

        let anyChange = Dbm.flow.updatefunctions.logic.any();

        this.item.requireProperty("anyChange", anyChange);
        this.item.requireProperty("changed", false).connectInput(anyChange.output.properties.value);

    }

    get editors() {
        return this.item.editValues;
    }

    _createEditValue(aName) {

        let editValue = new Dbm.flow.controllers.edit.EditValue();

        this.addEditor(aName, editValue);  

        return editValue;
    }

    addEditor(aName, aEditor) {
        let editValues = {...this.item.editValues};
        editValues[aName] = aEditor;

        this.item.anyChange.addCheck(aEditor.item.properties.changed);

        this.item.editValues = editValues;

        return this;
    }

    getEditorIfExists(aName) {
        let editValues = this.item.editValues;
        if(editValues[aName]) {
            return editValues[aName];
        }

        return null;
    }

    getEditor(aName) {
        let editValue = this.getEditorIfExists(aName);
        if(!editValue) {
            editValue = this._createEditValue(aName);
        }

        return editValue;
    }
}