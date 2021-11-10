import './style.css'

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

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

  const text = await createTexture(gl, './image/image.jpg')

  const textLoc = gl.getUniformLocation(program, 'texture')
  gl.uniform1i(textLoc, 7)

  gl.activeTexture(gl.TEXTURE7);
  gl.bindTexture(gl.TEXTURE_2D, text);

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

/**
 *
 * @param gl
 * @param source
 * @return {Promise<WebGLTexture>}
 */
function createTexture (gl, source) {
  return new Promise(resolve => {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    const level = 0
    const internalFormat = gl.RGBA
    const srcFormat = gl.RGBA
    const srcType = gl.UNSIGNED_BYTE

    const image = new Image()
    image.onload = () => {
      gl.bindTexture(
        gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        srcFormat,
        srcType,
        image)
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }

      resolve(texture)
    }
    image.src = source
  })
}

main().then()
// console.log(fSource)
