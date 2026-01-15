import Dbm from "../../index.js";
import React from "react";

export default class MatrixFilter extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _removedUsedProps(aProps) {
        delete aProps["id"];
        delete aProps["matrix"];
    }

    _renderMainElement() {

        let id = this.getPropValue("id");
        let matrix = this.getPropValue("matrix");

        console.log(id);

        return this._createMainElement("filter", {id: id},
            React.createElement("feColorMatrix", {type: "matrix", values: matrix})
        );
    }
}