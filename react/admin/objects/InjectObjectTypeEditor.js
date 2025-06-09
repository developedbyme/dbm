import React from "react";
import Dbm from "../../../index.js";

export default class InjectObjectTypeEditor extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

   

    _renderMainElement() {

        let type = this.getPropValue("type");
        let editor = Dbm.getInstance().repository.getItem("admin/objectTypeEditors/" + type);

        let editors = editor.editors;
        if(!editors) {
            return null;
        }
        let elements = Dbm.utils.ArrayFunctions.mapField(editors, "element");

        console.log(editors, elements);

        if(!elements) {
            return null;
        }

        return React.createElement(Dbm.react.area.InsertElement, {element: elements});
    }
}