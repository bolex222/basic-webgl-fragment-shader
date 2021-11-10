// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

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

    // image
    vec4 text2d = texture2D(texture, vec2(uv.x, 1. - uv.y));
    // noise
    vec3 noise = vec3(rand(vec2(uv.x, uv.y + sin(u_time * 1000.))));

    // basis sinusoidale curve
    float basis_curve = (sin(u_time*-1.5 + uv.x * 1.5) / 6.5);

    //mouse
    vec3 mouse = vec3(1. - distance(Muv, uv) * 1.5);

    // define poistions
    float p1 = basis_curve + 0.15;
    float p2 = basis_curve + 0.25;
    float p3 = basis_curve + 0.35;
    float p4 = basis_curve + 0.45;
    float p5 = basis_curve + 0.55;
    float p6 = basis_curve + 0.65;
    float p7 = basis_curve + 0.75;
    float p8 = basis_curve + 0.85;

    // defines curves
    float redWave = step(uv.y, p8) - step(uv.y, p7);
    float orangeWave = step(uv.y, p7) - step(uv.y, p6);
    float yellowWave = step(uv.y, p6) - step(uv.y, p5);
    float greenWave = step(uv.y, p5) - step(uv.y, p4);
    float blueWave = step(uv.y, p4) - step(uv.y, p3);
    float purpleWave = (step(uv.y, p3) - step(uv.y, p2));
    float pinkWave = step(uv.y, p2) - step(uv.y, p1);

    //define colors
    vec3 redColor = vec3(redWave, 0., 0.);
    vec3 orangeColor = vec3(orangeWave, orangeWave * 0.65, 0.);
    vec3 yellowColor = vec3(yellowWave, yellowWave, 0.);
    vec3 greenColor = vec3(0, greenWave, 0);
    vec3 blueColor = vec3(0, 0, blueWave);
    vec3 purpleColor = vec3(purpleWave * 0.5, 0., purpleWave * 0.5);
    vec3 pinkColor = vec3(pinkWave, pinkWave * 0.75, pinkWave * 0.8);

    // final result
    vec3 color = (redColor + blueColor + greenColor + orangeColor + yellowColor + pinkColor + purpleColor);// * noise; //* mouse;


//    gl_FragColor = vec4(color, 1.);
    gl_FragColor = vec4(text2d.xyz * color.xyz, 1.);
}
