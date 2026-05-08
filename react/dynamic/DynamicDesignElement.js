import Dbm from "../../index.js";
import React from "react";

export default class DynamicDesignElement extends Dbm.react.BaseObject {

    _construct() {
        super._construct();
        this.item.requireProperty("structure", null);
        this._setupDesignElements();

        //METODO: setup dynamic props
    }

    _setupDesignElements() {
        //MENOTE: dynamically overridden
    }

    _renderMainElement() {
        //METODO: link dynamic props
        return React.createElement(Dbm.react.context.AddContextVariables, {"values": {"children": this.getPropValue("children")}},
            this._mainElement(this.item.structure.element)
        )
    }
}