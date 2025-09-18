import vertexShadersSrc from './shaders/squares.vert'
import fragmentShadersSrc from './shaders/squares.frag'
import { loadWebGL2Context } from './utils/loaders'
import './style.css'

let canvas: HTMLCanvasElement | undefined
let gl : WebGL2RenderingContext | undefined
let  program : WebGLProgram | undefined
let uPositionLoc : WebGLUniformLocation | undefined | null
let uPointSizeLoc : WebGLUniformLocation | undefined | null
let uColor : WebGLUniformLocation | undefined | null




function main() {
 [canvas, gl, program] = loadWebGL2Context(vertexShadersSrc, fragmentShadersSrc)

  if (!gl || !program) {
    return
  }

  uPositionLoc = gl.getUniformLocation(program, "uPosition")
  uPointSizeLoc = gl.getUniformLocation(program, "uPointSize")
  uColor = gl.getUniformLocation(program, "uColor")


}

main()


canvas?.addEventListener('mousemove', (e) => {
  if (!canvas || !gl || !program || !uPositionLoc || !uPointSizeLoc || !uColor) {
    return
  }
  const rect = canvas?.getBoundingClientRect()

  const height = canvas.height
  const width = canvas.width

  const x = (e.clientX - rect.left) / (width / 2) - 1
  const y = ((e.clientY - rect.top) / (height / 2) - 1) * -1
  

  gl.uniform1f(uPointSizeLoc, 25)
  gl.uniform2f(uPositionLoc, x, y)
  gl.uniform4f(uColor, 1, 0, 0, 1)

  gl.drawArrays(gl.POINTS, 0, 1)
  

})
