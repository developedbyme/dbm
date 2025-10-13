import Dbm from "../../../index.js";

export default class MappedList extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("items", []);
        this.input.register("itemReferenceName", "forItem");
        this.input.register("newItemCommands", []);

        this.output.register("items", []);
    }

    _update() {
        console.log("MappedList::_update");

        let currentArray = this.input.items;
        let currentArrayLength = currentArray.length;

        let itemReferenceName = this.input.itemReferenceName;
        let newItemCommands = this.input.newItemCommands;

        let currentMappedList = this.output.properties.items.getValueWithoutFlow();

        let returnArray = new Array(currentArrayLength);
        for(let i = 0; i < currentArrayLength; i++) {
            let currentItem = currentArray[i];

            let index = Dbm.utils.ArrayFunctions.getItemIndexByIfExists(currentMappedList, itemReferenceName, currentItem);

            if(index !== -1) {
                returnArray[i] = currentMappedList[index];
                currentMappedList.splice(index, 1);
            }
            else {
                let newItem = new Dbm.repository.Item();
                newItem.setId("mapped_" + Dbm.getInstance().getNextId());
                newItem.setValue(itemReferenceName, currentItem);
                Dbm.commands.performCommands(newItemCommands, this, {"mappedItem": newItem, "item": currentItem, "itemReferenceName": itemReferenceName});
                returnArray[i] = newItem;
            }

            //METODO: clean up unused items
        }

        this.output.items = returnArray;
    }
}