import './style.css'

async function main () {
  // GET CONTEXT
  const canvas = document.getElementById('webgl')
  const gl = canvas.getContext('webgl')

  // FRAGMENT SOURCES
  const vResult = await fetch('./shaders/vertex.vert')
  const fResult = await fetch('./shaders/fragment.frag')
  const vSource = await vResult.text()
  const fSource = await fResult.text()

  // CREATE SHADERS
  const vShader = createShader(gl, vSource, gl.VERTEX_SHADER)
  const fShader = createShader(gl, fSource, gl.FRAGMENT_SHADER)

  // CREATE ANS SET UP PROGRAM
  const program = gl.createProgram()
  gl.attachShader(program, vShader)
  gl.attachShader(program, fShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  //
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  const positions = [
    -1.0,  1.0,
    1.0,  1.0,
    -1.0, -1.0,
    1.0, -1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW);

  const resLocation = gl.getUniformLocation(program, 'u_resolution')
  gl.uniform2f(resLocation,  500, 500)

  const timeLocation = gl.getUniformLocation(program, 'u_time')
  gl.uniform1f(timeLocation, 0.0)

  const MouseLocation = gl.getUniformLocation(program, 'u_mouse')
  gl.uniform2f(MouseLocation, 0,0)

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  const dateStart = new Date()

  const tick = () => {
    gl.uniform1f(timeLocation, (new Date() - dateStart) / 1000)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    window.requestAnimationFrame(tick)
  }

  tick()

  canvas.onmousemove = event => {
    gl.uniform2f(MouseLocation, event.clientX,event.clientY)
  }
}

// create shader
function createShader (gl, source, type) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  return shader
}

main().then()
// console.log(fSource)
