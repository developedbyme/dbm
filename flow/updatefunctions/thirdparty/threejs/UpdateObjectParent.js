import Dbm from "../../../../index.js";

export default class UpdateObjectParent extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("object", null);
        this.input.register("parent", null);
        this.input.register("added", false);

        this.output.register("dynamicUpdate", 0);
    }

    _update() {
        console.log("UpdateObjectParent::_update");

        let dynamicUpdate = this.output.dynamicUpdate;
        dynamicUpdate++;

        let object = this.input.object;
        //MENOTE: if object is changed, it doesn't remove the old one from the parent

        if(object) {
            let parent = this.input.parent;

            if(parent && this.input.added) {
                parent.add(object);
            }
            else {
                if(object.parent) {
                    object.parent.remove(object);
                }
            }
        }

        this.output.dynamicUpdate = dynamicUpdate;
    }
}