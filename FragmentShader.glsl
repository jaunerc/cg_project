precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 uColor;

void main() {
    gl_FragColor = uColor;
}