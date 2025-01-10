import Dbm from "../../index.js";

export {default as InsertElement} from "./InsertElement.js";
export {default as HasData} from "./HasData.js";
export {default as ScrollActivatedArea} from "./ScrollActivatedArea.js";
export {default as OpenCloseExpandableArea} from "./OpenCloseExpandableArea.js";
export {default as ResponsiveLayout} from "./ResponsiveLayout.js";

export let responsiveLayout = function(aDefaultLayout) {
    let newResponsiveLayout = new Dbm.react.area.ResponsiveLayout();
    newResponsiveLayout.setDefaultLayout(aDefaultLayout);

    return newResponsiveLayout;
}