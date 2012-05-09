attribute vec3 vertexPosition;
attribute vec4 vertexColor;

uniform mat4 transformationMatrix;
uniform mat4 projectionMatrix;

varying vec4 outputVertexColor;

void main(void) {
	gl_Position = projectionMatrix * transformationMatrix * vec4(vertexPosition, 1.0);
	outputVertexColor = vertexColor;
}