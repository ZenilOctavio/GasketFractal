#version 300 es
  in float aPointSize;
  in vec2 aPosition;
  in vec3 aColor;
  out vec3 oColor;


  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0); 
    gl_PointSize = aPointSize;
    oColor = aColor;
  }

