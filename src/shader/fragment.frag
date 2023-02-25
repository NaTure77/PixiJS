#version 300 es
precision mediump float;
uniform sampler2D uSampler;
uniform vec4 uTintColor;
uniform vec2 Resolution;
in vec2 vTextureCoord;
uniform float utime;
out vec4 fragColor;
//https://www.shadertoy.com/view/XdtSRN
vec4 mandelbrot()
{
    vec2 fragCoord = vec2((vTextureCoord.x - 0.5) / 450. * 800. , 1. - vTextureCoord.y - 0.5);
    vec2 uv = fragCoord;
    //vec2 uv = (vTextureCoord - 0.5) * 4.0;
    //uv.y *= 450. / 800.;
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


//https://www.shadertoy.com/view/XlGBW3
/*float GetDist(vec3 p)
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
    vec2 fragCoord = vec2((vTextureCoord.x - 0.5) / 450. * 800. , 1. - vTextureCoord.y - 0.5);
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
}*/

//https://www.shadertoy.com/view/7tdcWr
float sdBox(vec3 p, vec3 b)
{
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}
float sdBox(float p, float b)
{
    return abs(p) - b;
}
float usdBox(in vec3 p, in vec3 b)
{
    return length(max(abs(p) - b, 0.0));
}

vec2 opRepLim(in vec2 p, in float s, in vec2 lim)
{
    return p - s * clamp(round(p / s), -lim, lim);
}

vec2 opRepLim(in vec2 p, in float s, in vec2 limmin, in vec2 limmax)
{
    return p - s * clamp(round(p / s), -limmin, limmax);
}

float hash1(vec2 p)
{
    p = 50.0 * fract(p * 0.3183099);
    return fract(p.x * p.y * (p.x + p.y));
}
float ndot(vec2 a, vec2 b) { return a.x * b.x - a.y * b.y; }
float sdRhombus(in vec2 p, in vec2 b, in float r)
{
    vec2 q = abs(p);
    float h = clamp((-2.0 * ndot(q, b) + ndot(b, b)) / dot(b, b), -1.0, 1.0);
    float d = length(q - 0.5 * b * vec2(1.0 - h, 1.0 + h));
    d *= sign(q.x * b.y + q.y * b.x - b.x * b.y);
    return d - r;
}

vec3 temple(in vec3 p)
{
     vec3 op = p;    
    vec3 res = vec3(-1.0,-1.0,0.5);

    p.y -= 1.0;

    // bounding box
    float bbox = usdBox(p,vec3(15.0,12.0,15.0)*1.5 );
    if( bbox>5.0 ) return vec3(bbox+1.0,-1.0,0.5);
    
    
    
    
    
    
    vec3 q = p;
   // q.xz = mod(q.xz + 2.0, 4.0) - 2.0;
    q.xz = opRepLim(q.xz, 4.0, vec2(4.0, 2.0));
    float rad = 0.9;
    rad -= 0.05 * q.y;
    rad -=  0.1 - 0.1 *pow( 0.5 + 0.5 * sin(16.0 *atan(q.x,q.z)),2.0);
    //rad +=  0.15 *pow( 0.5 + 0.5 * sin(q.y * 3.0),0.12) - 0.15;
    rad -= 0.15 * pow(0.5 + 0.5 * sin(q.y * 3.0),128.0);
    // columns
    float d = length(q.xz) - rad;
    d = max(d,p.y - 6.0);
    d = max(d,-p.y - 5.0);


    
    
    d *= 0.7;
    
    vec3 qq = vec3(q.x, abs(q.y - 0.3) - 5.5, q.z);
    
    d = min(d, sdBox(qq, vec3(1.4, 0.2, 1.4) + sign(q.y - 0.3) * vec3(0.1, 0.05, 0.1)-0.05)-0.15);
    
    d = max(d, -sdBox(p, vec3(14.0, 6.0, 6.0))-0.3);
    


    //d = 1e20;
    //floor
    {
    q = p;
    q.y += 6.0;
    q.xz = opRepLim(p.xz, 4.0, vec2(4.0, 2.0));
    
    //마지막 0.2 빼면 박스가 라운드 처리 됨.
    d = min(d, sdBox(q, vec3(1.9, 0.4, 1.9)-0.2)-0.2);
    }
    
    {
    q = p;
    q.z -= 2.0;
    q.x += 2.0;
    q.y += 7.0;
    q.xz = opRepLim(q.xz, 4.0, vec2(4.0, 3.0), vec2(5.0,2.0));
    
    //마지막 0.2 빼면 박스가 라운드 처리 됨.
    d = min(d, sdBox(q, vec3(1.9, 0.4, 1.9)-0.2)-0.2);
    }
    {
    q = p;
    q.y += 8.0;
    q.xz = opRepLim(q.xz, 4.0, vec2(5.0, 4.0), vec2(5.0,3.0));
    
    //마지막 0.2 빼면 박스가 라운드 처리 됨.
    d = min(d, sdBox(q, vec3(1.9, 0.4, 1.9)-0.2)-0.2);
    }
    
    //roof
    
    //지붕 밑에
     q = vec3( mod(p.x+2.0,4.0)-2.0, p.y, mod(p.z+0.0,4.0)-2.0 );
    float b = sdBox( q-vec3(0.0,7.0,0.0), vec3(1.95,1.0,1.95)-0.15 )-0.15;
    b = max( b, sdBox(p-vec3(0.0,7.0,0.0),vec3(18.0,1.0,10.0)) );
    if( b<d ) { d = b; res.z = hash1( floor((p.xz+vec2(2.0,0.0))/4.0) + 31.1 ); }
    
     q = vec3( mod(p.x+0.5,1.0)-0.5, p.y, mod(p.z+0.5,1.0)-0.5 );
    b = sdBox( q-vec3(0.0,8.0,0.0), vec3(0.45,0.5,0.45)-0.02 )-0.02;
    b = max( b, sdBox(p-vec3(0.0,8.0,0.0),vec3(19.0,0.2,11.0)) );
	//q = p+vec3(0.0,0.0,-0.5); q.xz = opRepLim( q.xz, 1.0, vec2(19.0,10.0) );
    //b = sdBox( q-vec3(0.0,8.0,0.0), vec3(0.45,0.2,0.45)-0.02 )-0.02;
    if( b<d ) { d = b; res.z = hash1( floor((p.xz+0.5)/1.0) + 7.8 ); }

    
    
     b = sdRhombus( p.yz-vec2(8.2,0.0), vec2(3.0,11.0), 0.05 ) ;
    q = vec3( mod(p.x+1.0,2.0)-1.0, p.y, mod(p.z+1.0,2.0)-1.0 );
    b = max( b, -sdBox( vec3( abs(p.x)-20.0,p.y,q.z)-vec3(0.0,8.0,0.0), vec3(2.0,5.0,0.1) )-0.02 );
    
    b = max( b, -p.y+8.2 );
    b = max( b, usdBox(p-vec3(0.0,8.0,0.0),vec3(19.0,12.0,11.0)) );
    float c = sdRhombus( p.yz-vec2(8.3,0.0), vec2(2.25,8.5), 0.05 );
    c = max( c, sdBox(abs(p.x)-19.0,2.0) );
    b = max( b, -c );    
    

    d = min( d, b );

    
    res = vec3( d, 1.0, res.z );

    return res;
}
vec3 map( in vec3 p )
{
    vec3 res = temple(p);
    
    // floor
    float m = p.y + 7.5;
    if( m<res.x ) res = vec3( m, 2.0, 0.0 );

    return res;
}
vec3 calcNormal( in vec3 p, in float t )
{ 
    float e = 0.001*t;

    vec2 h = vec2(1.0,-1.0)*0.5773;
    return normalize( h.xyy*map( p + h.xyy*e ).x + 
					  h.yyx*map( p + h.yyx*e ).x + 
					  h.yxy*map( p + h.yxy*e ).x + 
					  h.xxx*map( p + h.xxx*e ).x ); 
}


vec3 intersect( in vec3 ro, in vec3 rd )
{
    vec2 ma = vec2(0.0);

    vec3 res = vec3(-1.0);
    
    float tmax = 1000.0;

        
    float t = 10.0;
    for( int i=0; i<256; i++ )
    {
        vec3 pos = ro + t*rd;
        vec3 h = map( pos );
        if( h.x<(0.0001*t) || t>tmax ) break;
        t += h.x;

        ma = h.yz;
    }

    if( t<tmax )
    {
    	res = vec3(t, ma);
    }

    return res;//vec3(0,0,0);
}
mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}
vec4 temple_main()
{
    vec2 fragCoord = vec2((vTextureCoord.x - 0.5) / 450. * 800. , 1. - vTextureCoord.y - 0.5);
    vec2 uv = fragCoord;//(fragCoord - 0.5);
    //vec2 uv = (vTextureCoord - 0.5);
    float an = sin(utime*0.2)*0.5;
    float ra = 100.0;
    float fl = 2.5;
    vec3 ta = vec3(0.0,-2.0,0.0);
    vec3 ro = ta + vec3(ra*sin(an),20.0,ra*cos(an));
     mat3 ca = setCamera( ro, ta, 0.0 );
    vec3 rd = ca * normalize( vec3(uv.xy,fl));

    vec3 res = intersect(ro, rd);
    float t = res.x;
    vec3 hitPos = ro + t * rd;
    vec3 nor = calcNormal(hitPos, t);

    //nor.z *= -1.;
    float d = -dot(nor, normalize(rd));

    return vec4(vec3(d), 1);
}

void main() {
    fragColor = mandelbrot();
    //gl_FragColor = sdf();
    //fragColor = temple_main();
    //gl_FragColor = vec4(1, 1,0,1);
}