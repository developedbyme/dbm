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
	
	_internal_addProperty(aName, aProperty) {
        Object.defineProperty(this, aName, {
            get() {
                return aProperty.value;
            },
            set(aValue) {
                aProperty.value = aValue;
            }
        });
        this.properties[aName] = aProperty;
	}

    getProperty(aName) {
        if(!this.properties.hasOwnProperty(aName)) {
            let property = new Dbm.flow.FlowProperty();
			this._internal_addProperty(aName, property);
        }

        return this.properties[aName];
    }

    requireProperty(aName, aDefaultValue = null) {
        if(!this.properties.hasOwnProperty(aName)) {
            this.setValue(aName, aDefaultValue);
        }
        return this.properties[aName];
    }

    addToArray(aName, aValue) {
        let currentArray = this[aName];
        if(!currentArray) {
            this.setValue(aName, [aValue]);
        }
        else {
            currentArray = [].concat(currentArray);
            currentArray.push(aValue);
            this[aName] = currentArray;
        }

        return this;
    }

    removeFromArray(aName, aValue) {
        let currentArray = this[aName];
        if(currentArray) {
            let index = currentArray.indexOf(aValue);
            if(index !== -1) {
                currentArray = [].concat(currentArray);
                currentArray.splice(index, 1);
                this[aName] = currentArray;
            }
        }

        return this;
    }
}