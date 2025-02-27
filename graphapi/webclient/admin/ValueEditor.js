import Dbm from "../../../index.js";

export default class ValueEditor extends Dbm.core.BaseObject {

    _construct() {
        super._construct();

        this.item.requireProperty("status", "none");
        this.item.requireProperty("saveCommands", []);

        let editValue = new Dbm.flow.controllers.edit.EditValue();
        this.item.setValue("editValue", editValue);

        this.item.requireProperty("changed", false).connectInput(editValue.item.properties.changed);
    }

    addSaveCommand(aCommand) {

        this.item.saveCommands = [].concat(this.item.saveCommands, aCommand);

        return this;
    }

    addSaveFunction(aFunction) {
        this.addSaveCommand(Dbm.commands.callFunction(aFunction, [Dbm.core.source.fromObject(), Dbm.core.source.event()]));

        return this;
    }

    addCommandsToSaveData(aSaveData) {

        let editedItemId = Dbm.objectPath(this.item, "itemEditor.editedItem.id");
        let itemSaveData = aSaveData.getItemSaveData(editedItemId);

        let currentArray = this.item.saveCommands;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentCommand = currentArray[i];
            currentCommand.perform(this, itemSaveData);
        }

        if(this.item.updateEncoding) {
            itemSaveData.addUpdateEncoding(this.item.updateEncoding);
        }

        itemSaveData.addSavedCommand(this.item.editValue.getStoreCommand());
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