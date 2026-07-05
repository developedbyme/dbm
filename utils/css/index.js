import Dbm from "../../index.js";

export {default as AddStyles} from "./AddStyles.js";

export const getGlobalCss = function() {

    let globalStyling = Dbm.repository.getControllerIfExists("globalCss");
    
    if(!globalStyling) {
        globalStyling = new Dbm.utils.css.AddStyles();
        globalStyling.item.register("globalCss");
    }
    
    return globalStyling;
}

export const setupGlobalColoring = function() {
    let globalStyling = getGlobalCss();
    globalStyling.createHeadElement();
    globalStyling.item.element.id = "dbm-global-styles";

    let colorFilters = Dbm.getRepositoryItem("globalSvg");
    let filtersProperty = colorFilters.requireProperty("filters", []);
    
    let globalFilterStyling = new Dbm.utils.css.AddStyles();
    globalFilterStyling.item.properties.styles.connectInput(filtersProperty);
    globalFilterStyling.createHeadElement();
    globalFilterStyling.item.element.id = "dbm-global-filter-styles";
}

export const addGlobalHexColor = function(aName, aColor) {
    let globalStyling = getGlobalCss();

    //METODO: add css variable

    globalStyling.createGroupedStyle("text-color", aName, "color: " + aColor);
    globalStyling.createGroupedStyle("background-color", aName, "background-color: " + aColor);
    globalStyling.createGroupedStyle("border-color", aName, "border-color: " + aColor);

    Dbm.react.svg.addGlobalHexColorFilter(aName, aColor);
}