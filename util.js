const vs = `
varying vec2 fuv;

void main()
{
    fuv = uv;
    gl_Position = vec4(position, 1);
}
`

const ShaderScene =(fragmentShader, uniforms)=> {
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2),
    new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader: vs,
      uniforms
    })
  ));
  return scene
}

const loop = f => {
  let inner = () => {
    f()
    requestAnimationFrame(inner)
  }
  requestAnimationFrame(inner)
}

const mpos = e => {
  const rect = canvas.getBoundingClientRect();
  const style = window.getComputedStyle(document.querySelector("#canvas"))
  return new THREE.Vector2(
    (e.clientX - rect.left) / +style.width.slice(0,-2),
    (rect.height - (e.clientY - rect.top) - 1) / +style.height.slice(0,-2)
  )
}