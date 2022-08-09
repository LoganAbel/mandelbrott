const draw = `
varying vec2 fuv;

uniform vec2 offset;
uniform vec2 size;

#define MAX_ITER 128

float mandelbrot(vec2 p) {
  vec2 c = p;
  for(int i = 0; i < MAX_ITER; i ++) {
    p = c + vec2(p.x*p.x-p.y*p.y, 2.*p.x*p.y);
    float len = dot(p,p);
    if(len > 256.)
      return (float(i) - log2(log2(len)) + 4.0) / float(MAX_ITER);
  }
}

vec3 mapcolor(float t) {
  return 0.5 + 0.5*cos(2.7+t*30.0 + vec3(0.0,.6,1.0));
}

void main() {
  gl_FragColor = vec4(mapcolor(mandelbrot(fuv / size + offset)), 1);
}
`;

const canvas = document.querySelector("#canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
const renderer = new THREE.WebGLRenderer({canvas});

const camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);

const size = { value: new THREE.Vector2(0.2, 0.2*canvas.width/canvas.height) } 
const offset = { value: new THREE.Vector2(-2.7, -1.15) } 

const scene = ShaderScene(draw, { offset, size })

let mdown = false
let oldp;
canvas.onmousedown = e => {
  mdown = true
  oldp = mpos(e);
}
canvas.onmouseup = e => {
  mdown = false
}
canvas.onmousemove = e => {
  if (mdown) {
    let newp = mpos(e)
    offset.value.add(oldp.sub(newp).divide(size.value))
    oldp = newp
  }
}
canvas.onwheel = e => {
  const dy = e.deltaY < 0 ? 1/.8 : .8;
  offset.value.sub(mpos(e).multiplyScalar(1/dy-1).divide(size.value));
  size.value.multiplyScalar(dy);
};

loop(() => {
  renderer.render(scene, camera);
})