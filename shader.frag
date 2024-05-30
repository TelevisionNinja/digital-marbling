#ifdef GL_ES
precision highp float;
precision highp int;
#endif

uniform vec2 resolution;
uniform vec3 color;
uniform vec3 ink;
uniform sampler2D uTexture;
uniform float isTine;
uniform vec2 previousMouse;

void main() {
    vec2 uv = gl_FragCoord.xy;
    uv.y = resolution.y - uv.y; // y coordinate is inverted

    //---------------------------------------------

    vec2 inkCenter = ink.xy;
    vec2 inkToPosition = uv - inkCenter;
    float magnitude = length(inkToPosition);
    vec4 selectedColor;

    if (isTine > 0.5) { // tine | there is no bool
        float proportion = exp(-magnitude * length(vec2(ink.z) / resolution) * 4.0);
        vec2 coordinate = uv - proportion * (inkCenter - previousMouse);
        coordinate /= resolution; // normalize
        selectedColor = texture2D(uTexture, coordinate);
    }
    else {
        if (magnitude < ink.z) { // drop ink
            selectedColor = vec4(color, 1.0);
        }
        else { // displacement
            float proportion = exp(-magnitude * length(vec2(ink.z) / resolution) * 4.0);
            vec2 coordinate = uv - proportion * inkToPosition;
            coordinate /= resolution; // normalize
            selectedColor = texture2D(uTexture, coordinate);
        }
    }

    gl_FragColor = selectedColor;
}
