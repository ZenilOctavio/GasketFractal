import vertexShadersSrc from './shaders/squares.vert'
import fragmentShadersSrc from './shaders/squares.frag'
import { loadWebGL2Context } from './utils/loaders'
import './style.css'
import { generateCategorizer } from './category'
import { rotatePointWithCenter } from './utils/rotation'

// let canvas: HTMLCanvasElement
let gl: WebGL2RenderingContext
let program: WebGLProgram
let aPositionLoc: number
let aPointSizeLoc: number
let aColor: number
let buff: WebGLBuffer


interface point {
  x: number
  y: number
}

//Initial number of samples
let samples = 100
//Samples array cache
let dataCache: point[] = []

//Triangle dimensions
let height = 1.4
let width = 1.4

//Initial angle
let rad = 0


let rotationCenter = { x: 0, y: 0 }


//This function calculates the points needed if they are missing
function getData() {

  let initialPoints = [
    { x: 0, y: height / 2 },
    { x: -width / 2, y: -height / 2 },
    { x: width / 2, y: -height / 2 },

  ]

  function getMidPoint(p1: point, p2: point): point {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
  }

  if (dataCache.length < 4) {
    dataCache = [...initialPoints, getMidPoint(initialPoints[0], initialPoints[1])]
  }

  //Recycling the made samples
  if (dataCache.length < samples) {
    //Gasket calculations
    for (let i = dataCache.length - 1; i < samples; i++) {
      let randomPoint = initialPoints[Math.floor(Math.random() * 3)]
      let newPoint = getMidPoint(dataCache[i], randomPoint)

      dataCache.push(newPoint)

    }
  } else {
    dataCache = dataCache.splice(0, samples)
  }

  return dataCache
}


function main() {
  const variables = loadWebGL2Context(vertexShadersSrc, fragmentShadersSrc)

  //Guard clause if there was a problem while initializing the program
  if (variables.some((val) => !val))
    return


  [, gl, program] = [variables[0] as NonNullable<typeof variables[0]>, variables[1] as NonNullable<typeof variables[1]>, variables[2] as NonNullable<typeof variables[2]>]

  //Getting the location of the attributes needed
  aPositionLoc = gl.getAttribLocation(program, "aPosition")
  aPointSizeLoc = gl.getAttribLocation(program, "aPointSize")
  aColor = gl.getAttribLocation(program, "aColor")

  buff = gl.createBuffer()

  //Enable use of arrays for the attributes
  gl.enableVertexAttribArray(aPositionLoc)
  gl.enableVertexAttribArray(aPointSizeLoc)
  gl.enableVertexAttribArray(aColor)


  render()
}

let colors = [
  [0.7, 0.7, 0],
  [0, 0, 1],
  [0, 1, 0],
  [1, 0, 1],
  [0, 1, 1],
  [1, 1, 0],
  [0.4, 0.6, 0.8],
  [0.8, 0.3, 0.2],
  [0.2, 0.8, 0.2]
]

function render() {
  const data = getData()

  //Generate the function for categorization based on the height and width
  let getCategory = generateCategorizer(height, width)

  const bufferDataArray = data.reduce((acc, cur, i) => {

    const transformed = rotatePointWithCenter(cur, rotationCenter, rad)

    //Style different the main triangle (point size and color)
    if (i < 3) {
      acc.push(transformed.x, transformed.y, 10, 0, 0, 1)
      return acc
    }

    let category = getCategory(cur.x, cur.y)

    //Use blue as default color if there is an error while getting the category
    if (category == -1) {
      acc.push(transformed.x, transformed.y, 1, 0, 0, 1)
      return acc
    }

    let color = colors[category]
    acc.push(transformed.x, transformed.y, 2, ...color)


    return acc

  }, [] as number[])

  bufferDataArray.unshift(rotationCenter.x, rotationCenter.y, 10, 0, 0, 0)

  const bufferData = new Float32Array(bufferDataArray)

  gl.bindBuffer(gl.ARRAY_BUFFER, buff)
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW)

  //Declaring the position of the points
  //Arguments:
  //1- att location
  //2- size = 2 because im using a vec2 for x and y values
  //3- type = float
  //4- normalization = false
  //5- size of each row in the buffer 
  //6- offset = 0 because is the first value
  gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 6 * 4, 0)
  //Declaring the point size of each point
  //Arguments:
  //1- att location
  //2- size = 1 because im using single float
  //3- type = float
  //4- normalization = false
  //5- size of each row in the buffer 
  //6 -offset = 2*4 because this is after the first two values of the position
  gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 6 * 4, 2 * 4)
  //Declaring the color of each point
  //Arguments:
  //1- att location
  //2- size = 3 because im using a vec3 for rgb colors
  //3- type = float
  //4- normalization = false
  //5- size of each row in the buffer 
  //6 -offset = 3*4 because this is after the first two values of the position and the point size
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 6 * 4, 3 * 4)


  gl.drawArrays(gl.POINTS, 0, samples + 4)
}

function changeRotation(newRad: number) {
  rad = newRad
  render()
}

function changeRotationCenter(value: number, coord: 'x' | 'y') {
  rotationCenter[coord] = value
  render()
}

function initEventListeners() {

  const samplesInput = document.getElementById('samplesInput') as HTMLInputElement
  const rotationInput = document.getElementById('rotationInput') as HTMLInputElement
  const rotationSpan = document.getElementById('rotation')
  const rotateResetBtn = document.getElementById('rotateReset')
  const xRotationCenter = document.getElementById('xRotationCenter') as HTMLInputElement
  const yRotationCenter = document.getElementById('yRotationCenter') as HTMLInputElement
  const xCoord = document.getElementById('xCoord')
  const yCoord = document.getElementById('yCoord')


  //Samples slider
  samplesInput.addEventListener('input', (e) => {
    const numberOfSamplesSpan = document.getElementById('numberOfSamples')
    if (!e.target)
      return
    const input = e.target as HTMLInputElement

    samples = +input.value

    if (numberOfSamplesSpan)
      numberOfSamplesSpan.textContent = (+input.value).toString()

    render()
  })

  //Rotation buttons

  rotateResetBtn?.addEventListener('click', () => {
    changeRotation(0)
  })

  rotationInput.addEventListener('input', e => {
    const input = e.target as HTMLInputElement

    if (rotationSpan) {
      rotationSpan.textContent = input.value
    }

    const radValue = ((+input.value) / 180) * Math.PI
    changeRotation(radValue)

  })

  xRotationCenter.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement
    const val = +input.value / 100
    changeRotationCenter(val, 'x')

    if (!xCoord) return
    xCoord.textContent = val.toString()
  })
  yRotationCenter.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement
    const val = +input.value / 100
    changeRotationCenter(val, 'y')
    if (!yCoord) return
    yCoord.textContent = val.toString()

  })



}

main()
initEventListeners()


