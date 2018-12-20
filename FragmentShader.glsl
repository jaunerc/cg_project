precision mediump float;

uniform bool uEnableLighting;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;

varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;

varying vec3 vColor;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

const float ambientFactor = 0.5;
const float shininess = 10.0;
const vec3 specularMaterialColor = vec3(0.4, 0.4, 0.4);

void main() {
    //gl_FragColor = vec4(vColor.rgb, 1);

    vec3 baseColor = vColor;

    if (uEnableLighting) {
        // calculate light direction as seen from the vertex position
        vec3 lightDirectionEye = uLightPosition - vVertexPositionEye3;
        vec3 normal = normalize(vNormalEye);

        // ambient lighting
        vec3 ambientColor = ambientFactor * baseColor.rgb;

        // diffuse lighting
        float diffuseFactor = 1.0;
        float cos_angle = dot(normal, lightDirectionEye);
        cos_angle = clamp(cos_angle, 0.0, 1.0);
        vec3 diffuseColor = baseColor.rgb * cos_angle;

        // specular lighting
        vec3 specularColor = vec3(0, 0, 0);
        if (diffuseFactor > 0.0) {
            vec3 reflectionDir = normalize(2.0 * dot(normal, lightDirectionEye) * normal - lightDirectionEye);
            vec3 eyeDir = normalize(-1.0 * vVertexPositionEye3);
            float cosPhi = clamp(dot(reflectionDir, eyeDir), 0.0, 1.0);
            cosPhi = pow(cosPhi, shininess);
            float specularFactor = 0.4;
            specularColor = specularFactor * (specularMaterialColor + uLightColor * cosPhi);
        }

        vec3 color = ambientColor + diffuseColor + specularColor;
        gl_FragColor = vec4(color, 1.0);
    }
    else {
            gl_FragColor = vec4(baseColor, 1.0);
    }
}