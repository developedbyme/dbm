import React from "react";
import Dbm from "../../index.js";

export default class SaveAllButton extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _save() {
        console.log("_save");

        let editorGroup = this.context.editorGroup;

        let saveData = editorGroup.getSaveData();

        saveData.save();
    }

    _renderMainElement() {
        
        let editorGroup = this.context.editorGroup;
        
        return React.createElement("div", {},   
            React.createElement("div", {className: "save-all-position"},
                React.createElement(Dbm.react.area.OpenCloseExpandableArea, {open: editorGroup.item.properties.changed},
                    React.createElement("div", {"className": "standard-button standard-button-padding", "onClick": () => {this._save()}},
                        "Save all changes"
                    )
                )
            )
        );
    }
}

