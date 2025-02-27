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

    addFieldEditor(aField, aInitialValue, aUpdateEncoding = null) {
        let valueEditor = this.item["editor_" + aField];
        if(!valueEditor) {
            valueEditor = new Dbm.graphapi.webclient.admin.ValueEditor();
            valueEditor.item.editValue.setInitialValue(aInitialValue);

            valueEditor.item.setValue("itemEditor", this.item);
            valueEditor.item.setValue("fieldName", aField);
            valueEditor.item.setValue("updateEncoding", aUpdateEncoding);

            this.item.anyChange.addCheck(valueEditor.item.properties.changed);
            this.item.setValue("editor_" + aField, valueEditor); 
            this.item.editors = [].concat(this.item.editors, valueEditor);

            let saveFunction = function(aEditor, aItemSaveData) {
                console.log("saveFunction");
                console.log(aEditor, aItemSaveData);

                aItemSaveData.setField(aEditor.item.fieldName, aEditor.item.editValue.getValue());
            }
            //METODO: add save function
            valueEditor.addSaveFunction(saveFunction);
        }

        return valueEditor;
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
        //METODO:
    }
}