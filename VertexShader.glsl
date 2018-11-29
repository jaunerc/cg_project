attribute vec3 aVertexPosition;
attribute vec2 aVertexTextureCoord;
uniform mat4 uModelMat;
uniform mat4 uProjectionMat;
varying vec2 vTextureCoord;

void main() {
    vec4 pos = vec4(aVertexPosition, 1);
    gl_Position =  uProjectionMat * uModelMat * pos;
    vTextureCoord = aVertexTextureCoord;
}