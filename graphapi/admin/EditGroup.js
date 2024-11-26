import Dbm from "../../index.js";

export default class EditGroup extends Dbm.core.BaseObject {
    _construct() {
        this.item.setValue("status", 0);
        let changedProperty = this.item.requireProperty("changed", false);
        this.item.setValue("showSavedMessageTimer", 0);
        this.item.setValue("editors", []);

        let any = Dbm.flow.updatefunctions.logic.any();
        this.item.setValue("any", any);

        changedProperty.connectInput(any.output.properties.value);
        
    }

    createEditor(aSavedValue) {
        let newChangeObject = null; //METODO

        newChangeObject.setValue("changed", false);

        newChangeObject.item; //METODO: connect saved value
        //METODO: setup edited value
        //METODO: set up condition

        this.item.any.addCheck(newChangeObject.item.properties.changed); //METODO: add to any


        let editors = [].concat(this.item.editors);
        editors.push(newChangeObject);
        this.item.editors = editors;
    }

    save() {

        let saveOperations = [];

        let currentArray = editors;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentChangeObject = currentArray[i];
            if(currentChangeObject.item.changed) {
                let saveOperation = null; //METODO: get save operation
                saveOperations.push(saveOperation);
            }
        }

        //METODO: trigger save operations
    }
}