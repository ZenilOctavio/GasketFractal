interface point {
  x: number
  y: number
}

//Rotates a point using the rotation matrix
export function rotatePoint(point: point, rad: number) {
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const x1 = (point.x * cos) - (point.y * sin)
  const y1 = (point.y * cos + (point.x * sin))

  return { x: x1, y: y1 }
}

//Rotates a point with an arbitrary rotation center
export function rotatePointWithCenter(point: point, center: point, rad: number) {

  //We create a new vector with the center so that we "move" our vector to
  //the rotation center's point
  let transformedPoint = { x: point.x - center.x, y: point.y - center.y }

  //Use the transformed coordinates of each point with an specific rotation
  transformedPoint = rotatePoint(transformedPoint, rad)

  //We add back the rotation center to our transformed vector to "move" the 
  //start of our vector to the origin
  return { x: transformedPoint.x + center.x, y: transformedPoint.y + center.y }

}
