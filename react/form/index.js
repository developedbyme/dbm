import Dbm from "../../index.js";
import React from "react";

export {default as Checkbox} from "./Checkbox.js";
export {default as FormField} from "./FormField.js";
export {default as LabelledArea} from "./LabelledArea.js";
export {default as FileDropArea} from "./FileDropArea.js";
export {default as Selection} from "./Selection.js";
export {default as GraphApiObjectSelection} from "./GraphApiObjectSelection.js";
export {default as GraphApiSelectOrCreateObject} from "./GraphApiSelectOrCreateObject.js";
export {default as GraphApiImage} from "./GraphApiImage.js";
export {default as EditArray} from "./EditArray.js";
export {default as TextArea} from "./TextArea.js";
export {default as EditObjectProperty} from "./EditObjectProperty.js";
export {default as Form} from "./Form.js";
export {default as Option} from "./Option.js";
export {default as Dropdown} from "./Dropdown.js";
export {default as GraphApiObjectOptions} from "./GraphApiObjectOptions.js";

export const fieldWithValidation = function(aFieldName, aPlaceHolderText = null, aClasses = "standard-field standard-field-padding full-width") {
    let returnElement = React.createElement(Dbm.react.context.AddItemToContext, {item: Dbm.react.source.contextVariable("form.fields." + aFieldName), as: "field"},
        React.createElement(Dbm.react.AddProps, {className: Dbm.react.source.contextVariable("field.properties.validationState")},
            React.createElement(Dbm.react.form.FormField, {
                value: Dbm.react.source.contextVariable("field.properties.value"),
                editing: Dbm.react.source.contextVariable("field.properties.editing"),
                className: aClasses,
                placeholder: aPlaceHolderText
            })
        )
    )

    return returnElement;
}