import React from "react";
import Dbm from "../../../index.js";

export default class EditorBlockName extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let childrenAndSpacing = null;

        let slots = Dbm.react.ChildFunctions.splitIntoSlots(this.getPropValue("children"));
                
        let children = slots.main;

        let extraCss = "";
        if(children) {
            childrenAndSpacing = React.createElement("div", {"className": "flex-row admin-item-spacing"},
                React.createElement("div", {"className": "flex-no-resize flex-column"},
                    React.createElement("div", {"className": "editor-block-fields-group-line absolute-container"},
                        React.createElement("div", {"className": "editor-block-fields-group-line-binder"})
                    )
                ),
                React.createElement("div", {"className": "flex-resize"},
                    Dbm.react.spacing("small"),
                    children,
                    Dbm.react.spacing("small")
                )
            );

            extraCss = " has-fields";
        }

        return this._createMainElement("div", {"className": "editor-block-box editor-block-box-padding"},
            React.createElement("div", {"className": "editor-block-header" + extraCss},
                Dbm.react.div("flex-row",
                    React.createElement("div", {"className": "editor-block-header-label editor-block-header-padding flex-no-resize" + extraCss},
                        Dbm.react.text.text(Dbm.react.source.contextVariable("moduleData.editorData.name"))
                    ),
                    Dbm.react.div("flex-resize editor-block-header-padding",
                        Dbm.react.div("editor-block-header-description",
                            slots["description"]
                        )
                    )
                )
            ),
            childrenAndSpacing
        );
    }
}

