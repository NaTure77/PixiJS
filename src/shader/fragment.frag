precision mediump float;
uniform sampler2D uSampler;
uniform vec4 uTintColor;
uniform vec2 Resolution;
varying vec2 vTextureCoord;
uniform float utime;
//https://www.shadertoy.com/view/XdtSRN
vec4 mandelbrot()
{
    vec2 uv = (vTextureCoord - 0.5) * 4.0;
    uv.y *= 450. / 800.;
    //uv.y += Resolution.y * 0.5;


    vec2 z = vec2(uv);
    float ret = 0.;
    for (int i = 0; i < 300; i++) {

        // dot(z, z) > 4.0 is the same as length(z) > 2.0, but perhaps faster.
        if (dot(z, z) > 4.0) 
        {
            ret = float(i);
            break;
        }
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + uv;
    }
    //float ret = float(_mandelbrot(uv));
    return vec4(sin(vec3(0.1, 0.2, 0.5) * ret), 1);
}

float GetDist(vec3 p)
{
    vec4 s  = vec4(0, 1, 6, 1);

    float sphereDist = length(p - s.xyz)- s.w;
    float planeDist = p.y;

    float d = min(sphereDist, planeDist);
    return d;
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
    
    for(int i=0; i<100; i++) {
    	vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO > 100. || dS < .01) break;
    }
    
    return dO;
}


vec3 GetNormal(vec3 p) {
	float d = GetDist(p);
    vec2 e = vec2(.01, 0);
    
    vec3 n = d - vec3(
        GetDist(p-e.xyy),
        GetDist(p-e.yxy),
        GetDist(p-e.yyx));
    
    return normalize(n);
}

float GetLight(vec3 p) {
    vec3 lightPos = vec3(0, 5, 6);
    lightPos.xz += vec2(sin(utime), cos(utime))*2.;
    vec3 l = normalize(lightPos-p);
    vec3 n = GetNormal(p);
    
    float dif = clamp(dot(n, l), 0., 1.);
    float d = RayMarch(p+n*.01*2., l);
    if(d<length(lightPos-p)) dif *= .1;
    
    return dif;
}

vec4 sdf()
{
    vec2 fragCoord = vec2((vTextureCoord.x - 0.5) / 450. * 800., 1. - vTextureCoord.y - 0.5);
    vec2 uv = fragCoord;//(fragCoord - 0.5);
    //vec2 uv = (vTextureCoord - 0.5);

    vec3 col = vec3(0.);

    vec3 ro = vec3(0., 1, 0.);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1));

    float d = RayMarch(ro, rd);
    
    //d /= 6.;
    vec3 p = ro + rd * d;
    
    float dif = GetLight(p);
    col = vec3(dif);
    
    col = pow(col, vec3(.4545));


    return vec4(col, 1.0);
}


void main() {
    //gl_FragColor = mandelbrot();
    gl_FragColor = sdf();

    //gl_FragColor = vec4(uv.x, uv.y, 0, 1);
    
    //if(vTextureCoord.x * vTextureCoord.x + vTextureCoord.y * vTextureCoord.y < 1. ) gl_FragColor = vec4(1.0);
    //else gl_FragColor = vec4(0,0,0,1);
   
   //if(vTextureCoord.x < 0.5)gl_FragColor = vec4(1, 0,0,1);
    //else
    // gl_FragColor = vec4(vTextureCoord.x,  1. - vTextureCoord.y, 0, 1);
}