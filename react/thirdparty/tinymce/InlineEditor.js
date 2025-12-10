import React from "react";
import Dbm from "../../../index.js";

export default class InlineEditor extends Dbm.react.thirdparty.tinymce.Editor {
    _construct() {
        super._construct();
    }

    getSettings() {
        let settings = super.getSettings();
        
        let additionalSettings = {
            inline: true,
            toolbar: false,
            plugins: 'link quickbars',
            quickbars_selection_toolbar: 'bold italic | link',
            quickbars_insert_toolbar: false,
        };

        settings = {
            ...settings,
            ...additionalSettings
        }

        return settings;
    }
}

