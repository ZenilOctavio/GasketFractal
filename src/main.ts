import vertexShadersSrc from './shaders/squares.vert'
import fragmentShadersSrc from './shaders/squares.frag'
import { loadWebGL2Context } from './utils/loaders'
import './style.css'

let canvas: HTMLCanvasElement | undefined
let gl : WebGL2RenderingContext | undefined
let  program : WebGLProgram | undefined
let aPositionLoc : number | undefined | null
let aPointSizeLoc : number | undefined | null
let aColor : number | undefined | null

let samples = 10000

function getData(){
  interface point {
    x: number
    y: number
  }
  let initialPoints = [
    {x:0,y:1},    
    {x:-1,y:-1},  
     {x:1,y:-1},  

  ]

  function getMidPoint(p1:point , p2: point) : point{
    return {x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/ 2}
  }

  let points = [...initialPoints, getMidPoint(initialPoints[0], initialPoints[2])]

  for(let i = 3; i < samples; i++){

    let randomPoint = initialPoints[Math.floor(Math.random() * 3)]
    let newPoint = getMidPoint(points[i], randomPoint)
    points.push(newPoint)
  }

  return points
}


function main() {
 [canvas, gl, program] = loadWebGL2Context(vertexShadersSrc, fragmentShadersSrc)

  if (!gl || !program) {
    return
  }

  const data = getData()

  const bufferDataArray = data.reduce((acc, cur) => {
    acc.push(cur.x, cur.y, 2, 1,0,0)
    return acc
  }, [] as number[])

  const bufferData = new Float32Array(bufferDataArray)


  aPositionLoc = gl.getAttribLocation(program, "aPosition")
  aPointSizeLoc = gl.getAttribLocation(program, "aPointSize")
  aColor = gl.getAttribLocation(program, "aColor")

  gl.enableVertexAttribArray(aPositionLoc)
  gl.enableVertexAttribArray(aPointSizeLoc)
  gl.enableVertexAttribArray(aColor)

  const buff = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buff)
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW)

  gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 6*4, 0)
  gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 6*4, 2*4)
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 6*4, 3*4)


  gl.drawArrays(gl.POINTS, 0, samples)

}

main()


