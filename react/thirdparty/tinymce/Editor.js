import React from "react";
import Dbm from "../../../index.js";

export default class Editor extends Dbm.react.BaseObject {
    _construct() {
        super._construct();

        this._element = document.createElement("div");
        this._editor = null;

        let valueProperty = this.getDynamicPropWithoutState("value", "");
        Dbm.flow.addUpdateCommand(valueProperty, Dbm.commands.callFunction(this._valueUpdated.bind(this)));

        this._callback_changeBound = this._callback_change.bind(this);

        let tinymce = Dbm.getRepositoryItem("tinymce");
        let version = tinymce.version ? tinymce.version : "8";

        let scriptLoader = Dbm.loading.loadScript("https://cdn.tiny.cloud/1/" + tinymce.key + "/tinymce/" + version + "/tinymce.min.js");
        Dbm.flow.runWhenMatched(scriptLoader.item.properties.status, Dbm.loading.LoadingStatus.LOADED, Dbm.commands.callFunction(this._scriptLoaded.bind(this)));
    }

    getSettings() {
        let settings = {
            menubar: false,
            statusbar: false,

            convert_urls: false,
            relative_urls: false,
            remove_script_host: false,
            verify_url: false,

            plugins: "link image code autoresize advlist lists",
			toolbar: "undo redo | styleselect | bold italic | link | alignleft aligncenter alignright | numlist bullist | code removeformat | fontsizeselect"
        };

        return settings;
    }

    _scriptLoaded() {

        let settings = this.getSettings();

        settings["target"] = this._element;
        settings["setup"] = this._callback_setup.bind(this);

        window.tinymce.init(settings);
    }

    _callback_setup(aEditor) {
        this._editor = aEditor;

        this._editor.on('change', this._callback_change.bind(this));
        this._editor.on('input', this._callback_change.bind(this));
        this._editor.on('init', this._callback_init.bind(this));
    }

    _callback_init() {
        let value = this.getDynamicProp("value").value;
        if(value) {
            this._editor.setContent(value);
        }
        
    }

    _callback_change() {
        //console.log("_callback_change");

        let value = this._editor.getContent();

        this.getDynamicProp("value").getMostUpstreamProperty().setValue(value);
    }

    _valueUpdated() {
        //console.log("_valueUpdated");
        let value = this.getPropValue("value");

        if(this._editor) {
            let currentValue = this._editor.getContent();

            if(value !== currentValue && value !== undefined && value !== null) {
                this._editor.setContent(value);
            }
        }
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

        return this._createMainElement("div", {},
            React.createElement("div", {"ref": this.createRef("holder")})
        );
    }
}

