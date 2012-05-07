attribute vec3 vertexPosition;

uniform mat4 transformationMatrix;
uniform mat4 projectionMatrix;

void main(void) {
    gl_Position = projectionMatrix * transformationMatrix * vec4(vertexPosition, 1.0);
}