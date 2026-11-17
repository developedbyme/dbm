import React from "react";
import Dbm from "../../../index.js";

export default class ImageAndContent extends Dbm.react.blocks.BaseObject {

    static BLOCK_IDENTIFIER = "dbm/v1/section/imageAndContent";

    _construct() {
        super._construct();

        
    }

    _renderMainElement() {

      let image = Dbm.objectPath(this.context, "blockData.image");

      let blocks = Dbm.objectPath(this.context, "blockData.content.blocks");

      let pageContent = Dbm.getRepositoryItem("contentBlock").element;

      let content = blocks ? Dbm.react.AddProps.el({blocks: blocks}, pageContent) : React.createElement("div", {"data-error": "no blocks set"});

      return this._createMainElement("div", {"className": "centered-site"},
        Dbm.react.area.Layout.el({"layout": "mobile"},
          Dbm.react.image.WidthScaledImage.el({image: image, targetWidth: 400, "className": "image-and-content-section-image"}),
          Dbm.react.spacing("standard"),
          content
        ),
        Dbm.react.area.Layout.el({"layout": "desktop,tablet"},
          Dbm.react.div("flex-row halfs big-item-spacing",
            Dbm.react.image.WidthScaledImage.el({image: image, targetWidth: 600, "className": "image-and-content-section-image"}),
            Dbm.react.div("flex-column",
              Dbm.react.div("flex-resize"),
              Dbm.react.div("flex-no-resize",
                content
              ),
              Dbm.react.div("flex-resize half")
            ),
          )
        )
      );
    }
}