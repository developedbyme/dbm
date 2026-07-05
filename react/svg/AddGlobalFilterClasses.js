import Dbm from "../../index.js";

export default class AddGlobalFilterClasses extends Dbm.utils.css.AddStyles {

    _construct() {
        //METODO: this does not need to be it's own class
        super._construct();

        this.createHeadElement();

        let colorFilters = Dbm.getRepositoryItem("globalSvg");
        let filtersProperty = colorFilters.requireProperty("filters", []);

        this.item.properties.styles.connectInput(filtersProperty);
    }
}