import Dbm from "../../../index.js";

export {default as PartOfObject} from "./PartOfObject.js";
export {default as SingleArrayValues} from "./SingleArrayValues.js";
export {default as StringRepresentation} from "./StringRepresentation.js";

export const integerStringRepresentation = function(aInputValue = 0) {
    let representation = new Dbm.flow.controllers.transform.StringRepresentation();

    representation.item.properties.value.setOrConnect(aInputValue);

    representation.item.validationFunction = function(aStringValue) {
        if(aStringValue !== "" && !isNaN(aStringValue) && (""+Number.parseInt(aStringValue, 10) === aStringValue)) {
            return true;
        }

        return false;
    }

    representation.item.valueFormatFunction = function(aValue) {
        return Number.parseInt(aValue, 10);
    }

    return representation;
}

export const positiveIntegerStringRepresentation = function(aInputValue = 0) {
    let representation = new Dbm.flow.controllers.transform.StringRepresentation();

    representation.item.properties.value.setOrConnect(aInputValue);

    representation.item.validationFunction = function(aStringValue) {
        if(aStringValue !== "" && !isNaN(aStringValue) && (""+Number.parseInt(aStringValue, 10) === aStringValue) && (Number.parseInt(aStringValue, 10) > 0)) {
            return true;
        }

        return false;
    }

    representation.item.valueFormatFunction = function(aValue) {
        return Number.parseInt(aValue, 10);
    }

    return representation;
}