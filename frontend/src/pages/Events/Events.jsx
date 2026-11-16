import { useEffect, useState } from "react";
import QuestFreshers from "./Freshers";
import QuestEvents from "./PIQ";
import QuestTestSeries from "./QTS";

const PAGES = {
  "freshers": QuestFreshers,
  "placement-iq": QuestEvents,
  "quest-test-series": QuestTestSeries
};

const CSS = `
.events-hub{--bg:#05020b;--fg:#f1eaff;--mut:#b9a6e6;--acc:#a96bff;--card:rgba(30,12,60,.55);position:relative;isolation:isolate;min-height:max(540px,calc(100dvh - 96px));overflow:hidden;background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif}
.events-hub--detail{overflow:visible}
.events-hub,.events-hub *{box-sizing:border-box}
.events-hub canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
.events-hub #bloom{mix-blend-mode:screen;filter:blur(10px) saturate(1.1);opacity:.3;pointer-events:none}
.events-hub>header{position:absolute;top:0;left:0;right:0;padding:18px 24px 0;z-index:5;pointer-events:none;text-align:center}
.events-hub>header h1{margin:0;font-size:clamp(20px,3vw,30px);letter-spacing:.3em;font-weight:600;text-transform:uppercase;color:var(--fg)}
.events-hub #orbit{position:absolute;inset:0;pointer-events:none;z-index:1}
.ev{position:absolute;left:0;top:0;pointer-events:auto;display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:999px;background:var(--card);border:1px solid rgba(190,140,255,.5);backdrop-filter:blur(8px);color:var(--fg);text-decoration:none;font-weight:600;font-size:15px;white-space:nowrap;box-shadow:0 0 14px rgba(140,80,230,.3);cursor:pointer}
.ev:hover{background:rgba(120,60,220,.7)}
.ev span{font-size:20px}
.events-hub .hint{position:absolute;bottom:16px;left:0;right:0;text-align:center;color:var(--mut);font-size:13px;z-index:5;pointer-events:none}
.events-hub #page{position:relative;z-index:20;display:none;overflow:visible;background:rgba(5,2,11,.92);backdrop-filter:blur(10px);padding:24px 24px 40px}
.events-hub #page.on{display:block}
.events-hub .wrap{max-width:720px;margin:40px auto}
.events-hub .wrap a.back{color:var(--acc);text-decoration:none}
.events-hub .wrap h2{font-size:clamp(30px,6vw,52px);margin:18px 0 6px}
.events-hub .wrap .tag{color:var(--acc);letter-spacing:.2em;text-transform:uppercase;font-size:13px}
.events-hub .wrap p{color:var(--mut);line-height:1.6;font-size:17px}
.events-hub .meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:24px 0}
.events-hub .meta div{background:var(--card);border:1px solid rgba(190,140,255,.35);border-radius:14px;padding:14px}
.events-hub .meta b{display:block;font-size:12px;color:var(--mut);text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}
.events-hub .wrap ul{color:var(--fg);line-height:1.9}
.events-hub .btn{display:inline-block;margin-top:12px;padding:12px 26px;border-radius:999px;background:linear-gradient(90deg,#7b3dff,#c36bff);color:#fff;text-decoration:none;font-weight:600}
`;

export default function EventHorizon() {
  const [route, setRoute] = useState(location.hash.slice(1));

  useEffect(() => {
    const onHash = () => setRoute(location.hash.slice(1));
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  const Page = PAGES[route];

  useEffect(() => {
    document.title = "Event Horizon – Campus Events";

    const EVENTS={
     'freshers':{icon:'🎉',name:'Freshers Event'},
     'placement-iq':{icon:'🧠',name:'Placement IQ'},
     'quest-test-series':{icon:'📝',name:'Quest Test Series'}
    };
    const hub=document.querySelector('.events-hub');
    const keys=Object.keys(EVENTS), orbit=hub.querySelector('#orbit'), cards=[];
    orbit.innerHTML='';
    keys.forEach(k=>{const a=document.createElement('a');a.className='ev';a.href='#'+k;a.innerHTML='<span>'+EVENTS[k].icon+'</span>'+EVENTS[k].name;orbit.appendChild(a);cards.push(a)});

    /* ---------- WebGL black hole ---------- */
    const cv=hub.querySelector('#gl'),gl=cv.getContext('webgl2');
    const bl=hub.querySelector('#bloom'),bctx=bl.getContext('2d');
    const VS='#version 300 es\nin vec2 p;void main(){gl_Position=vec4(p,0,1);}';
    const FS=`#version 300 es
precision highp float;
uniform vec2 iResolution;uniform float iTime;uniform vec2 iMouse;uniform sampler2D uN;
out vec4 outc;
#define IT 110
const vec3 MainColor=vec3(1.0);
float noise(vec3 x){vec3 p=floor(x);vec3 f=fract(x);f=f*f*(3.0-2.0*f);
 vec2 uv=(p.xy+vec2(37.0,17.0)*p.z)+f.xy;
 vec2 rg=textureLod(uN,(uv+0.5)/256.0,0.0).yx;return -1.0+2.0*mix(rg.x,rg.y,f.z);}
float sat(float x){return clamp(x,0.0,1.0);}
vec3 sat3(vec3 x){return clamp(x,vec3(0.0),vec3(1.0));}
float rand(vec2 c){return sat(fract(sin(dot(c,vec2(12.9898,78.223)))*43758.5453));}
float pcurve(float x,float a,float b){float k=pow(a+b,a+b)/(pow(a,a)*pow(b,b));return k*pow(x,a)*pow(1.0-x,b);}
float sdTorus(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}
void Haze(inout vec3 color,vec3 pos,float alpha){
 float td=abs(sdTorus(pos+vec3(0.0,-0.05,0.0),vec2(1.0,0.01)));
 float b=1.0/(td*td+0.001);b*=length(pos)<0.5?0.0:1.0;
 color+=MainColor*b*(2.9/float(IT))*(1.0-alpha);}
void GasDisc(inout vec3 color,inout float alpha,vec3 pos){
 float discRadius=3.2,discWidth=5.3;float discInner=discRadius-discWidth*0.5;
 float discThickness=0.1;
 float dC=length(pos);float dD=pos.y;
 float rg=1.0-sat((dC-discInner)/discWidth*0.5);
 float coverage=pcurve(rg,4.0,0.9);
 discThickness*=rg;coverage*=sat(1.0-abs(dD)/discThickness);
 float dustGlow=1.0/(pow(1.0-rg,2.0)*290.0+0.002);
 vec3 dustColor=MainColor*dustGlow*8.2;
 coverage=sat(coverage*0.7);
 float fade=pow((abs(dC-discInner)+0.4),4.0)*0.04;
 float bf=1.0/(dD*dD*40.0+fade+0.00002);
 vec3 b=MainColor*pow(bf,1.5);
 b*=mix(vec3(1.7,1.1,1.0),vec3(0.5,0.6,1.0),vec3(pow(rg,2.0)));
 b*=mix(vec3(1.7,0.5,0.1),vec3(1.0),vec3(pow(rg,0.5)));
 dustColor=mix(dustColor,b*150.0,sat(1.0-coverage));
 coverage=sat(coverage+bf*bf*0.1);
 if(coverage<0.01)return;
 vec3 rc0;rc0.x=dC*1.5+0.55;rc0.y=atan(-pos.x,-pos.z)*1.5;rc0.z=dD*1.5;rc0*=0.95;
 float sp=0.14;
 float n1=1.0;vec3 rc=rc0;rc.y+=iTime*sp;
 n1*=noise(rc*3.0)*0.5+0.5;rc.y-=iTime*sp;
 n1*=noise(rc*6.0)*0.5+0.5;rc.y+=iTime*sp;
 n1*=noise(rc*12.0)*0.5+0.5;rc.y-=iTime*sp;
 n1*=noise(rc*24.0)*0.5+0.5;
 float n2=2.0;rc=rc0+30.0;
 n2*=noise(rc*3.0)*0.5+0.5;rc.y+=iTime*sp;
 n2*=noise(rc*6.0)*0.5+0.5;rc.y-=iTime*sp;
 n2*=noise(rc*12.0)*0.5+0.5;rc.y+=iTime*sp;
 n2*=noise(rc*24.0)*0.5+0.5;rc.y-=iTime*sp;
 n2*=noise(rc*48.0)*0.5+0.5;
 dustColor*=n1*0.998+0.002;coverage*=n2;
 dustColor*=2.0*(0.6+0.4*noise(vec3(rc0.y*4.0+iTime*sp*0.5,rc0.x*3.0,5.0)));
 coverage=sat(coverage*1200.0/float(IT));
 dustColor=max(vec3(0.0),dustColor);
 coverage*=pcurve(rg,4.0,0.9);
 color=(1.0-alpha)*dustColor*coverage+color;
 alpha=(1.0-alpha)*coverage+alpha;}
vec3 rotate(vec3 p,float x,float y,float z){
 mat3 mx=mat3(1.0,0.0,0.0,0.0,cos(x),sin(x),0.0,-sin(x),cos(x));
 mat3 my=mat3(cos(y),0.0,-sin(y),0.0,1.0,0.0,sin(y),0.0,cos(y));
 mat3 mz=mat3(cos(z),sin(z),0.0,-sin(z),cos(z),0.0,0.0,0.0,1.0);
 return my*(mz*(mx*p));}
void main(){
 vec2 fc=gl_FragCoord.xy;vec2 uv=fc/iResolution;float aspect=iResolution.x/iResolution.y;
 vec3 ev=normalize(vec3((uv*2.0-1.0)*vec2(aspect,1.0),6.0));
 vec3 ep=vec3(0.0,0.0,-10.0);
 vec3 ang=vec3(iMouse.y*0.05+0.08,1.0+iMouse.x,0.0);
 ev=rotate(ev,ang.x,ang.y,ang.z);ep=rotate(ep,ang.x,ang.y,ang.z);
 vec3 color=vec3(0.0);float alpha=0.0;
 float dither=rand(uv+fract(iTime))*2.0;
 vec3 rp=ep+ev*dither*15.0/float(IT);
 for(int i=0;i<IT;i++){
  float d=length(rp);
  ev=normalize(ev+normalize(-rp)/(d*d+0.000001)*5.0/float(IT)*1.0);
  rp+=ev*15.0/float(IT);
  GasDisc(color,alpha,rp);Haze(color,rp,alpha);}
 color=min(color*0.0001,vec3(1.0))*200.0*0.7;
 color=pow(color,vec3(1.5));color=color/(1.0+color);color=pow(color,vec3(1.0/1.5));
 color=mix(color,color*color*(3.0-2.0*color),vec3(1.0));
 color=sat3(color*1.01);
 float l=dot(color,vec3(0.34));
 color=mix(color,l*vec3(0.75,0.3,1.1),0.92);
 color=pow(sat3(color),vec3(0.7/2.2));
 outc=vec4(color,1.0);}`;
    function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o}
    const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);gl.useProgram(pr);
    const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    /* procedural noise texture (R = value, G = value shifted by (37,17)) */
    const N=256,r=new Uint8Array(N*N);for(let i=0;i<r.length;i++)r[i]=Math.random()*255;
    const td=new Uint8Array(N*N*4);
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=(y*N+x)*4;td[i]=r[y*N+x];td[i+1]=r[((y-17+N)%N)*N+((x-37+N)%N)];td[i+3]=255}
    const tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,N,N,0,gl.RGBA,gl.UNSIGNED_BYTE,td);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
    const U=n=>gl.getUniformLocation(pr,n);gl.uniform1i(U('uN'),0);
    let W,H,mx=0.35,my=0;
    function size(){const s=Math.min(devicePixelRatio,1)*0.9;W=cv.width=Math.round(hub.clientWidth*s);H=cv.height=Math.round(hub.clientHeight*s);gl.viewport(0,0,W,H)}
    size();addEventListener('resize',size);

    const SETTLE_AT = 5;     // seconds before rotation stops
    const SETTLE_DUR = 0.9;  // seconds the cards take to assemble
    let ang=0,speed=0.2,target=0.2,last=performance.now(),t0=last;
    cards.forEach(c=>{c.addEventListener('pointerenter',()=>target=0.04);c.addEventListener('pointerleave',()=>target=0.2)});
    let raf;
    function frame(now){
     const dt=Math.min((now-last)/1000,0.05);last=now;
     const elapsed=(now-t0)/1000;

     /* rotate only until exactly 5s, then freeze the angle */
     if(elapsed<SETTLE_AT){speed+=(target-speed)*0.08;ang-=speed*dt;}

     /* 0 → 1 over SETTLE_DUR starting at 5s, eased */
     const p=Math.min(1,Math.max(0,(elapsed-SETTLE_AT)/SETTLE_DUR)),e=p*p*(3-2*p);

     gl.uniform2f(U('iResolution'),W,H);gl.uniform1f(U('iTime'),elapsed);gl.uniform2f(U('iMouse'),mx,my);
     gl.drawArrays(gl.TRIANGLES,0,3);
     bctx.drawImage(cv,0,0,192,108);

     /* true viewport centre */
     const vw=hub.clientWidth,vh=hub.clientHeight;
     const cx=vw/2,cy=vh/2;
     const ws=cards.map(c=>c.offsetWidth),maxW=Math.max(...ws);
     const R=Math.max(40,Math.min(vw*0.38,560,vw/2-maxW*0.55-8)); /* keep orbit on-screen */

     /* bottom row: always side by side, scaled down if too wide */
     const gap=16,total=ws.reduce((a,b)=>a+b,0)+gap*(cards.length-1);
     const fit=Math.min(1,(vw-32)/total);
     const restY=vh-80;
     let acc=cx-(total*fit)/2;

     cards.forEach((c,i)=>{
      const a=ang+i*Math.PI*2/cards.length;
      const rx=Math.cos(a)*R,ry=Math.sin(a)*R*0.3,depth=(Math.sin(a)+1)/2; /* 1 = front */
      const s=0.75+depth*0.3;

      const restX=acc+(ws[i]*fit)/2;
      acc+=(ws[i]+gap)*fit;

      const px=(cx+rx)*(1-e)+restX*e,py=(cy+ry)*(1-e)+restY*e,sc=s*(1-e)+fit*e;
      c.style.transform='translate('+px+'px,'+py+'px) translate(-50%,-50%) scale('+sc+')';

      const gr=Math.min(vw,vh)*0.1,em=depth>0.5?1:Math.min(1,Math.max(0,(Math.hypot(rx,ry)-gr*0.5)/(gr*1.2)));
      const op=(0.55+depth*0.45)*em;
      c.style.opacity=op*(1-e)+e;
      c.style.zIndex=e>0.5?5:Math.round(depth*10);
      c.style.pointerEvents=(e>0.5||em>=0.3)?'auto':'none';
     });
     raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);

    // cleanup (needed in React so remounts don't stack listeners/loops)
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', size);
    };
  }, []);

  return (
    <div className={`events-hub${Page ? " events-hub--detail" : ""}`}>
      <style>{CSS}</style>
      <canvas id="gl"></canvas>
      <canvas id="bloom" width="192" height="108"></canvas>
      <header><h1>EVENTS</h1></header>
      <div id="orbit"></div>
      <div className="hint">Click an event to open it</div>
      {Page && (
        <section id="page" className="on">
          <a href="#home" style={{position:"absolute",top:16,left:20,zIndex:30,color:"#a96bff",textDecoration:"none",fontWeight:600}}>
            ← Back to the orbit
          </a>
          <Page />
        </section>
      )}
    </div>
  );
}