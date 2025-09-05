import Dbm from "../../index.js";

export default class NumberDisplay extends Dbm.react.BaseObject {
    _construct() {
        super._construct();
    }

    render() {
        let text = this.getPropValue("number");
        let number = 1*text;

        if(!isNaN(number)) {

            let offset = this.getPropValueWithDefault("offset", 0);
            if(offset) {
                number += offset;
            }
            

            if("numberOfDecimals" in this.props) {
                text = number.toFixed(this.getPropValue("numberOfDecimals"));
            }
            else {
                text = "" + number;
            }
        }

        return text;
    }
}