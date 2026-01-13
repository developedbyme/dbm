import React from "react";
import Dbm from "../../../index.js";

export default class Player extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._element = document.createElement("div");
        this._element.classList.add("vimeo-player");

        let scriptLoader = Dbm.loading.loadScript("https://player.vimeo.com/api/player.js");
        Dbm.flow.runWhenMatched(scriptLoader.item.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._scriptLoaded.bind(this)));
    }

    _removedUsedProps(aProps) {
        delete aProps["video"];
        delete aProps["responsive"];
    }

    getSettings() {

        let data = {
            responsive: this.getPropValueWithDefault("responsive", false),
            title: false,
            byline: false,
            portrait: false,
            color: "000000"
        };

        return data;
    }

    _scriptLoaded() {

        let video = this.getPropValue("video");

        let data = this.getSettings();

        if(typeof video === "number" || (typeof video === "string" && video.trim() !== "" && !isNaN(video))) {
            data["id"] = video;
        }
        else {
            data["url"] = video;
        }

        let player = new window.Vimeo.Player(this._element, data);
    }

    componentDidMount() {
        //console.log("componentDidMount");
        let parentElement = this.item.holder;
        parentElement.appendChild(this._element);
    }

    componentDidUpdate() {
        //console.log("componentDidUpdate");
        let parentElement = this.item.holder;
        parentElement.appendChild(this._element);
    }

    _renderMainElement() {
        return this._createMainElement("div", {"className": "vimeo-player-holder", "ref": this.createRef("holder")});
    }
}

