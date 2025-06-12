import Dbm from "../../../index.js";

export default class ItemEditor extends Dbm.core.BaseObject {

    _construct() {
        super._construct();

        this.item.requireProperty("status", "none");
        this.item.requireProperty("editors", []);

        let anyChange = Dbm.flow.updatefunctions.logic.any();
        
        this.item.requireProperty("anyChange", anyChange);
        this.item.requireProperty("changed", false).connectInput(anyChange.output.properties.value);
    }

    getEditor(aField) {
        return this.item["editor_" + aField];
    }

    addEditor(aName, aInitialValue, aSaveFunction, aUpdateEncoding = null) {
        let valueEditor = this.item["editor_" + aName];
        if(!valueEditor) {
            valueEditor = new Dbm.graphapi.webclient.admin.ValueEditor();
            valueEditor.item.editValue.setInitialValue(aInitialValue);

            valueEditor.item.setValue("itemEditor", this.item);
            valueEditor.item.setValue("name", aName);
            valueEditor.item.setValue("updateEncoding", aUpdateEncoding);

            this.item.anyChange.addCheck(valueEditor.item.properties.changed);
            this.item.setValue("editor_" + aName, valueEditor); 
            this.item.editors = [].concat(this.item.editors, valueEditor);
            
            valueEditor.addSaveFunction(aSaveFunction);
        }

        return valueEditor;
    }

    addFieldEditor(aField, aInitialValue, aUpdateEncoding = null) {
        return this.addEditor(aField, aInitialValue, Dbm.graphapi.webclient.admin.SaveFunctions.setField, aUpdateEncoding);
    }

    _addRelationEditor(aName, aType, aObjectType, aInitialValue, aSaveFunction, aUpdateEncoding = null) {
        let valueEditor = this.item["editor_relation_" + aName];
        if(!valueEditor) {
            valueEditor = new Dbm.graphapi.webclient.admin.ValueEditor();
            valueEditor.item.editValue.setInitialValue(aInitialValue);

            valueEditor.item.setValue("itemEditor", this.item);
            valueEditor.item.setValue("type", aType);
            valueEditor.item.setValue("objectType", aObjectType);
            valueEditor.item.setValue("updateEncoding", aUpdateEncoding);

            this.item.anyChange.addCheck(valueEditor.item.properties.changed);
            this.item.setValue("editor_relation_" + aName, valueEditor); 
            this.item.editors = [].concat(this.item.editors, valueEditor);
            
            valueEditor.addSaveFunction(aSaveFunction);
        }

        return valueEditor;
    }

    addIncomingRelationEditor(aType, aObjectType, aInitialValue, aUpdateEncoding = null) {
        let name = "in_" + aType + "_" + aObjectType;
        return this._addRelationEditor(name, aType, aObjectType, aInitialValue, Dbm.graphapi.webclient.admin.SaveFunctions.incomingRelation, aUpdateEncoding);
    }

    addOutgoingRelationEditor(aType, aObjectType, aInitialValue, aUpdateEncoding = null) {
        let name = "out_" + aType + "_" + aObjectType;
        return this._addRelationEditor(name, aType, aObjectType, aInitialValue, Dbm.graphapi.webclient.admin.SaveFunctions.outgoingRelation, aUpdateEncoding);
    }

    addCommandsToSaveData(aSaveData) {

        let editedItemId = Dbm.objectPath(this.item, "editedItem.id");
        let itemSaveData = aSaveData.getItemSaveData(editedItemId);

        let currentArray = this.item.editors;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentEditor = currentArray[i];
            
            if(currentEditor.item.changed) {
                currentEditor.addCommandsToSaveData(aSaveData);
            }
        }

        itemSaveData.addStartCommand(Dbm.commands.setProperty(this.item.properties.status, "loading"));
        itemSaveData.addSavedCommand(Dbm.commands.setProperty(this.item.properties.status, "none"));
    }

    getSaveData() {
        let saveData = new Dbm.graphapi.webclient.admin.SaveData();
        this.addCommandsToSaveData(saveData);
        return saveData;
    }

    save() {
        let saveData = this.getSaveData();
        saveData.save();
    }
}