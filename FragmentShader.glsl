precision mediump float;

uniform sampler2D uSampler;
uniform vec4 uColor;


varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor.rgb, 1);
}