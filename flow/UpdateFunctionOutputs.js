import Dbm from "../index.js";

export default class UpdateFunctionOutputs extends Dbm.core.LifeCycleObject {

    _constructProperties() {
        super._constructProperties();

        this.properties = {};
        this._propertiesList = [];
        this._owner = null;

    }

    setOwner(aOwner) {

        this._owner = aOwner;

        return this;
    }

    register(aName, aInitialValue = null) {
        if(!this.properties.hasOwnProperty(aName)) {
            let property = new Dbm.flow.FlowProperty();
            property.value = aInitialValue;
            this._owner.connectOutput(property);

            Object.defineProperty(this, aName, {
                get() {
                    return property.value;
                },
                set(aValue) {
                    property._internal_setValueInFlow(aValue);
                }
            });

            this.properties[aName] = property;
            this._propertiesList.push(property);
        }

        return this.properties[aName];
    }

    markAsClean() {
        let currentArray = this._propertiesList;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentProperty = currentArray[i];
            currentProperty.isDirty = false;
        }
    }
}