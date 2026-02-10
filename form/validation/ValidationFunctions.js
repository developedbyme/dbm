import Dbm from "../../index.js";

export const noValidation = function(aValidation) {
    return true;
}

export const notEmpty = function(aValidation) {
    console.log("notEmpty");

    console.log(aValidation.field.value);
    if(aValidation.field.value && aValidation.field.value.length > 0) {
        console.log(">>>>");
        return true;
    }
    return false;
}