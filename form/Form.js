import Dbm from "../index.js";

export default class Form extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        let all = Dbm.flow.updatefunctions.logic.all();
        this.item.requireProperty("all", all);

        this.item.requireProperty("valid", true).connectInput(all.output.properties.value);
        this.item.requireProperty("fields", new Dbm.repository.Item());
        this.item.requireProperty("fieldNames", []);
        this.item.requireProperty("defaultValidationMode", "onBlur");
    }

    addExistingField(aName, aField) {
        this.item.fields.setValue(aName, aField.item);
        this.item.all.addCheck(aField.item.properties.valid);
        this.item.addToArray("fieldNames", aName);

        return this;
    }

    createField(aName, aValue = null, aValidationFunction = null) {

        if(this.item.fields[aName]) {
            console.error("Field " + aName + " already exists");
            return this.item.fields[aName].controller;
        }

        let newField = new Dbm.form.Field();
        newField.item.value = aValue;
        newField.item.validationMode = this.item.defaultValidationMode;
        if(aValidationFunction) {
            newField.item.validation.validationFunction = aValidationFunction;
        }

        this.addExistingField(aName, newField);

        return newField;
    }

    createGroup(aName) {
        let newForm = new Dbm.form.Form();
        newForm.item.defaultValidationMode = this.item.defaultValidationMode;

        this.addExistingField(aName, newForm);

        return newForm;
    }

    validate() {
        console.log("validate");

        let currentArray = this.item.fieldNames;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentName = currentArray[i];

            let result = this.item.fields[currentName].controller.validate();
            //METODO: return the result in some format
        }

        return this.item.valid;
    }

    getValue() {
        let returnObject = {};

        let currentArray = this.item.fieldNames;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentName = currentArray[i];

            returnObject[currentName] = this.item.fields[currentName].controller.getValue();
        }

        return returnObject;
    }
}