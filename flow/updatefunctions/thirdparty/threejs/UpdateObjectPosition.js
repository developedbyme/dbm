import Dbm from "../../../../index.js";

export default class UpdateObjectPosition extends Dbm.flow.FlowUpdateFunction {

    _construct() {
        super._construct();
        
        this.input.register("object", null);
        this.input.register("x", 0);
        this.input.register("y", 0);
        this.input.register("z", 0);

        this.input.register("rotationX", 0);
        this.input.register("rotationY", 0);
        this.input.register("rotationZ", 0);

        this.input.register("scaleX", 1);
        this.input.register("scaleY", 1);
        this.input.register("scaleZ", 1);

        this.output.register("dynamicUpdate", 0);
    }

    _update() {
        //console.log("UpdateObjectPosition::_update");

        let dynamicUpdate = this.output.dynamicUpdate;
        dynamicUpdate++;

        let object = this.input.object;

        if(object) {
            object.position.x = this.input.x;
            object.position.y = this.input.y;
            object.position.z = this.input.z;

            object.rotation.x = this.input.rotationX;
            object.rotation.y = this.input.rotationY;
            object.rotation.z = this.input.rotationZ;

            object.scale.x = this.input.scaleX;
            object.scale.y = this.input.scaleY;
            object.scale.z = this.input.scaleY;
        }

        this.output.dynamicUpdate = dynamicUpdate;
    }
}