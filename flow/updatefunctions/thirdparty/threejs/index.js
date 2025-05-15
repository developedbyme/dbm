import Dbm from "../../../../index.js";

export {default as UpdateObjectPosition} from "./UpdateObjectPosition.js";

export const updateObjectPosition = function(aObject, aX = 0, aY = 0, aZ = 0, aRotationX = 0, aRotationY = 0, aRotationZ = 0, aScaleX = 1, aScaleY = 1, aScaleZ = 1) {
    let newUpdateObjectPosition = new Dbm.flow.updatefunctions.thirdparty.threejs.UpdateObjectPosition();

    let inputProperties = newUpdateObjectPosition.input.properties;
    inputProperties.object.setOrConnect(aObject);

    inputProperties.x.setOrConnect(aX);
    inputProperties.y.setOrConnect(aY);
    inputProperties.z.setOrConnect(aZ);

    inputProperties.rotationX.setOrConnect(aRotationX);
    inputProperties.rotationY.setOrConnect(aRotationY);
    inputProperties.rotationZ.setOrConnect(aRotationZ);

    inputProperties.scaleX.setOrConnect(aScaleX);
    inputProperties.scaleY.setOrConnect(aScaleY);
    inputProperties.scaleZ.setOrConnect(aScaleZ);
    
    newUpdateObjectPosition.output.properties.dynamicUpdate.startUpdating();

    return newUpdateObjectPosition;
}