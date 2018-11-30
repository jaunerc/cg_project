attribute vec3 aVertexPosition;
attribute vec2 aVertexTextureCoord;
attribute vec3 aVertexColor;

uniform mat4 uModelMat;
uniform mat4 uProjectionMat;

varying vec3 vColor;

void main() {
    vec4 pos = vec4(aVertexPosition, 1);

    vColor = aVertexPosition;

    gl_Position =  uProjectionMat * uModelMat * pos;
}