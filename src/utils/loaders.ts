type loadWebGL2ContextReturnType = [HTMLCanvasElement, WebGL2RenderingContext, WebGLProgram] | [undefined, undefined, undefined]



export function loadWebGL2Context(vertexShaderSource: string, fragmentShaderSource: string): loadWebGL2ContextReturnType {
  const zero: loadWebGL2ContextReturnType = [undefined, undefined, undefined]
  const canvas = document.querySelector("canvas")

  if (!canvas) {
    alert("unable to get canvas")
    return zero
  }


  const gl = canvas.getContext("webgl2")

  if (gl == null) {
    alert("unable to initialize webgl")
    return zero
  }


  const program = gl.createProgram()
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)


  if (program == null || vertexShader == null || fragmentShader == null) {
    alert("unable to create program")
    return zero
  }

  gl.shaderSource(vertexShader, vertexShaderSource)
  gl.compileShader(vertexShader)
  gl.attachShader(program, vertexShader)


  gl.shaderSource(fragmentShader, fragmentShaderSource)
  gl.compileShader(fragmentShader)
  gl.attachShader(program, fragmentShader)


  gl.linkProgram(program)


  //Review if there was an error while linking and logging
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.group()
    console.error(gl.getShaderInfoLog(vertexShader) ?? 'Couldnt get vertex shader info log')
    console.error(gl.getShaderInfoLog(fragmentShader) ?? 'Couldnt get fragment shader info log')
    console.groupEnd()
  }

  gl.useProgram(program)

  return [canvas, gl, program]

}
