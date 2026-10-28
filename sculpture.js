/* Original procedural sculpture: three connected loops for application, evaluation, governance. */
(() => {
  'use strict';
  const canvas=document.getElementById('sculpture');
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});
  if(!gl)return;
  const vertex=`attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.,1.);}`;
  const fragment=`precision highp float;
uniform vec2 u_resolution;uniform float u_time;uniform vec2 u_pointer;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
vec2 scene(vec3 p){
 p.xz=rot(.48+u_time*.075+u_pointer.x*.12)*p.xz;
 p.yz=rot(-.34+u_pointer.y*.1)*p.yz;
 float a=length(vec2(length(p.xy)-1.12,p.z))-.235;
 vec3 q=p;q.yz=rot(1.12)*q.yz;q.xz=rot(.58)*q.xz;
 float b=length(vec2(length(q.xy)-1.12,q.z))-.235;
 vec3 r=p;r.xz=rot(1.16)*r.xz;r.yz=rot(-.54)*r.yz;
 float c=length(vec2(length(r.xy)-1.12,r.z))-.235;
 if(a<b&&a<c)return vec2(a,1.);if(b<c)return vec2(b,2.);return vec2(c,3.);
}
vec3 normal(vec3 p){vec2 e=vec2(.0015,0.);return normalize(vec3(scene(p+e.xyy).x-scene(p-e.xyy).x,scene(p+e.yxy).x-scene(p-e.yxy).x,scene(p+e.yyx).x-scene(p-e.yyx).x));}
vec3 env(vec3 d){float l=pow(max(0.,d.y*.5+.5),.7);vec3 c=mix(vec3(.11,.13,.10),vec3(.94,.96,.91),l);c+=vec3(.95)*smoothstep(.70,.81,d.x)*smoothstep(.97,.86,d.x);c+=vec3(.6)*pow(max(0.,dot(d,normalize(vec3(-.8,.5,1.)))),24.);return c;}
void main(){
 vec2 uv=(gl_FragCoord.xy*2.-u_resolution)/u_resolution.y;
 float aspect=u_resolution.x/u_resolution.y;
 if(aspect<.95)uv*=1.13;
 vec3 ro=vec3(0.,0.,4.7);vec3 rd=normalize(vec3(uv,-3.15));
 float t=0.;vec2 hit;bool found=false;
 for(int i=0;i<75;i++){vec3 p=ro+rd*t;hit=scene(p);if(hit.x<.002){found=true;break;}t+=hit.x*.82;if(t>8.)break;}
 if(!found){gl_FragColor=vec4(0.);return;}
 vec3 p=ro+rd*t;vec3 n=normal(p);vec3 refl=reflect(rd,n);vec3 light=normalize(vec3(-.5,.8,1.));
 float diffuse=max(0.,dot(n,light));float fresnel=pow(1.-max(0.,dot(n,-rd)),3.);
 float ao=clamp(scene(p+n*.14).x/.14,.30,1.);
 vec3 col;
 if(hit.y>1.5&&hit.y<2.5){vec3 base=vec3(.68,.82,.28);col=base*(.38+diffuse*.62);col+=env(refl)*(.18+fresnel*.32);col+=vec3(.6)*pow(max(0.,dot(reflect(-light,n),-rd)),75.);}
 else {col=env(refl)*(.72+fresnel*.25);col=mix(col,vec3(.39,.43,.35)*(.5+diffuse*.5),.18);col+=vec3(.8)*pow(max(0.,dot(reflect(-light,n),-rd)),100.);}
 col*=ao;col=pow(col,vec3(.93));gl_FragColor=vec4(col,1.);
}`;
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);return null;}return s;}
  const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return;
  const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const resolution=gl.getUniformLocation(program,'u_resolution'),time=gl.getUniformLocation(program,'u_time'),pointer=gl.getUniformLocation(program,'u_pointer');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused=false,visible=true,frame=0,last=0,elapsed=0,pointerX=0,pointerY=0;
  function resize(){const rect=canvas.getBoundingClientRect();const scale=Math.min(window.devicePixelRatio||1,1.25)*.8;canvas.width=Math.max(1,Math.round(rect.width*scale));canvas.height=Math.max(1,Math.round(rect.height*scale));gl.viewport(0,0,canvas.width,canvas.height);draw();}
  function draw(){gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform1f(time,elapsed);gl.uniform2f(pointer,pointerX,pointerY);gl.drawArrays(gl.TRIANGLES,0,6);canvas.parentElement.classList.add('ready');}
  function tick(now){frame=0;if(paused||reduce.matches||!visible||document.hidden)return;if(now-last>=32){elapsed+=Math.min((now-last)/1000,.05);last=now;draw();}frame=requestAnimationFrame(tick);}
  function schedule(){if(frame)cancelAnimationFrame(frame);frame=0;last=performance.now();if(!paused&&!reduce.matches&&visible&&!document.hidden)frame=requestAnimationFrame(tick);else draw();}
  window.addEventListener('portfolio-motion',e=>{paused=e.detail.paused;schedule();});
  document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',schedule);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{rootMargin:'50px'});observer.observe(canvas);
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);
  document.querySelector('.hero').addEventListener('pointermove',e=>{if(reduce.matches||paused||e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5;},{passive:true});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(frame)cancelAnimationFrame(frame);canvas.parentElement.classList.remove('ready');});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  resize();schedule();
})();
