import React from "react";
import Dbm from "../../../index.js";

export default class Buttons extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }


    _renderMainElement() {

      let element = Dbm.getInstance().repository.getItem("linkListCard").element;

        return React.createElement("div", {"className": "content-narrow"},
          React.createElement("div", {"className": "flex-row small-item-spacing"},
            React.createElement(Dbm.react.area.List, {items: this.context.blockData.buttons},
              React.createElement("div", {"className": "flex-row-item"},
                React.createElement(Dbm.react.text.Link, {"href": Dbm.react.source.item("url"), "className": "custom-styled-link"},
                  React.createElement(Dbm.react.area.SwitchableArea, {"area": Dbm.react.source.item("type")},
                    React.createElement(Dbm.react.design.buttons.PrimaryButton, {"data-slot": "primary"},
                      Dbm.react.text.text(Dbm.react.source.item("text"))
                    ),
                    React.createElement(Dbm.react.design.buttons.SecondaryButton, {"data-slot": "secondary"},
                      Dbm.react.text.text(Dbm.react.source.item("text"))
                    )
                  )
                )
              )
            )
          )
        );
    }
}