export default class RefToProperty {
    constructor() {
        this.property = null;
    }

    get current() {
        return this.property.value;
    }

    set current(aValue) {
        this.property.value = aValue;
    }

    hasOwnProperty(aKey) {
        if(aKey === "current") {
            return true;
        }
        return super.hasOwnProperty(aKey);
    }
}