import Dbm from "../index.js";

export default class Item extends Dbm.core.LifeCycleObject {
    _constructProperties() {
        super._constructProperties();

        this._id = null;

        this.properties = {};
    }

    get id() {
        return this._id;
    }

    register(aId) {
        this.setId(aId);
        Dbm.getInstance().repository.addItem(this);

        return this;
    }

    setId(aId) {
        this._id = aId;

        return this;
    }

    setValue(aName, aValue) {
        this.getProperty(aName).value = aValue;
        
        return this;
    }

    propertyInput(aName, aFlowProperty) {
        this.getProperty(aName).connectInput(aFlowProperty);

        return this;
    }

    propertyOutput(aName, aFlowProperty) {
        aFlowProperty.connectInput(this.getProperty(aName));

        return this;
    }

    getProperty(aName) {
        if(!this.properties.hasOwnProperty(aName)) {
            let property = new Dbm.flow.FlowProperty();
            Object.defineProperty(this, aName, {
                get() {
                    return property.value;
                },
                set(aValue) {
                    property.value = aValue;
                }
            });
            this.properties[aName] = property;
        }

        return this.properties[aName];
    }

    requireProperty(aName, aDefaultValue = null) {
        if(!this.properties.hasOwnProperty(aName)) {
            this.setValue(aName, aDefaultValue);
        }
        return this.properties[aName];
    }
}