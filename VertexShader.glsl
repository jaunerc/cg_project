attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec3 aVertexNormal;

uniform mat4 uModelMat;
uniform mat4 uProjectionMat;
uniform mat3 uNormalMatrix;

varying vec3 vColor;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;

void main() {
    // calculate the vertex position in eye Coordinate
    vec4 vertexPositionEye4 = uModelMat * vec4(aVertexPosition, 1.0);
    vVertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;

    // calculate the normal vector in eye coordinates
    vNormalEye = normalize(uNormalMatrix * aVertexNormal);

    // set color for fragment shaded
    vColor = aVertexColor;

    // calculate the projected position
    gl_Position = uProjectionMat * vertexPositionEye4;

    //vec4 pos = vec4(aVertexPosition, 1);

    //vColor = aVertexColor;

    //gl_Position =  uProjectionMat * uModelMat * pos;
}