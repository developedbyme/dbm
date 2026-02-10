import Dbm from "../../index.js";

export const noValidation = function(aValidation) {
    return true;
}

export const notEmpty = function(aValidation) {
    //console.log("notEmpty");

    if(aValidation.field.value && aValidation.field.value.length > 0) {
        return true;
    }
    return false;
}

export const checked = function(aValidation) {
    //console.log("notEmpty");

    if(aValidation.field.value) {
        return true;
    }
    return false;
}