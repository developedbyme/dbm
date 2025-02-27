import Dbm from "../../../index.js";

export default class EditorGroup extends Dbm.core.BaseObject {

    _construct() {
        super._construct();

        this.item.requireProperty("status", "none");
        this.item.requireProperty("editors", []);

        let anyChange = Dbm.flow.updatefunctions.logic.any();
        
        this.item.requireProperty("anyChange", anyChange);
        this.item.requireProperty("changed", false).connectInput(anyChange.output.properties.value);
    }

    getItemEditor(aId) {
        let itemEditor = this.item["editor_" + aId];
        if(!itemEditor) {
            itemEditor = new Dbm.graphapi.webclient.admin.ItemEditor();
            itemEditor.item.setValue("editedItem", Dbm.getInstance().repository.getItem(aId));
            this.item.setValue("editor_" + aId, itemEditor); 
            this.item.editors = [].concat(this.item.editors, itemEditor);
        }

        return itemEditor;
    }

    addCommandsToSaveData(aSaveData) {

        aSaveData.addStartCommand(Dbm.commands.setProperty(this.item.properties.status, "loading"));

        let currentArray = this.item.editors;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentEditor = currentArray[i];
            
            if(currentEditor.item.changed) {
                currentEditor.addCommandsToSaveData(aSaveData);
            }
            
        }

        aSaveData.addSavedCommand(Dbm.commands.setProperty(this.item.properties.status, "none"));
    }

    getSaveData() {
        let saveData = new Dbm.graphapi.webclient.admin.SaveData();
        this.addCommandsToSaveData(saveData);
        return saveData;
    }

    save() {
        let saveData = this.getSaveData();
        console.log(saveData);
        //METODO:
    }
}