import React from "react";
import Dbm from "../../index.js";

export default class RequireEncoding extends Dbm.react.BaseObject {
    _constructAfterProps() {
        super._constructAfterProps();

        let loadedProperty = this.item.requireProperty("loaded", false);

        let object = this.getPropValueWithDefault("item", this.context.item);
        let encoding = this.getPropValue("encoding");

        Dbm.graphapi.webclient.requireObjectEncoding(object, encoding, Dbm.commands.setProperty(loadedProperty, true));
    }

    _renderMainElement() {

        return React.createElement(Dbm.react.area.HasData, {check: this.item.properties.loaded},
            this.getPropValue("children")
        );
    }
}

