#ifdef GL_ES
precision highp float;
precision highp int;
#endif

uniform vec2 resolution;
uniform vec3 color;
uniform vec3 ink;
uniform sampler2D uTexture;

void main() {
    vec2 uv = gl_FragCoord.xy;
    uv.y = resolution.y - uv.y; // y coordinate is inverted

    //---------------------------------------------

    vec2 inkCenter = ink.xy;
    vec2 inkToPosition = uv - inkCenter;
    float magnitude = length(inkToPosition);
    vec4 selectedColor;

    if (magnitude < ink.z) {
        selectedColor = vec4(color, 1.0);
    }
    else { // displacement
        // float proportion = (ink.z * ink.z * ink.z * ink.z) / (magnitude * magnitude * magnitude); // cells
        float proportion = ink.z / magnitude;
        proportion *= proportion * proportion / 1.5;

        if (proportion > 0.0001) { // affecting all pixels makes it blurry
            // float movement = 1.0 + proportion; // black hole
            float movement = 1.0 - proportion;
            inkToPosition *= sqrt(movement);
            inkToPosition += inkCenter;

            inkToPosition /= resolution; // normalize
            selectedColor = texture2D(uTexture, inkToPosition);
        }
        else {
            selectedColor = texture2D(uTexture, uv / resolution);
        }
    }

    gl_FragColor = selectedColor;
}
