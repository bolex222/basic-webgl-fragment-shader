// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D texture;

// noise func found on internet
float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    // normalized view port
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    vec2 Muv = u_mouse.xy / u_resolution.xy;
    Muv.y = 1. - Muv.y;

    float variying = sin(u_time) / 3. + 0.5;
    float variying2 = cos(u_time) / 3. + 0.5;

    float angle = u_time * PI;

    uv -= vec2(0.5);

    vec2 translating = uv;
    translating = (translating) * (mat2(cos(angle), -sin(angle), sin(angle), cos(angle)));

    translating = vec2(translating.x + variying - 0.5, translating.y + variying2 - 0.5);


    vec3 color = vec3((step(0.3333, translating.x + 0.5) - step(0.66666, translating.x + 0.5)) * (step(0.3333, translating.y + 0.5) - step(0.6666, translating.y + 0.5)));
    vec3 color2 = vec3(uv.x + 0.5, uv.y + 0.5, 1.);

    // image
    vec4 tex2d = texture2D(texture, vec2(uv.x, 1. - uv.y ));

//    gl_FragColor = vec4(tex2d.xyz, 1.);
    gl_FragColor = vec4(color2 + color, 1.);
}
