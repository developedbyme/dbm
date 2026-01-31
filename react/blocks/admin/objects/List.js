import React from "react";
import Dbm from "../../../../index.js";

export default class List extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let encodings = Dbm.utils.ArrayFunctions.arrayOrSeparatedString(this.context.blockData.encodings);
        let additionalTypes = [];

        let additionalTypesString = this.context.blockData.additionalTypes;
        if(additionalTypesString) {
            additionalTypes = Dbm.utils.ArrayFunctions.arrayOrSeparatedString(additionalTypesString);
        }

        return React.createElement("div", {className: "content-narrow"}, 
            React.createElement(Dbm.react.admin.objects.ObjectList, {objectType: this.context.blockData.objectType, additionalTypes: additionalTypes, encodings: encodings, nameField: this.context.blockData.nameField, visibility: this.context.blockData.visibility})
        );
    }
}