import Dbm from "../index.js";

export default class UpdateFunctionInputs extends Dbm.core.LifeCycleObject {

    _constructProperties() {
        super._constructProperties();

        this.properties = {};
        this._cachedValues = [];
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
            this._owner.connectInput(property);

            Object.defineProperty(this, aName, {
                get() {
                    return property.value;
                },
                set(aValue) {
                    property.value = aValue;
                }
            });

            let cacheObject = {"value": aInitialValue, "property": property};
            this.properties[aName] = property;
            this._cachedValues.push(cacheObject);
        }

        return this.properties[aName];
    }

    updateValues() {
        let needsToUpdate = false;
        let currentArray = this._cachedValues;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let currentCache = currentArray[i];
            let newValue = currentCache.property.value;
            if(newValue !== currentCache.value) {
                currentCache.value = newValue;
                needsToUpdate = true;
            }
        }

        return needsToUpdate;
    }
}