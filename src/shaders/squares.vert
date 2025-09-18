#version 300 es
  uniform float uPointSize;
  uniform vec2 uPosition;

  void main() {
    gl_Position = vec4(uPosition, 0.0, 1.0); 
    gl_PointSize = uPointSize;
  }

