import React from "react";
import Dbm from "../../../index.js";

export default class ObjectListRow extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {
        
        let id = this.getPropValue("id");
        let text = this.getPropValue("text");

        let baseUrl = "/admin/items/item/edit/?id={id}";
        let url = baseUrl.split("{id}").join(id);

        return React.createElement("div", {"className": "standard-row"},
            React.createElement(Dbm.react.text.Link, {"href": url, "className": "custom-styled-link hover-row"},
                React.createElement("div", {"className": "standard-row-padding"},
                    React.createElement("div", {"className": "flex-row small-item-spacing"},
                        React.createElement("div", {"className": "flex-row-item flex-no-resize"},
                            Dbm.react.text.text(id),
                        ),
                        React.createElement("div", {"className": "flex-row-item flex-resize"},
                            Dbm.react.text.text(text)
                        ),
                        React.createElement("div", {"className": "flex-row-item flex-no-resize"},
                            ">"
                        ),
                    )
                )
            )
        );
    }
}