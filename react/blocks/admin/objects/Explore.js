import React from "react";
import Dbm from "../../../../index.js";

export default class Explore extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    _renderMainElement() {

        let url = new URL(document.location.href);
        let id = url.searchParams.get("id");

        return React.createElement("div", {className: "content-narrow"}, 
            React.createElement(Dbm.react.admin.objects.ExploreObject, {"id": id})
        );
    }
}