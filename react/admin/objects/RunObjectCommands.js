import React from "react";
import Dbm from "../../../index.js";

export default class RunObjectCommands extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("status", "edit");
        this.getDynamicProp("id");
        this.item.requireProperty("changes", "[]");
    }

    _runCommand() {
        let changes;

        try{
            changes = JSON.parse(this.item.changes);
        }
        catch(theError) {
            console.log("Could not parse json", theError, theError.message);
            alert("Could no parse command");
        }

        if(changes) {
            let id = 1*this.getPropValue("id");
            //METODO: run command
            let graphApi = Dbm.getInstance().repository.getItem("graphApi").controller;

            let request = graphApi.editItem(id, changes);

            this.item.status = "running";
            Dbm.flow.addUpdateCommandWhenMatched(request.properties.status, 1, Dbm.commands.callFunction(this._edited.bind(this), [request]));
        }
    }

    _edited(aRequest) {
        console.log("_edited");
        console.log(aRequest);

        this.item.status = "edit";
    }

    _renderMainElement() {

        let id = this.getPropValue("id");

        return React.createElement("div", {},
            React.createElement(Dbm.react.form.FormField, {value: this.getDynamicProp("id")}),
            React.createElement(Dbm.react.form.TextArea, {value: this.item.properties.changes}),
            React.createElement("div", {"className": "standard-button standard-button-padding", "onClick": () => {this._runCommand()}},
                                        "Run"
                                    )
        )
    }
}